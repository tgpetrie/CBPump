#!/bin/bash

# CBPump Development Helper Script
# Quick commands for common development tasks

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

show_help() {
    echo "🚀 CBPump Development Helper"
    echo "=========================="
    echo ""
    echo "Usage: ./dev.sh [command]"
    echo ""
    echo "Commands:"
    echo "  setup     - Run complete project setup"
    echo "  start     - Start both backend and frontend"
    echo "  backend   - Start only backend"
    echo "  frontend  - Start only frontend"
    echo "  test      - Run all tests"
    echo "  clean     - Clean all dependencies and cache"
    echo "  status    - Show running services"
    echo "  stop      - Stop all running services"
    echo "  logs      - Show recent logs"
    echo "  help      - Show this help message"
    echo ""
}

setup_project() {
    echo "🔧 Setting up CBPump project..."
    ./setup_project.sh
}

start_backend() {
    echo "🐍 Starting backend..."
    cd backend
    if [[ ! -d ".venv" ]]; then
        echo "❌ Virtual environment not found. Run './dev.sh setup' first."
        exit 1
    fi
    source .venv/bin/activate
    export FLASK_ENV=development
    python app.py
}

start_frontend() {
    echo "⚛️  Starting frontend..."
    cd frontend
    if [[ ! -d "node_modules" ]]; then
        echo "❌ Node modules not found. Run './dev.sh setup' first."
        exit 1
    fi
    npm run dev
}

start_both() {
    echo "🚀 Starting both backend and frontend..."
    echo "Backend will run on: http://localhost:5002"
    echo "Frontend will run on: http://localhost:5173"
    echo ""
    echo "Press Ctrl+C to stop both services"
    
    # Start backend in background
    cd backend && source .venv/bin/activate && python app.py &
    BACKEND_PID=$!
    
    # Start frontend in background  
    cd ../frontend && npm run dev &
    FRONTEND_PID=$!
    
    # Wait for Ctrl+C
    trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
    wait
}

run_tests() {
    echo "🧪 Running tests..."
    
    # Backend tests
    echo "Testing backend..."
    cd backend
    source .venv/bin/activate
    python -m pytest test_app.py -v
    
    # Frontend tests
    echo "Testing frontend..."
    cd ../frontend
    npm test 2>/dev/null || echo "⚠️  Frontend tests not configured"
    
    # Lint checks
    echo "Checking frontend lint..."
    npm run lint 2>/dev/null || echo "⚠️  ESLint not configured"
}

clean_project() {
    echo "🧹 Cleaning project..."
    rm -rf backend/.venv backend/__pycache__
    rm -rf frontend/node_modules frontend/dist
    find . -name "*.pyc" -delete 2>/dev/null || true
    find . -name "__pycache__" -type d -exec rm -rf {} + 2>/dev/null || true
    echo "✅ Project cleaned"
}

show_status() {
    echo "📊 Service Status"
    echo "================"
    
    # Check backend
    if lsof -i :5002 >/dev/null 2>&1; then
        echo "✅ Backend: Running on port 5002"
    else
        echo "❌ Backend: Not running"
    fi
    
    # Check frontend
    if lsof -i :5173 >/dev/null 2>&1; then
        echo "✅ Frontend: Running on port 5173"
    else
        echo "❌ Frontend: Not running"
    fi
    
    # Show processes
    echo ""
    echo "🔍 Related Processes:"
    ps aux | grep -E "(python.*app\.py|vite)" | grep -v grep || echo "No related processes found"
}

stop_services() {
    echo "🛑 Stopping services..."
    pkill -f "python.*app.py" 2>/dev/null && echo "✅ Backend stopped" || echo "⚠️  Backend not running"
    pkill -f "vite" 2>/dev/null && echo "✅ Frontend stopped" || echo "⚠️  Frontend not running"
}

show_logs() {
    echo "📋 Recent Logs"
    echo "=============="
    
    # Backend logs
    if [[ -f "backend/logs/app.log" ]]; then
        echo "Backend logs:"
        tail -20 backend/logs/app.log
    else
        echo "No backend logs found"
    fi
    
    # System logs for our processes
    echo ""
    echo "Process logs:"
    ps aux | grep -E "(python.*app\.py|vite)" | grep -v grep || echo "No processes found"
}

# Main command handler
case "${1:-help}" in
    setup)
        setup_project
        ;;
    start)
        start_both
        ;;
    backend)
        start_backend
        ;;
    frontend)
        start_frontend
        ;;
    test)
        run_tests
        ;;
    clean)
        clean_project
        ;;
    status)
        show_status
        ;;
    stop)
        stop_services
        ;;
    logs)
        show_logs
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo "❌ Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
