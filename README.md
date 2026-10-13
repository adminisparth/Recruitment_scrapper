# Rock N Roll – Discover Server

An individually developed recruitment scraper. This is a prototype: you describe the kind of person you want to hire and their technical skills in plain words, and it returns a shortlist of candidates from GitHub.

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