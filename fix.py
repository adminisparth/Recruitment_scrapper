import re

with open('app/main.py', 'r') as f:
    text = f.read()

replacement = """    try:
        graph = build_discover_graph(
            github=github,
            embedding_service=embedding_service,
            two_tower=two_tower,
        )
        app.state.graph = graph
        app.state.github_client = github
    except Exception as exc:
        log.error("Failed to build graph", exc_info=exc)
        raise

"""

text = re.sub(r' +try:\n\n +# IMPORTANT:[\s\S]*?# with your current implementation\.\n\n', replacement, text)

with open('app/main.py', 'w') as f:
    f.write(text)
