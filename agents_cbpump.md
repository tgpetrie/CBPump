# AGENTS.md

## 🧠 Purpose

Guide ChatGPT when assisting with the **CBPump** repository.

ChatGPT should help developers:

- Set up local and Docker environments
- Run backend and frontend tests
- Deploy (Docker, Vercel) confidently
- Verify that backend ↔ frontend communication works and data renders live
- Provide context-aware code reviews and PR summaries
- Follow project coding conventions and security policies

---

## 📁 Repo Layout

| Path                 | Description                                    |
| -------------------- | ---------------------------------------------- |
| `backend/`           | Flask API (`app.py`, utilities, `test_app.py`) |
| `frontend/`          | Vite + React client (`src/` entry)             |
| `docker-compose.yml` | Orchestrates full stack locally                |
| `monitoring/`        | Prometheus / Grafana configs                   |
| `.github/workflows/` | CI for linting, tests, build                   |

---

## ⚙️ Environment & Setup

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py         # or flask run
pytest
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Docker (full stack)

```bash
docker-compose up --build
```

### Vercel (frontend only)

`dist/` is the build output; Vercel uses `npm run build`.

---

## 🧪 Testing

### Backend

```bash
pytest -v --tb=short
```

### Frontend

```bash
npm run test
```

### Integration Health-Check

ChatGPT should remind contributors to verify **live data flow**:

1. **Endpoint sanity** – `curl http://localhost:8000/data` should return JSON:
   ```json
   { "gainers": [...], "losers": [...], "banner": [...], "volume": [...] }
   ```
2. **Frontend hydration** – With `npm run dev` running, check browser console:
   - No 4xx/5xx fetch errors.
   - React state (`gainers`, `losers`, etc.) is populated.
   - Top-gainer banner and tables refresh every 3 s without blank rows.

> ChatGPT PR review checklist
>
> -

---

## 🧼 Coding Guidelines

- **Python** – PEP 8, enforce with `flake8`
- **JS/React** – ESLint (`npm run lint`)
- Use `npm run lint && npm test && pytest` before pushing

---

## ✅ Pull Request Instructions

1. Run **all tests & linters** locally.
2. Verify integration health-check items above.
3. In PR description:
   - Mention Node 18 / Python 3.12 compatibility.
   - Include code snippets or screenshots if UI changes.
4. CI workflow already runs:
   - `pytest`
   - `npm test`
   - `flake8`

---

## 🔐 Extra Context

- Never commit secrets (`.env`, Vercel tokens, Sentry DSN).
- `monitoring/` is production-only; do not enable in dev.
- Files prefixed `experimental_` may be unstable.

---

