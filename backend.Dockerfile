FROM python:3.10-slim

WORKDIR /app

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

ENV UV_SYSTEM_PYTHON=1

COPY pyproject.toml ./

RUN uv pip compile pyproject.toml -o requirements.txt && uv pip install -r requirements.txt

COPY backend/ backend/

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
