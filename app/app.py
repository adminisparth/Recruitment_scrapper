import requests
import streamlit as st


# ============================================================
# CONFIGURATION
# ============================================================

API_BASE_URL = "http://localhost:8000"

GITHUB_API_URL = f"{API_BASE_URL}/api/discover"
RESUME_API_URL = f"{API_BASE_URL}/api/discover-resumes"


# ============================================================
# PAGE CONFIG
# ============================================================

st.set_page_config(
    page_title="ROCK N ROLL — DISCOVER",
    page_icon="🚀",
    layout="wide",
)


# ============================================================
# CUSTOM CSS
# ============================================================

st.markdown(
    """
    <style>

    .main-title {
        font-size: 42px;
        font-weight: 800;
        margin-bottom: 0px;
    }

    .subtitle {
        font-size: 18px;
        color: #888888;
        margin-bottom: 30px;
    }

    .score-box {
        padding: 12px;
        border-radius: 10px;
        border: 1px solid #444;
        text-align: center;
    }

    .hf-box {
        padding: 15px;
        border-radius: 10px;
        border: 1px solid #444;
        margin-top: 10px;
    }

    .skill-pill {
        display: inline-block;
        padding: 4px 9px;
        margin: 3px;
        border-radius: 12px;
        background-color: #262626;
        font-size: 13px;
    }

    </style>
    """,
    unsafe_allow_html=True,
)


# ============================================================
# HEADER
# ============================================================

st.markdown(
    '<div class="main-title">🚀 ROCK N ROLL — DISCOVER</div>',
    unsafe_allow_html=True,
)

st.markdown(
    '<div class="subtitle">'
    "AI-Powered Talent Discovery & Workforce Intelligence"
    "</div>",
    unsafe_allow_html=True,
)


# ============================================================
# SIDEBAR
# ============================================================

with st.sidebar:

    st.header("⚙️ Configuration")

    st.markdown("### Discovery Source")

    discovery_mode = st.radio(
        "Choose candidate source:",
        [
            "GitHub",
            "Upload Resumes",
        ],
    )

    st.divider()

    st.markdown("### Ranking")

    top_n = st.number_input(
        "Number of candidates",
        min_value=1,
        max_value=500,
        value=100,
        step=1,
    )

    shortlist_n = st.number_input(
        "Shortlist size",
        min_value=1,
        max_value=500,
        value=3,
        step=1,
    )

    st.divider()

    st.markdown("### 🧠 AI Stack")

    st.caption("LangGraph")
    st.caption("LangChain")
    st.caption("GitHub")
    st.caption("Hugging Face")
    st.caption("Universal Sentence Encoder")
    st.caption("Two-Tower Neural Network")
    st.caption("FastAPI")

    st.divider()

    st.caption(
        "AI recommends. Humans make the final decision."
    )


# ============================================================
# JOB DESCRIPTION
# ============================================================

st.markdown("## 1️⃣ Job Description")

job_description = st.text_area(
    "Enter the job description",
    value="""Machine Learning Engineer

We are looking for a Machine Learning Engineer with 2+ years of experience.

Required skills:
Python, TensorFlow, PyTorch, Machine Learning,
Deep Learning, NLP, FastAPI, Docker, Git, AWS.

The candidate should have hands-on experience building,
training, deploying, and maintaining machine learning
and deep learning models.

Experience with NLP, Transformers, model deployment,
and production ML systems is highly preferred.

Location: Bangalore, India.""",
    height=260,
)


# ============================================================
# CANDIDATE SOURCE
# ============================================================

uploaded_files = []

if discovery_mode == "GitHub":

    st.markdown("## 2️⃣ Candidate Source")

    st.info(
        "🔎 GitHub mode automatically searches GitHub and "
        "optionally enriches candidates using Hugging Face."
    )

    st.markdown(
        """
        **Pipeline**

        `Job Description`
        → `Qwen Job Extraction`
        → `LangGraph`
        → `GitHub Discovery`
        → `GitHub Enrichment`
        → `Hugging Face Enrichment`
        → `Two-Tower`
        → `Skill + Experience Ranking`
        """
    )

    button_text = "🔍 Discover Candidates from GitHub"

else:

    st.markdown("## 2️⃣ Upload Candidate Resumes")

    uploaded_files = st.file_uploader(
        "Upload candidate resumes",
        type=["pdf", "docx"],
        accept_multiple_files=True,
        help="You can upload multiple PDF or DOCX resumes.",
    )

    if uploaded_files:

        st.success(
            f"✅ {len(uploaded_files)} resume(s) selected."
        )

        with st.expander("📄 Selected Resumes"):

            for file in uploaded_files:

                st.write(
                    f"📄 {file.name} "
                    f"({file.size / 1024:.1f} KB)"
                )

    else:

        st.info(
            "Upload one or more PDF/DOCX resumes to continue."
        )

    st.markdown(
        """
        **Pipeline**

        `Job Description`
        → `Resume Parser`
        → `Candidate Extraction`
        → `Two-Tower`
        → `Skill + Experience Ranking`
        """
    )

    button_text = "📄 Discover Candidates from Resumes"


# ============================================================
# RUN BUTTON
# ============================================================

st.markdown("## 3️⃣ Run Discovery")

run_discovery = st.button(
    button_text,
    type="primary",
    use_container_width=True,
)


# ============================================================
# VALIDATION
# ============================================================

if run_discovery:

    if len(job_description.strip()) < 20:

        st.error(
            "❌ Job description must contain at least 20 characters."
        )

        st.stop()

    if shortlist_n > top_n:

        st.error(
            "❌ Shortlist size cannot be greater than "
            "the number of candidates."
        )

        st.stop()

    if discovery_mode == "Upload Resumes" and not uploaded_files:

        st.error(
            "❌ Please upload at least one resume."
        )

        st.stop()


    # ========================================================
    # GITHUB REQUEST
    # ========================================================

    if discovery_mode == "GitHub":

        payload = {
            "job_description": job_description,
            "top_n": int(top_n),
            "shortlist_n": int(shortlist_n),
        }

        try:

            with st.spinner(
                "🔎 Searching GitHub → Hugging Face → ranking candidates..."
            ):

                response = requests.post(
                    GITHUB_API_URL,
                    json=payload,
                    timeout=300,
                )

        except requests.exceptions.ConnectionError:

            st.error(
                "❌ Cannot connect to FastAPI.\n\n"
                "Make sure the FastAPI server is running on "
                "http://localhost:8000"
            )

            st.stop()

        except requests.exceptions.Timeout:

            st.error(
                "⏱️ Request timed out.\n\n"
                "Candidate discovery took longer than 300 seconds."
            )

            st.stop()

        except Exception as exc:

            st.error(
                f"❌ Unexpected error: {exc}"
            )

            st.stop()


    # ========================================================
    # RESUME REQUEST
    # ========================================================

    else:

        multipart_files = []

        for file in uploaded_files:

            multipart_files.append(
                (
                    "files",
                    (
                        file.name,
                        file.getvalue(),
                        file.type or "application/octet-stream",
                    ),
                )
            )

        form_data = {
            "job_description": job_description,
            "top_n": str(int(top_n)),
            "shortlist_n": str(int(shortlist_n)),
        }

        try:

            with st.spinner(
                "📄 Processing resumes and ranking candidates..."
            ):

                response = requests.post(
                    RESUME_API_URL,
                    data=form_data,
                    files=multipart_files,
                    timeout=300,
                )

        except requests.exceptions.ConnectionError:

            st.error(
                "❌ Cannot connect to FastAPI.\n\n"
                "Make sure the FastAPI server is running on "
                "http://localhost:8000"
            )

            st.stop()

        except requests.exceptions.Timeout:

            st.error(
                "⏱️ Request timed out.\n\n"
                "Resume processing took longer than 300 seconds."
            )

            st.stop()

        except Exception as exc:

            st.error(
                f"❌ Unexpected error: {exc}"
            )

            st.stop()


    # ========================================================
    # API ERROR
    # ========================================================

    if response.status_code != 200:

        st.error(
            f"❌ API request failed — HTTP {response.status_code}"
        )

        with st.expander("🔧 API Error Response"):

            st.code(
                response.text,
                language="json",
            )

        st.stop()


    # ========================================================
    # PARSE RESPONSE
    # ========================================================

    try:

        result = response.json()

    except Exception:

        st.error(
            "❌ FastAPI returned an invalid JSON response."
        )

        st.code(response.text)

        st.stop()


    # ========================================================
    # EXTRACT RESULT DATA
    # ========================================================

    top_candidates = result.get(
        "top_candidates",
        [],
    )

    shortlist = result.get(
        "shortlist",
        [],
    )

    requirements = result.get(
        "requirements",
        {},
    )

    warnings = result.get(
        "warnings",
        [],
    )

    semantic_model = result.get(
        "semantic_model",
        "Unknown",
    )

    disclaimer = result.get(
        "disclaimer",
        "AI recommends. Humans make the final decision.",
    )


    # ========================================================
    # SUCCESS
    # ========================================================

    st.success(
        "✅ Candidate discovery completed successfully!"
    )

    st.markdown("---")


    # ========================================================
    # SUMMARY
    # ========================================================

    st.markdown("## 📊 Discovery Summary")

    col1, col2, col3, col4 = st.columns(4)

    with col1:

        st.metric(
            "Candidates",
            len(top_candidates),
        )

    with col2:

        st.metric(
            "Shortlisted",
            len(shortlist),
        )

    with col3:

        st.metric(
            "Source",
            discovery_mode,
        )

    with col4:

        if "two-tower" in semantic_model.lower():

            model_name = "Two-Tower"

        else:

            model_name = "USE"

        st.metric(
            "Ranking Model",
            model_name,
        )


    # ========================================================
    # EXTRACTED REQUIREMENTS
    # ========================================================

    st.markdown("## 🧠 Extracted Job Requirements")

    if requirements:

        col1, col2 = st.columns(2)

        with col1:

            st.write("**Job Title**")

            st.write(
                requirements.get(
                    "title",
                    "N/A",
                )
            )

            st.write("**Required Skills**")

            skills = requirements.get(
                "skills",
                [],
            )

            if skills:

                st.success(
                    ", ".join(skills)
                )

            else:

                st.write(
                    "None detected."
                )

        with col2:

            st.write("**Minimum Experience**")

            experience = requirements.get(
                "min_years_experience"
            )

            if experience is not None:

                st.write(
                    f"{experience} years"
                )

            else:

                st.write(
                    "Not specified."
                )

            st.write("**Location**")

            st.write(
                requirements.get(
                    "location",
                    "Not specified.",
                )
            )

            summary = requirements.get("summary")

            if summary:

                st.write("**Role Summary**")
                st.write(summary)

    else:

        st.info(
            "No extracted requirements returned."
        )


    # ========================================================
    # HELPER FUNCTIONS
    # ========================================================

    def safe_float(value, default=0.0):

        try:

            if value is None:
                return default

            return float(value)

        except (TypeError, ValueError):

            return default


    def percentage(value):

        return f"{safe_float(value) * 100:.1f}%"


    def render_huggingface(candidate):

        hf = candidate.get("huggingface")

        hf_username = candidate.get(
            "huggingface_username"
        )

        hf_url = candidate.get(
            "huggingface_url"
        )

        if not hf and not hf_username:

            st.info(
                "🤗 No Hugging Face profile linked/found."
            )

            return

        st.markdown("### 🤗 Hugging Face Evidence")

        if hf_url:

            st.markdown(
                f"[Open Hugging Face Profile]({hf_url})"
            )

        if hf_username:

            st.write(
                f"**Username:** `{hf_username}`"
            )

        if not hf:

            return

        name = hf.get("name")

        bio = hf.get("bio")

        if name:

            st.write(
                f"**Name:** {name}"
            )

        if bio:

            st.write(
                f"**Bio:** {bio}"
            )


        # ----------------------------------------------------
        # HF SKILLS
        # ----------------------------------------------------

        hf_skills = hf.get(
            "skills",
            [],
        )

        if hf_skills:

            st.write("**Detected HF Skills:**")

            st.success(
                ", ".join(hf_skills)
            )


        # ----------------------------------------------------
        # HF MODELS
        # ----------------------------------------------------

        models = hf.get(
            "models",
            [],
        )

        if models:

            with st.expander(
                f"🤖 Models ({len(models)})"
            ):

                for model in models:

                    model_id = model.get(
                        "id",
                        "Unknown",
                    )

                    pipeline = model.get(
                        "pipeline_tag"
                    )

                    downloads = model.get(
                        "downloads",
                        0,
                    )

                    likes = model.get(
                        "likes",
                        0,
                    )

                    url = model.get(
                        "url"
                    )

                    st.markdown(
                        f"**{model_id}**"
                    )

                    if pipeline:

                        st.caption(
                            f"Task: {pipeline}"
                        )

                    st.caption(
                        f"⬇️ {downloads:,} downloads "
                        f"| ❤️ {likes}"
                    )

                    if url:

                        st.markdown(
                            f"[View Model]({url})"
                        )

                    st.divider()


        # ----------------------------------------------------
        # HF DATASETS
        # ----------------------------------------------------

        datasets = hf.get(
            "datasets",
            [],
        )

        if datasets:

            with st.expander(
                f"📊 Datasets ({len(datasets)})"
            ):

                for dataset in datasets:

                    dataset_id = dataset.get(
                        "id",
                        "Unknown",
                    )

                    downloads = dataset.get(
                        "downloads",
                        0,
                    )

                    likes = dataset.get(
                        "likes",
                        0,
                    )

                    url = dataset.get(
                        "url"
                    )

                    st.markdown(
                        f"**{dataset_id}**"
                    )

                    st.caption(
                        f"⬇️ {downloads:,} downloads "
                        f"| ❤️ {likes}"
                    )

                    if url:

                        st.markdown(
                            f"[View Dataset]({url})"
                        )

                    st.divider()


        # ----------------------------------------------------
        # HF SPACES
        # ----------------------------------------------------

        spaces = hf.get(
            "spaces",
            [],
        )

        if spaces:

            with st.expander(
                f"🚀 Spaces ({len(spaces)})"
            ):

                for space in spaces:

                    space_id = space.get(
                        "id",
                        "Unknown",
                    )

                    sdk = space.get(
                        "sdk"
                    )

                    likes = space.get(
                        "likes",
                        0,
                    )

                    url = space.get(
                        "url"
                    )

                    st.markdown(
                        f"**{space_id}**"
                    )

                    if sdk:

                        st.caption(
                            f"SDK: {sdk}"
                        )

                    st.caption(
                        f"❤️ {likes} likes"
                    )

                    if url:

                        st.markdown(
                            f"[View Space]({url})"
                        )

                    st.divider()


    def render_repositories(candidate):

        top_repos = candidate.get(
            "top_repos",
            [],
        )

        if not top_repos:

            return

        with st.expander(
            f"📦 Top GitHub Repositories ({len(top_repos)})"
        ):

            for repo in top_repos:

                repo_name = repo.get(
                    "name",
                    "Unknown",
                )

                repo_description = repo.get(
                    "description"
                )

                repo_language = repo.get(
                    "language"
                )

                repo_stars = repo.get(
                    "stars",
                    0,
                )

                repo_url = repo.get(
                    "url"
                )

                st.markdown(
                    f"**{repo_name}**"
                )

                if repo_description:

                    st.write(
                        repo_description
                    )

                st.caption(
                    f"Language: "
                    f"{repo_language or 'N/A'} "
                    f"| ⭐ {repo_stars}"
                )

                if repo_url:

                    st.markdown(
                        f"[View Repository]({repo_url})"
                    )

                st.divider()


    # ========================================================
    # AI SHORTLIST
    # ========================================================

    st.markdown("## 🏆 AI Shortlist")

    if not shortlist:

        st.warning(
            "No candidates were shortlisted."
        )

    else:

        for index, candidate in enumerate(
            shortlist,
            start=1,
        ):

            name = (
                candidate.get("name")
                or candidate.get("username")
                or "Unknown Candidate"
            )

            username = candidate.get(
                "username",
                "N/A",
            )

            score = safe_float(
                candidate.get("score")
            )

            semantic_score = safe_float(
                candidate.get("semantic_score")
            )

            skill_coverage = safe_float(
                candidate.get("skill_coverage")
            )

            experience_score = safe_float(
                candidate.get("experience_score")
            )

            location_score = safe_float(
                candidate.get("location_score")
            )

            st.markdown(
                f"### 🥇 #{index} — {name}"
            )

            st.caption(
                f"@{username}"
            )

            # ------------------------------------------------
            # SCORE METRICS
            # ------------------------------------------------

            col1, col2, col3, col4, col5 = st.columns(5)

            with col1:

                st.metric(
                    "Final Score",
                    percentage(score),
                )

            with col2:

                st.metric(
                    "Semantic",
                    percentage(semantic_score),
                )

            with col3:

                st.metric(
                    "Skills",
                    percentage(skill_coverage),
                )

            with col4:

                st.metric(
                    "Experience",
                    percentage(experience_score),
                )

            with col5:

                st.metric(
                    "Location",
                    percentage(location_score),
                )


            # ------------------------------------------------
            # BASIC INFORMATION
            # ------------------------------------------------

            location = candidate.get(
                "location"
            )

            if location:

                st.write(
                    f"📍 **Location:** {location}"
                )

            years = candidate.get(
                "years_active"
            )

            if years is not None:

                st.write(
                    f"💼 **GitHub Activity:** "
                    f"{safe_float(years):.1f} years"
                )


            bio = candidate.get(
                "bio"
            )

            if bio:

                st.write(
                    f"**About:** {bio}"
                )


            # ------------------------------------------------
            # SKILLS
            # ------------------------------------------------

            matched_skills = candidate.get(
                "matched_skills",
                [],
            )

            missing_skills = candidate.get(
                "missing_skills",
                [],
            )

            st.write(
                "✅ **Matched Skills**"
            )

            if matched_skills:

                st.success(
                    ", ".join(matched_skills)
                )

            else:

                st.write(
                    "No matching skills detected."
                )


            st.write(
                "❌ **Missing Skills**"
            )

            if missing_skills:

                st.warning(
                    ", ".join(missing_skills)
                )

            else:

                st.success(
                    "No missing required skills."
                )


            # ------------------------------------------------
            # LINKS
            # ------------------------------------------------

            profile_url = candidate.get(
                "profile_url"
            )

            if profile_url and profile_url.startswith(
                "http"
            ):

                st.markdown(
                    f"[🔗 View GitHub Profile]({profile_url})"
                )


            hf_url = candidate.get(
                "huggingface_url"
            )

            if hf_url and hf_url.startswith(
                "http"
            ):

                st.markdown(
                    f"[🤗 View Hugging Face Profile]({hf_url})"
                )


            # ------------------------------------------------
            # REPOSITORIES
            # ------------------------------------------------

            render_repositories(
                candidate
            )


            # ------------------------------------------------
            # HUGGING FACE
            # ------------------------------------------------

            with st.expander(
                "🤗 Hugging Face Evidence"
            ):

                render_huggingface(
                    candidate
                )


            st.divider()


    # ========================================================
    # COMPLETE RANKING
    # ========================================================

    st.markdown("## 📋 Complete Candidate Ranking")

    if top_candidates:

        for index, candidate in enumerate(
            top_candidates,
            start=1,
        ):

            name = (
                candidate.get("name")
                or candidate.get("username")
                or "Unknown"
            )

            username = candidate.get(
                "username",
                "N/A",
            )

            score = safe_float(
                candidate.get("score")
            )

            with st.expander(
                f"#{index} | {name} | {score * 100:.2f}%"
            ):

                col1, col2 = st.columns(2)

                with col1:

                    st.write(
                        f"**Username:** {username}"
                    )

                    st.write(
                        f"**Location:** "
                        f"{candidate.get('location', 'N/A')}"
                    )

                    years = candidate.get(
                        "years_active"
                    )

                    if years is not None:

                        st.write(
                            f"**GitHub Activity:** "
                            f"{safe_float(years):.1f} years"
                        )

                with col2:

                    st.write(
                        f"**Semantic Score:** "
                        f"{percentage(candidate.get('semantic_score'))}"
                    )

                    st.write(
                        f"**Skill Coverage:** "
                        f"{percentage(candidate.get('skill_coverage'))}"
                    )

                    st.write(
                        f"**Experience Score:** "
                        f"{percentage(candidate.get('experience_score'))}"
                    )

                    st.write(
                        f"**Location Score:** "
                        f"{percentage(candidate.get('location_score'))}"
                    )


                matched = candidate.get(
                    "matched_skills",
                    [],
                )

                missing = candidate.get(
                    "missing_skills",
                    [],
                )

                if matched:

                    st.success(
                        "Matched: "
                        + ", ".join(matched)
                    )

                if missing:

                    st.warning(
                        "Missing: "
                        + ", ".join(missing)
                    )


                profile_url = candidate.get(
                    "profile_url"
                )

                if profile_url and profile_url.startswith(
                    "http"
                ):

                    st.markdown(
                        f"[🔗 Open GitHub Profile]({profile_url})"
                    )


                hf_url = candidate.get(
                    "huggingface_url"
                )

                if hf_url and hf_url.startswith(
                    "http"
                ):

                    st.markdown(
                        f"[🤗 Open Hugging Face Profile]({hf_url})"
                    )


                render_repositories(
                    candidate
                )

                with st.expander(
                    "🤗 Hugging Face Evidence"
                ):

                    render_huggingface(
                        candidate
                    )

    else:

        st.warning(
            "No candidates returned."
        )


    # ========================================================
    # WARNINGS
    # ========================================================

    if warnings:

        st.markdown("## ⚠️ Pipeline Warnings")

        for warning in warnings:

            st.warning(warning)


    # ========================================================
    # MODEL INFORMATION
    # ========================================================

    st.markdown("## 🤖 Ranking Model")

    st.info(
        f"Semantic model used: **{semantic_model}**"
    )

    st.caption(
        "The Two-Tower model learns semantic compatibility "
        "between job and candidate representations."
    )


    # ========================================================
    # DISCLAIMER
    # ========================================================

    st.markdown("---")

    st.caption(
        f"⚖️ {disclaimer}"
    )


    # ========================================================
    # RAW API RESPONSE
    # ========================================================

    with st.expander(
        "🔧 Raw API Response"
    ):

        st.json(result)