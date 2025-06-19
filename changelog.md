## [v1.0.0] – 2025-06-19

### 🎯 Highlights
- Complete frontend/backend integration from Codespaces
- Live top gainers/losers, volume banner, and 1h % tracking
- Fixed JSX structure and removed broken `PriceBanner`
- Clean UI using Tailwind, animated refresh, mobile-friendly layout
- Finalized `AGENTS.md` with setup/testing/workflow policies
- Docker-compose orchestration for local fullstack dev
- Vercel-ready build output (`dist/` via Vite)

### 🧪 Tested
- Local dev via `python app.py` + `npm run dev`
- JSON served from `/data` endpoint
- Dockerized build via `docker-compose up --build`

---

## 🔖 2. Create a Release Tag

In your terminal (from `main` after merge):

```bash
git checkout main
git pull
git tag -a v1.0.0 -m "First full release: CBPump integration snapshot"
git push origin v1.0.0
diff --git a//dev/null b/SETUP.md
index 0000000000000000000000000000000000000000..235719da4c53f9131ef329f86347e12e22904d13 100644
--- a//dev/null
+++ b/SETUP.md
@@ -0,0 +1,35 @@

