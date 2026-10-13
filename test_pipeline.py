import asyncio
from app.graph.discover_graph import build_discover_graph
from app.github.client import GitHubClient
from app.graph.state import DiscoverState

async def test_pipeline():
    github = GitHubClient(token="")
    # Mock search so we don't hit real GitHub rate limits if possible, or just let it hit with small results
    graph = build_discover_graph(github=github)
    
    # Just run a simple search node manually to avoid full orchestration if we want
    print("Graph built successfully.")
    await github.aclose()

asyncio.run(test_pipeline())
