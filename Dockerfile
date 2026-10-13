FROM python:3.11-slim

WORKDIR /app

# Install compilation and ML system utilities
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    git \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir --upgrade pip

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code and folders (app, models, artifacts, data, processed, etc.)
COPY . .

EXPOSE 8000

# Start FastAPI backend (points to app/main.py or wherever your entry point lives)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]