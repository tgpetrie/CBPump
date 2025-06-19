# CBPump

This repository contains the backend and frontend code for the CBMo4ers crypto dashboard.

## Frontend

```bash
cd frontend
npm install
npm run dev
```

## Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

Run the unit tests with `pytest` once the virtual environment is activated:

```bash
pytest
```

## Backend Configuration

The backend can be configured through environment variables. A new variable `CORS_ALLOWED_ORIGINS` has been added to specify which origins are allowed to access the API and WebSocket server.

Set `CORS_ALLOWED_ORIGINS` to a comma-separated list of allowed origins. Use `*` to allow any origin (default).

```bash
# Allow requests from https://example.com and https://foo.bar
export CORS_ALLOWED_ORIGINS="https://example.com,https://foo.bar"
```

## Development

See `DOCKER.md` for container details and `docker-compose.yml` for available services.
