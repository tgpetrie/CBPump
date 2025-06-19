#!/bin/bash

# CBPump Project Setup Script
# Automatically sets up the development environment from scratch

set -e  # Exit on any error

echo "🚀 CBPump Project Setup Starting..."
echo "======================================"

# Check if we're in the right directory
if [[ ! -f "docker-compose.yml" ]]; then
    echo "❌ Error: Please run this script from the CBPump-main directory"
    exit 1
fi

# Clean up any existing installations
echo "🧹 Step 1: Cleaning existing installations..."
rm -rf backend/.venv backend/__pycache__ frontend/node_modules frontend/dist
find . -name "*.pyc" -delete 2>/dev/null || true
find . -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true

# Check prerequisites
echo "🔍 Step 2: Checking prerequisites..."
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is required but not installed"
    exit 1
fi
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed"
    exit 1
fi
if ! command -v npm &> /dev/null; then
    echo "❌ npm is required but not installed"
    exit 1
fi

echo "✅ Prerequisites check passed"
echo "   Python: $(python3 --version)"
echo "   Node.js: $(node --version)"
echo "   npm: $(npm --version)"

# Setup Python backend
echo "🐍 Step 3: Setting up Python backend..."
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
echo "✅ Backend dependencies installed"

# Setup Node.js frontend
echo "⚛️  Step 4: Setting up React frontend..."
cd ../frontend
rm -rf node_modules package-lock.json  # Clean install
npm install
echo "✅ Frontend dependencies installed"

# Create environment files if they don't exist
echo "📄 Step 5: Setting up environment files..."
cd ../backend
if [[ ! -f ".env" ]]; then
    cp .env.development .env
    echo "✅ Created .env from .env.development"
fi

# Test installations
echo "🧪 Step 6: Testing installations..."
source .venv/bin/activate
python -c "import flask; print('Flask version:', flask.__version__)" 2>/dev/null || echo "⚠️  Flask import test failed"

cd ../frontend
npm list react --depth=0 > /dev/null && echo "✅ React installation verified" || echo "⚠️  React verification failed"

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "📝 Next Steps:"
echo "1. Start the backend: cd backend && source .venv/bin/activate && python app.py"
echo "2. Start the frontend: cd frontend && npm run dev"
echo "3. Open http://localhost:5173 in your browser"
echo ""
echo "🐳 Or use Docker:"
echo "docker-compose up --build"
echo ""
echo "📚 For more details, see AGENTS.md"
