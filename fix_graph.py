with open('app/graph/discover_graph.py', 'r') as f:
    text = f.read()

replacement = """
    top_repo_models = []
    if getattr(candidate, "repos", None):
        sorted_repos = sorted(candidate.repos, key=lambda r: getattr(r, "stargazers_count", 0), reverse=True)[:8]
        for r in sorted_repos:
            top_repo_models.append(
                {
                    "name": r.name,
                    "description": r.description,
                    "language": r.language,
                    "stargazers_count": getattr(r, "stargazers_count", 0),
                    "forks_count": getattr(r, "forks_count", 0),
                }
            )

    return ScoredCandidate(
"""

text = text.replace('    return ScoredCandidate(\n', replacement)
with open('app/graph/discover_graph.py', 'w') as f:
    f.write(text)
