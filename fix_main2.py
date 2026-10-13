with open('app/main.py', 'r') as f:
    text = f.read()

text = text.replace('    try:\n', '')
text += """
    log.info("ROCK N ROLL DISCOVER shutdown complete.")

app = FastAPI(
    title="ROCK N ROLL DISCOVER",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
"""

with open('app/main.py', 'w') as f:
    f.write(text)
