from __future__ import annotations

import json
import os
import re
from functools import lru_cache
from typing import Any

from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_groq import ChatGroq


from app.schemas import JobRequirements


# ============================================================
# CONFIGURATION
# ============================================================

GROQ_MODEL = os.getenv(
    "GROQ_MODEL",
    "openai/gpt-oss-20b",
)

GROQ_TEMPERATURE = float(
    os.getenv(
        "GROQ_TEMPERATURE",
        "0",
    )
)






# ============================================================
# JOB EXTRACTION PROMPT
# ============================================================

JOB_EXTRACTION_PROMPT = """
You are an expert job requirement extraction system.

Your task is to read a job description and extract the
important requirements needed for candidate discovery.

Extract exactly these fields:

1. job_title
   - The main job or role title.
   - Example: "Machine Learning Engineer"

2. skills
   - A list of important technical skills, programming
     languages, frameworks, libraries, tools, platforms,
     databases and technologies.
   - Do not include generic soft skills such as teamwork,
     communication, hardworking, leadership, etc.
   - Remove duplicate skills.

3. min_years_experience
   - Minimum years of professional experience required.
   - If the job says "2+ years", return 2.
   - If the job says "3-5 years", return 3.
   - If no experience requirement is present, return 0.

4. location
   - Extract the job location if explicitly mentioned.
   - If no location is mentioned, return an empty string.

Return ONLY valid JSON.

The JSON must follow exactly this structure:

{{
    "job_title": "",
    "skills": [],
    "min_years_experience": 0,
    "location": ""
}}

Do not return:

- Markdown
- ```json
- Explanations
- Comments
- Extra fields

Job Description:

{job_description}
"""


# ============================================================
# GROQ MODEL
# ============================================================

@lru_cache(maxsize=1)
def _chat_model() -> ChatGroq:
    """
    Create and cache the Groq chat model.
    """

    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        raise RuntimeError(
            "GROQ_API_KEY is not configured. "
            "Add GROQ_API_KEY to your .env file."
        )

    return ChatGroq(
        model=GROQ_MODEL,
        temperature=GROQ_TEMPERATURE,
        api_key=api_key,
    )
    


# ============================================================
# LANGCHAIN CHAIN
# ============================================================

@lru_cache(maxsize=1)
def _chain():
    """
    Build:

        ChatPromptTemplate
              ↓
           Groq
              ↓
       StrOutputParser
    """

    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                JOB_EXTRACTION_PROMPT,
            )
        ]
    )

    model = _chat_model()

    parser = StrOutputParser()

    return prompt | model | parser


# ============================================================
# JSON CLEANING
# ============================================================

def _clean_json_response(text: str) -> str:
    """
    Clean the response returned by Groq.

    Handles responses such as:

        ```json
        {
            ...
        }
        ```

    and removes accidental text around the JSON object.
    """

    if not text:
        raise ValueError(
            "Groq returned an empty response."
        )

    text = str(text).strip()

    # --------------------------------------------------------
    # Remove markdown code fences
    # --------------------------------------------------------

    text = re.sub(
        r"^```(?:json)?\s*",
        "",
        text,
        flags=re.IGNORECASE,
    )

    text = re.sub(
        r"\s*```$",
        "",
        text,
        flags=re.IGNORECASE,
    )

    text = text.strip()

    # --------------------------------------------------------
    # Extract JSON object if Groq returned additional text
    # --------------------------------------------------------

    first_brace = text.find("{")
    last_brace = text.rfind("}")

    if (
        first_brace != -1
        and last_brace != -1
        and last_brace > first_brace
    ):
        text = text[
            first_brace:last_brace + 1
        ]

    return text.strip()


# ============================================================
# SKILL NORMALIZATION
# ============================================================

def _normalize_skills(
    skills: Any,
) -> list[str]:
    """
    Convert skills into a clean unique list.
    """

    if skills is None:
        return []

    # --------------------------------------------------------
    # Handle case where LLM returns:
    #
    # "Python, SQL, Machine Learning"
    # --------------------------------------------------------

    if isinstance(skills, str):
        skills = re.split(
            r"[,|;/]",
            skills,
        )

    if not isinstance(skills, list):
        return []

    result: list[str] = []
    seen: set[str] = set()

    for skill in skills:

        if skill is None:
            continue

        skill = str(skill).strip()

        if not skill:
            continue

        # Normalize whitespace
        skill = re.sub(
            r"\s+",
            " ",
            skill,
        )

        # Remove accidental punctuation
        skill = skill.strip(
            " \t\n\r.,;:|-"
        )

        if not skill:
            continue

        key = skill.lower()

        if key in seen:
            continue

        seen.add(key)
        result.append(skill)

    return result


# ============================================================
# EXPERIENCE NORMALIZATION
# ============================================================

def _normalize_experience(
    value: Any,
) -> float:
    """
    Convert experience requirement to a number.

    Examples:

        2              -> 2
        "2 years"      -> 2
        "2+ years"     -> 2
        "3-5 years"    -> 3
        "minimum 4 yrs" -> 4
    """

    if value is None:
        return 0.0

    if isinstance(
        value,
        (int, float),
    ):
        return max(
            0.0,
            float(value),
        )

    text = str(value).strip().lower()

    if not text:
        return 0.0

    match = re.search(
        r"(\d+(?:\.\d+)?)",
        text,
    )

    if not match:
        return 0.0

    try:
        return max(
            0.0,
            float(match.group(1)),
        )

    except (
        TypeError,
        ValueError,
    ):
        return 0.0


# ============================================================
# LOCATION NORMALIZATION
# ============================================================

def _normalize_location(
    value: Any,
) -> str:
    """
    Normalize location text.
    """

    if value is None:
        return ""

    value = str(value).strip()

    if not value:
        return ""

    value = re.sub(
        r"\s+",
        " ",
        value,
    )

    return value


# ============================================================
# JOB TITLE NORMALIZATION
# ============================================================

def _normalize_job_title(
    value: Any,
) -> str:
    """
    Normalize job title.
    """

    if value is None:
        return ""

    value = str(value).strip()

    value = re.sub(
        r"\s+",
        " ",
        value,
    )

    return value


# ============================================================
# RESPONSE PARSING
# ============================================================

def _parse_response(
    response: str,
) -> dict[str, Any]:
    """
    Parse Groq's JSON response and normalize the fields.
    """

    cleaned = _clean_json_response(
        response
    )

    try:

        data = json.loads(
            cleaned
        )

    except json.JSONDecodeError as exc:

        raise ValueError(
            "Groq returned invalid JSON.\n\n"
            f"Raw response:\n{response}"
        ) from exc

    if not isinstance(
        data,
        dict,
    ):
        raise ValueError(
            "Groq response must be a JSON object."
        )

    # --------------------------------------------------------
    # Extract fields
    # --------------------------------------------------------

    job_title = _normalize_job_title(
        data.get("job_title")
    )

    skills = _normalize_skills(
        data.get("skills")
    )

    min_years_experience = _normalize_experience(
        data.get(
            "min_years_experience"
        )
    )

    location = _normalize_location(
        data.get("location")
    )

    return {
        "title": job_title,
        "skills": skills,
        "min_years_experience": min_years_experience,
        "location": location,
    }


# ============================================================
# MAIN FUNCTION
# ============================================================

async def extract_job_requirements(
    job_description: str,
) -> JobRequirements:
    """
    Extract structured job requirements using Groq.

    Flow:

        Job Description
              ↓
        LangChain Prompt
              ↓
        Groq LLM
              ↓
        JSON
              ↓
        Normalization
              ↓
        JobRequirements
    """

    # --------------------------------------------------------
    # Validate input
    # --------------------------------------------------------

    if job_description is None:
        raise ValueError(
            "Job description cannot be None."
        )

    job_description = str(
        job_description
    ).strip()

    if not job_description:
        raise ValueError(
            "Job description cannot be empty."
        )

    # --------------------------------------------------------
    # Call Groq
    # --------------------------------------------------------

    try:

        response = await _chain().ainvoke(
            {
                "job_description": job_description
            }
        )

    except Exception as exc:

        raise RuntimeError(
            "Groq job requirement extraction failed: "
            f"{exc}"
        ) from exc

    # --------------------------------------------------------
    # Parse Groq response
    # --------------------------------------------------------

    try:

        data = _parse_response(
            response
        )

    except Exception as exc:

        raise RuntimeError(
            "Failed to parse Groq job extraction response: "
            f"{exc}"
        ) from exc

    # --------------------------------------------------------
    # Convert to your Pydantic model
    # --------------------------------------------------------

    try:

        return JobRequirements.model_validate(
            data
        )

    except Exception as exc:

        raise RuntimeError(
            "Extracted job requirements do not match "
            "the JobRequirements schema: "
            f"{exc}"
        ) from exc