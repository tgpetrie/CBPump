# 🤖 AGENTS.md - CBPump Development Guide

## 🧠 Purpose

This file guides ChatGPT (and human contributors) when working on the CBPump repository. It describes how to install, run, test, and deploy the project from a completely fresh machine.

ChatGPT should help developers to:
1. Set up local and Docker environments from scratch
2. Run backend pytest and frontend Vitest/ESLint  
3. Deploy the frontend to Vercel and optionally the full‑stack with Docker
4. Verify that backend ↔ frontend communication works and data renders live
5. Provide context‑aware code‑review summaries and PR guidance
6. Respect coding, security, and style conventions documented below

## 📁 Repo Layout (at a glance)

| Path | Purpose / Notes |
|------|-----------------|
| `backend/` | Flask API – app.py, utility modules, pytest tests |
| `frontend/` | Vite + React client – all UI lives in src/ |
| `docker-compose.yml` | Orchestrates backend & frontend locally |
| `monitoring/` | Prometheus + Grafana configs (production only) |
| `.github/workflows/` | CI pipeline – lint, test, build |

## 📥 1. Clone the Repository

**Choose your preferred method:**

```bash
# SSH (recommended for contributors)
git clone git@github.com:tgpetrie/CBPump.git
cd CBPump

# or HTTPS (for public access)
git clone https://github.com/tgpetrie/CBPump.git
cd CBPump

# Switch to the development branch
git checkout feat/full-codespace-sync
```

**Note**: The `feat/full-codespace-sync` branch contains the latest development features and full workspace setup.

## ⚡ Quick Start (Complete Setup)

```bash
# 1. Clone the repository
git clone git@github.com:tgpetrie/CBPump.git
cd CBPump
git checkout feat/full-codespace-sync

# 2. Run automated setup
bash setup_project.sh

# 3. Start development servers
# Terminal 1 - Backend
cd backend && source .venv/bin/activate && python app.py

# Terminal 2 - Frontend  
cd frontend && npm run dev

# 4. Open in browser
open http://localhost:5173
```

## 🛠️ Development Helper Script

For easier development workflow, use the included helper script:

```bash
# Quick setup and start
./dev.sh setup    # Complete project setup
./dev.sh start     # Start both backend and frontend
./dev.sh status    # Check service status
./dev.sh stop      # Stop all services
./dev.sh clean     # Clean dependencies
./dev.sh help      # Show all commands
```

## ⚙️ 2. Installation & Setup – Automatic via Script

**After cloning the repository**, from the project root, run:

```bash
bash setup_project.sh
```

This will:
- Create a Python virtual environment in `backend/`
- Install Python and Node dependencies
- Start the backend on port 5002
- Launch the frontend (Vite dev server) on port 5173

## 🔧 3. Manual Setup (if script fails or for reference)

### 0. Prerequisites

| Tool | Version | Install on macOS (Homebrew) | Install on Ubuntu/WSL |
|------|---------|----------------------------|----------------------|
| Git | ≥ 2.40 | `brew install git` | `sudo apt install git` |
| Python | 3.12.x | `brew install pyenv` → `pyenv install 3.12.1` | `sudo apt install python3.12 python3.12‑venv` |
| Node.js | 18.x LTS | `brew install nvm` → `nvm install 18` | `curl -fsSL https://deb.nodesource.com/setup_18.x \| sudo -E bash -` |
| Docker & Compose | latest | `brew install --cask docker` | `sudo apt install docker.io docker-compose-plugin` |

**macOS Gatekeeper**: First run of Vite may prompt "rollup.darwin‑arm64.node can't be opened". Go to System Settings → Privacy & Security and click "Open Anyway" to allow.

### 1. Backend – Python Virtual Environment

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
python app.py  # or flask run --port 5002
```

**Note**: Using `.venv` as the virtual environment directory name (with dot prefix) keeps it organized and follows Python conventions.

### 2. Frontend – Vite/React

```bash
cd ../frontend
rm -rf node_modules package-lock.json  # Clean install
npm install
npm run dev
```

**Note**: The clean install (`rm -rf node_modules package-lock.json`) ensures no dependency conflicts from previous installations.

### 3. Environment Configuration

```bash
# Backend - copy example env file
cd backend/
cp .env.example .env
# Edit .env with your specific values

# Frontend - Vite automatically loads .env files
cd frontend/
# Create .env.local if needed for local overrides
```

### 4. Verify Installation

```bash
# Test backend setup
cd backend/
source .venv/bin/activate
python -c "import flask; print('✅ Flask installed:', flask.__version__)"

# Test frontend setup  
cd ../frontend/
npm list react --depth=0 && echo "✅ React installed successfully"
```

## 📦 Version Pinning & Dependencies

### Flask Backend
- **Flask**: Pin to `3.1.x` for stability and latest features
- **Flask-CORS**: Pin to `6.0.x` to avoid CORS issues
- **Flask-SocketIO**: Pin to `5.3.x` for real-time features
- **Requests**: Pin to `2.31.x` for reliable HTTP requests
- **Python**: Recommend `3.12+` for best performance and compatibility

```bash
# requirements.txt example (already configured)
flask==3.1.1
flask-cors==6.0.1
flask-socketio==5.3.6
requests==2.31.0
python-dotenv==1.0.1
pytest==8.3.5
gunicorn==21.2.0
```

### Vite Frontend
- **Vite**: Pin to `5.x.x` for latest build optimizations
- **React**: Pin major version `18.x.x` for stable hooks API
- **Node.js**: Use LTS version `18.x` for compatibility

```json
// package.json dependencies (already configured)
{
  "vite": "^5.4.19",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "@vitejs/plugin-react": "^4.0.0",
  "tailwindcss": "^3.4.17"
}
```

**⚠️ Important**: Always test version updates in development before deploying to production.

## 🚀 Running the Application

### Development URLs
- **Backend API**: http://localhost:5002
- **Frontend**: http://localhost:5173  
- **API Health Check**: http://localhost:5002/api/health
- **API Data Endpoint**: http://localhost:5002/api/data

### Local Development

**Option 1: Manual Start**
```bash
# Terminal 1 - Backend
cd backend/
source .venv/bin/activate
python app.py
# Runs on http://localhost:5002

# Terminal 2 - Frontend  
cd frontend/
npm run dev
# Runs on http://localhost:5173
```

**Option 2: Docker Compose**
```bash
docker-compose up --build
# Backend: http://localhost:5002
# Frontend: http://localhost:5173
```

### Development Workflow Tips

```bash
# Hot reload development (recommended)
# Terminal 1: Backend with auto-restart
cd backend && source .venv/bin/activate
export FLASK_ENV=development
python app.py

# Terminal 2: Frontend with hot reload
cd frontend && npm run dev

# Quick restart both services
pkill -f "python.*app.py" && pkill -f "vite"
cd backend && source .venv/bin/activate && python app.py &
cd frontend && npm run dev &
```

## 🐳 Docker Setup (Optional)

**Start with Docker Compose:**
```bash
docker-compose up --build
# Access frontend at http://localhost:5173
# Backend API at http://localhost:5002
```

**Stop Docker services:**
```bash
docker-compose down
```

**Docker development workflow:**
```bash
# Build and run in detached mode
docker-compose up --build -d

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Restart specific service
docker-compose restart backend
docker-compose restart frontend
```

### Production Deployment

**Vercel (Frontend)**
```bash
cd frontend/
npm run build
vercel --prod
```

**Docker (Full-stack)**
```bash
docker-compose -f docker-compose.yml -f docker-compose.production.yml up -d
```

## 🤖 Agents & Live Data Debugging

### Sample Debugging Commands

#### Check Agent Status
```bash
# View all running agents
ps aux | grep python | grep -E "(pump|agent|cbpump)"

# Check specific agent logs
tail -f logs/app.log

# Monitor agent memory usage
top -p $(pgrep -f "app.py")

# Check Python process details
ps aux | grep "python.*app.py"
```

#### Debug Data Pipeline Issues
```bash
# Test API connectivity
curl -X GET "http://localhost:5002/api/health"

# Check live data feed
curl -X GET "http://localhost:5002/api/live-data?symbol=BTC"

# Test all API endpoints
curl -X GET "http://localhost:5002/api/data"
curl -X GET "http://localhost:5002/api/search?query=bitcoin"

# Validate data format
python -c "
import requests
import json
try:
    response = requests.get('http://localhost:5002/api/data')
    data = response.json()
    print('✅ API Response:', json.dumps(data, indent=2)[:500])
except Exception as e:
    print('❌ API Error:', str(e))
"
```

#### Agent Performance Monitoring
```bash
# Check agent response times
time curl -X GET "http://localhost:5002/api/data"

# Monitor active connections
netstat -an | grep :5002
lsof -i :5002

# Check Flask app health
curl -f "http://localhost:5002/api/health" && echo "✅ Backend healthy" || echo "❌ Backend down"

# Test database connections (if using)
python -c "
try:
    import requests
    response = requests.get('http://localhost:5002/api/health')
    if response.status_code == 200:
        print('✅ Backend connection: OK')
    else:
        print(f'❌ Backend error: {response.status_code}')
except Exception as e:
    print(f'❌ Connection failed: {e}')
"
```

#### Live Data Troubleshooting
```bash
# Check frontend-backend connectivity
curl -X GET "http://localhost:5002/api/data" -H "Accept: application/json"

# Test CORS configuration
curl -X OPTIONS "http://localhost:5002/api/data" \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: GET" \
  -v

# Monitor real-time WebSocket connections (if using SocketIO)
curl -X GET "http://localhost:5002/socket.io/?EIO=4&transport=polling"

# Check data caching
python -c "
import time
import requests

# Make multiple requests to test caching
for i in range(3):
    start = time.time()
    response = requests.get('http://localhost:5002/api/data')
    end = time.time()
    print(f'Request {i+1}: {end-start:.3f}s - Status: {response.status_code}')
    time.sleep(1)
"
```

#### Agent Communication Debug
```bash
# Test individual API endpoints
endpoints=("/api/health" "/api/data" "/api/search?query=test")
for endpoint in "${endpoints[@]}"; do
  echo "Testing: $endpoint"
  curl -f "http://localhost:5002$endpoint" > /dev/null 2>&1 && \
    echo "✅ $endpoint: OK" || echo "❌ $endpoint: FAILED"
done

# Monitor request logs in real-time
tail -f backend/logs/*.log 2>/dev/null || echo "No log files found"

# Check environment variables
python -c "
import os
from backend.config import Config
print('Environment:', os.getenv('FLASK_ENV', 'development'))
print('Debug mode:', Config.DEBUG)
print('Port:', Config.PORT)
"

# Test frontend build
cd frontend && npm run build && echo "✅ Frontend builds successfully" || echo "❌ Frontend build failed"
```

#### Network & Port Debugging
```bash
# Check what's running on common ports
echo "Port 5002 (Backend):" && lsof -i :5002
echo "Port 5173 (Frontend):" && lsof -i :5173

# Test network connectivity
ping -c 3 localhost
curl -I http://localhost:5002/api/health

# Check firewall/network rules (macOS)
sudo pfctl -s rules | grep -E "(5002|5173)"
```

## 🧪 Testing Matrix

| Layer | Command | Notes |
|-------|---------|--------|
| **Backend** | `pytest -v --tb=short` | backend/test_app.py |
| **Frontend** | `npm run test` | Vitest |
| **Lint JS** | `npm run lint` | ESLint |
| **Lint Py** | `flake8 backend/ app.py` | PEP8 |

### Backend Tests
```bash
cd backend/
source .venv/bin/activate

# Run tests with verbose output
pytest -v --tb=short

# Run with coverage
pytest --cov=app test_app.py

# Test specific functionality
pytest test_app.py::test_health_endpoint -v
```

### Frontend Tests
```bash
cd frontend/

# Run Vitest tests
npm run test

# Run ESLint
npm run lint

# Test build process
npm run build
```

### Python Linting
```bash
# Install flake8 if not already installed
pip install flake8

# Lint Python code
flake8 backend/ app.py

# Lint with specific config
flake8 backend/ --max-line-length=120 --ignore=E203,W503
```

## 🔍 Integration Health-Check

### Quick System Verification
```bash
# Test backend API
curl http://localhost:5002/api/data | jq .

# Test health endpoint
curl http://localhost:5002/api/health

# Test with timeout
curl --max-time 5 http://localhost:5002/api/data
```

### Frontend Integration Checklist
- ✅ **Frontend renders banner**: Top gainers/losers display correctly
- ✅ **No console errors**: Check browser console for fetch/XHR errors
- ✅ **Real-time updates**: Backend logs show cache updates every 60s
- ✅ **Polling frequency**: Frontend polls API every 3s
- ✅ **Data consistency**: API data matches frontend display

### Manual Integration Test
```bash
# 1. Start both services
./dev.sh start

# 2. Check backend health
curl http://localhost:5002/api/health

# 3. Verify data endpoint
curl http://localhost:5002/api/data | jq '.data | length'

# 4. Check frontend (open browser)
open http://localhost:5173

# 5. Monitor real-time updates
tail -f backend/logs/app.log | grep "Cache updated"
```

### Automated Integration Test
```bash
# Create integration test script
cat > test_integration.sh << 'EOF'
#!/bin/bash
set -e

echo "🔍 Running integration tests..."

# Test backend
echo "Testing backend health..."
curl -f http://localhost:5002/api/health > /dev/null || { echo "❌ Backend health check failed"; exit 1; }

echo "Testing backend data..."
curl -f http://localhost:5002/api/data > /dev/null || { echo "❌ Backend data check failed"; exit 1; }

# Test frontend build
echo "Testing frontend build..."
cd frontend && npm run build > /dev/null || { echo "❌ Frontend build failed"; exit 1; }

echo "✅ All integration tests passed!"
EOF

chmod +x test_integration.sh
./test_integration.sh
```

## 🔒 Security & Best Practices

### Environment Variables
- Never commit `.env` files to git
- Use `.env.example` as template
- Rotate API keys regularly
- Use different keys for dev/staging/prod

### CORS Configuration
```python
# backend/app.py - Already configured
CORS(app, origins=[
    "http://localhost:5173",  # Local development
    "https://yourdomain.vercel.app"  # Production
])
```

### Rate Limiting
```python
# backend/app.py - Already configured with Flask-Limiter
@app.route('/api/data')
@limiter.limit("100 per minute")
def get_data():
    pass
```

## 🧼 Coding Guidelines

### Python Standards
- **Style**: PEP8 compliance with flake8
- **Line length**: 120 characters maximum
- **Imports**: Sort with isort, group by standard/third-party/local
- **Docstrings**: Use Google style for functions and classes
- **Type hints**: Use for function parameters and return values

```python
# Good Python example
from typing import Dict, List, Optional
import logging

logger = logging.getLogger(__name__)

def fetch_market_data(symbol: str, limit: Optional[int] = 100) -> Dict[str, any]:
    """Fetch market data for a given symbol.
    
    Args:
        symbol: The trading symbol to fetch data for
        limit: Maximum number of records to return
        
    Returns:
        Dictionary containing market data
        
    Raises:
        ValueError: If symbol is invalid
    """
    if not symbol or len(symbol) < 2:
        raise ValueError("Symbol must be at least 2 characters")
    
    # Implementation here...
    return {"symbol": symbol, "data": []}
```

### JavaScript/React Standards
- **Style**: Airbnb ESLint configuration + Prettier
- **Components**: Use functional components with hooks
- **Props**: Destructure props and use PropTypes or TypeScript
- **Naming**: PascalCase for components, camelCase for functions/variables
- **File structure**: One component per file, co-locate styles

```jsx
// Good React example
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const PriceBanner = ({ symbols, refreshInterval = 3000 }) => {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('/api/data');
        const data = await response.json();
        setPrices(data);
      } catch (error) {
        console.error('Failed to fetch prices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, refreshInterval);
    return () => clearInterval(interval);
  }, [symbols, refreshInterval]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="price-banner">
      {/* Component content */}
    </div>
  );
};

PriceBanner.propTypes = {
  symbols: PropTypes.arrayOf(PropTypes.string).isRequired,
  refreshInterval: PropTypes.number,
};

export default PriceBanner;
```

### Git Commit Standards
- **Never commit**: `node_modules/`, binaries, `.zip` files, `.env` files
- **Commit messages**: Use conventional commits format
- **Branch naming**: `feature/description`, `fix/issue-number`, `docs/update-readme`

```bash
# Good commit examples
git commit -m "feat: add real-time price updates"
git commit -m "fix: resolve CORS issue for production"
git commit -m "docs: update installation instructions"
git commit -m "refactor: optimize API response caching"
```

### File Organization
- **Python modules**: Experimental code goes in `backend/experimental_*.py`
- **Environment files**: Never commit actual `.env`, use `.env.example`
- **Documentation**: Keep README.md and AGENTS.md updated
- **Logs**: Exclude from git, use `.gitignore`

### Code Review Standards
- **Security**: No hardcoded secrets or credentials
- **Performance**: Consider caching and API rate limits
- **Error handling**: Proper try/catch blocks and user feedback
- **Testing**: Include tests for new features
- **Documentation**: Update docs for API changes

## 📊 Monitoring & Logging

### Application Logs
```bash
# View backend logs
tail -f backend/logs/app.log

# Search for errors
grep -i error backend/logs/app.log

# Monitor in real-time
tail -f backend/logs/app.log | grep -E "(ERROR|WARNING)"
```

### Performance Monitoring
```bash
# Monitor system resources
htop  # or top
iostat 1
vmstat 1

# Monitor specific process
pidstat -p $(pgrep -f "python.*app.py") 1
```

## 🚢 Deployment Guide

### Vercel (Frontend Only)
```bash
cd frontend/
vercel --prod
```

### Docker (Full Application)
```bash
# Development
docker-compose up --build

# Production
docker-compose -f docker-compose.yml -f docker-compose.production.yml up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Environment-Specific Configs
- **Development**: Use `.env.development`
- **Production**: Use `.env.production`
- **Docker**: Use `docker-compose.override.yml`

## 🔧 Troubleshooting Common Issues

### "Module not found" Errors
```bash
# Backend
cd backend && source .venv/bin/activate && pip install -r requirements.txt

# Frontend
cd frontend && rm -rf node_modules package-lock.json && npm install
```

### Port Already in Use
```bash
# Find and kill process on port 5002
lsof -ti:5002 | xargs kill -9

# Find and kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### CORS Errors
- Check backend CORS configuration in `app.py`
- Verify frontend is making requests to correct backend URL
- Ensure both services are running

### Build Failures
```bash
# Clean rebuild
./setup_project.sh

# Or manual clean
cd backend && rm -rf .venv && python3 -m venv .venv
cd frontend && rm -rf node_modules && npm install
```

## ✅ PR Checklist

Before submitting a pull request, ensure:

### Code Quality
- [ ] **Tests pass**: All backend and frontend tests are passing
- [ ] **Linting clean**: No ESLint or flake8 errors
- [ ] **Build successful**: Frontend builds without errors
- [ ] **Integration tests**: API endpoints work with frontend

### Security & Best Practices
- [ ] **No secrets**: No API keys, tokens, or credentials in code
- [ ] **Environment variables**: Sensitive data uses environment variables
- [ ] **Dependencies**: New dependencies are justified and documented
- [ ] **Error handling**: Proper error handling and user feedback

### Documentation
- [ ] **Code comments**: Complex logic is commented
- [ ] **API changes**: API documentation updated if endpoints changed
- [ ] **README updates**: Installation or usage changes documented
- [ ] **AGENTS.md**: Development guide updated if workflow changed

### Performance & Reliability
- [ ] **Loading states**: Frontend shows loading indicators
- [ ] **Error boundaries**: React error boundaries in place
- [ ] **Rate limiting**: API calls respect rate limits
- [ ] **Memory leaks**: Event listeners and intervals cleaned up

### Testing Checklist
```bash
# Run full test suite before PR
cd backend && source .venv/bin/activate
pytest -v --tb=short
flake8 backend/ app.py

cd ../frontend
npm run lint
npm run test
npm run build

# Integration test
curl http://localhost:5002/api/health
curl http://localhost:5002/api/data | jq .
```

## 🔐 Security Policies

### Secrets Management
- **Never commit**: `.env` files, API tokens, database credentials
- **Use**: Environment variables for all sensitive configuration
- **Rotate**: API keys regularly, especially after team changes
- **Separate**: Different keys for development, staging, and production

### Code Security
```bash
# Check for secrets before commit
git diff --cached | grep -E "(api_key|secret|password|token)" && echo "⚠️  Possible secret detected!"

# Use git hooks to prevent secret commits
echo 'git diff --cached | grep -E "(api_key|secret|password|token)" && exit 1' > .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

### Environment-Specific Notes
- **Development**: Use `.env.development` with dummy data
- **Staging**: Use `monitoring/` directory (unstable, staging only)
- **Production**: Use `.env.production` with real credentials
- **Experimental**: Python modules go in `backend/experimental_*.py`

### File Security Rules
```bash
# Always in .gitignore
node_modules/
*.env
*.log
__pycache__/
*.pyc
dist/
build/
*.zip
*.tar.gz
```

## 📋 Development Policies

### Branch Strategy
- **Main branch**: Stable, production-ready code
- **Feature branches**: `feature/description` for new features
- **Fix branches**: `fix/issue-number` for bug fixes
- **Development branch**: `feat/full-codespace-sync` for active development

### Monitoring & Stability
- **Monitoring directory**: `monitoring/` is **unstable** and for **staging only**
- **Production monitoring**: Use external services (not included in this repo)
- **Logs**: Keep application logs but exclude from version control
- **Health checks**: Always include `/api/health` endpoint

### Experimental Code
- **Location**: Experimental Python code goes in `backend/experimental_*.py`
- **Purpose**: Testing new features without affecting main application
- **Cleanup**: Remove experimental files before production deployment

### Deployment Guidelines
- **Frontend**: Deploy to Vercel for production
- **Backend**: Can be deployed standalone or with Docker
- **Environment**: Always use environment-specific configurations
- **Rollback**: Keep previous version available for quick rollback

## 📚 Additional Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Vercel Documentation](https://vercel.com/docs)

---

**📝 Note**: This guide is continuously updated. If you encounter issues not covered here, please document the solution and update this file.
