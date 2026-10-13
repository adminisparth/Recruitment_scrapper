# app/services/skills.py

LANGUAGES = {
    "python",
    "java",
    "javascript",
    "typescript",
    "c",
    "c++",
    "c#",
    "go",
    "rust",
    "ruby",
    "php",
    "swift",
    "kotlin",
    "scala",
    "r",
    "dart",
}


ALIASES = {
    "ml": "machine learning",
    "ai": "artificial intelligence",

    "amazon web services": "aws",
    "aws": "aws",

    "google cloud platform": "gcp",
    "gcp": "gcp",

    "microsoft azure": "azure",
    "azure": "azure",

    "js": "javascript",
    "node": "node.js",
    "nodejs": "node.js",

    "ts": "typescript",

    "postgres": "postgresql",

    "tf": "tensorflow",

    "sklearn": "scikit-learn",

    "k8s": "kubernetes",

    "reactjs": "react",
    "nextjs": "next.js",
    "vuejs": "vue",

    "expressjs": "express",

    "fast api": "fastapi",

    "lang chain": "langchain",
    "lang graph": "langgraph",

    "power bi": "powerbi",

    "natural language processing": "nlp",
}


def canon(skill: str) -> str:
    """
    Convert a skill into its canonical form.
    """

    if not skill:
        return ""

    value = (
        skill
        .strip()
        .lower()
    )

    return ALIASES.get(
        value,
        value,
    )


def _skill_present(
    skill: str,
    text: str,
) -> bool:
    """
    Check whether a skill appears in text.
    """

    if not skill or not text:
        return False

    skill = canon(skill)

    text = text.lower()

    # Exact phrase matching
    return skill in text


def match_skills(
    required_skills: list[str],
    evidence_tokens: set[str] | list[str],
    evidence_text: str,
) -> tuple[list[str], list[str]]:
    """
    Match required skills against candidate evidence.

    Returns:

        matched_skills
        missing_skills
    """

    evidence_token_set = {
        canon(str(token))
        for token in evidence_tokens
    }

    text = (
        evidence_text
        or ""
    ).lower()

    matched = []
    missing = []

    for skill in required_skills:

        canonical = canon(skill)

        if not canonical:
            continue

        # Token-level match
        if canonical in evidence_token_set:

            matched.append(
                canonical
            )

        # Text-level match
        elif _skill_present(
            canonical,
            text,
        ):

            matched.append(
                canonical
            )

        else:

            missing.append(
                canonical
            )

    # Remove duplicates while preserving order
    matched = list(
        dict.fromkeys(matched)
    )

    missing = list(
        dict.fromkeys(missing)
    )

    return matched, missing


# ============================================================
# LOCATION NORMALIZATION
# ============================================================

COUNTRY_ALIASES = {
    "india": "India",
    "ind": "India",

    "united states": "United States",
    "united states of america": "United States",
    "usa": "United States",
    "us": "United States",

    "united kingdom": "United Kingdom",
    "uk": "United Kingdom",
    "great britain": "United Kingdom",
    "england": "United Kingdom",

    "canada": "Canada",
    "australia": "Australia",

    "germany": "Germany",
    "france": "France",
    "italy": "Italy",
    "spain": "Spain",

    "singapore": "Singapore",

    "uae": "United Arab Emirates",
    "united arab emirates": "United Arab Emirates",

    "netherlands": "Netherlands",
    "switzerland": "Switzerland",
    "ireland": "Ireland",
    "japan": "Japan",
    "south korea": "South Korea",
    "china": "China",
    "brazil": "Brazil",
    "mexico": "Mexico",
}


CITY_ALIASES = {
    # India
    "bangalore": "Bangalore",
    "bengaluru": "Bangalore",
    "blr": "Bangalore",

    "mumbai": "Mumbai",
    "bombay": "Mumbai",

    "new delhi": "Delhi",
    "delhi": "Delhi",

    "hyderabad": "Hyderabad",
    "pune": "Pune",
    "chennai": "Chennai",
    "kolkata": "Kolkata",
    "calcutta": "Kolkata",

    "ahmedabad": "Ahmedabad",
    "jaipur": "Jaipur",
    "chandigarh": "Chandigarh",
    "gurgaon": "Gurgaon",
    "gurugram": "Gurgaon",
    "noida": "Noida",

    # United States
    "new york": "New York",
    "new york city": "New York",
    "san francisco": "San Francisco",
    "los angeles": "Los Angeles",
    "seattle": "Seattle",
    "boston": "Boston",
    "chicago": "Chicago",
    "austin": "Austin",

    # Europe
    "london": "London",
    "berlin": "Berlin",
    "paris": "Paris",
    "amsterdam": "Amsterdam",
    "dublin": "Dublin",

    # Asia
    "singapore": "Singapore",
    "tokyo": "Tokyo",
    "beijing": "Beijing",
    "shanghai": "Shanghai",
}


def normalize_country(
    country: str | None,
) -> str | None:
    """
    Normalize a country name.
    """

    if not country:
        return None

    value = country.strip().lower()

    if not value:
        return None

    return COUNTRY_ALIASES.get(
        value,
        country.strip().title(),
    )


def normalize_city(
    city: str | None,
) -> str | None:
    """
    Normalize a city name.
    """

    if not city:
        return None

    value = city.strip().lower()

    if not value:
        return None

    return CITY_ALIASES.get(
        value,
        city.strip().title(),
    )


def location_match_score(
    candidate_location: str | None,
    required_country: str | None,
    required_city: str | None,
) -> float:
    """
    Calculate candidate location compatibility.

    1.0 = exact city match
    0.7 = same country
    0.0 = different/unknown location

    If no country is specified by the job,
    location is neutral and returns 0.5.
    """

    if not required_country:
        return 0.5

    if not candidate_location:
        return 0.0

    candidate = (
        candidate_location
        .strip()
        .lower()
    )

    if not candidate:
        return 0.0

    country = (
        required_country
        .strip()
        .lower()
    )

    city = (
        required_city
        .strip()
        .lower()
        if required_city
        else None
    )

    # Exact city match
    if city and city in candidate:
        return 1.0

    # Direct country match
    if country in candidate:
        return 0.7

    # Check aliases
    canonical_country = normalize_country(
        required_country
    )

    if canonical_country:

        aliases = [
            alias
            for alias, canonical
            in COUNTRY_ALIASES.items()
            if canonical == canonical_country
        ]

        if any(
            alias in candidate
            for alias in aliases
        ):
            return 0.7

    return 0.0                                                                                  