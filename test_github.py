import asyncio
from app.github.client import GitHubClient

async def test():
    client = GitHubClient()
    try:
        res = await client.search_users('test')
        print("Success:", len(res))
    except Exception as e:
        print("Error:", e)
    finally:
        await client.aclose()

asyncio.run(test())
