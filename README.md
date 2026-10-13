<<<<<<< HEAD
# Rock N Roll – Discover Server

Part 1 of the platform: **"Who should we hire?"**
Job description → extracted requirements → GitHub candidate search → ranked Top 10 → Top 3 shortlist.

## Setup
```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in keys
uvicorn app.main:app --reload
```

## Try it
```bash
curl -X POST localhost:8000/api/discover -H "Content-Type: application/json" -d '{
  "job_description": "ML Engineer, 2+ years, Python, machine learning, AWS. Based in India."
}'
```
Docs: http://localhost:8000/docs

## Flow (LangGraph)
`extract_job -> search_candidates -> enrich_candidates -> rank`

Ranking is a skill-overlap heuristic for now; replace `rank_node` with the Dual-Tower model later.
AI recommends, humans decide.
=======
# Recruitment_scrapper
This is an individually developed recruitment scrapper . it is a prototype version where we can write the type of person we want for recruitment about  his or her technical skills in hum,an words and we can get a shortlisted list from github .
>>>>>>> 160af74a8fb29f866e300c3f6fb295c59ae0bc36
