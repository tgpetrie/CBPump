#!/bin/bash

# CBMo4ers Stable Development Server Startup Script
# Uses fixed ports for consistent development environment

set -e

echo "🚀 Starting CBMo4ers Development Environment (Stable Ports)..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Fixed ports for stability
BACKEND_PORT=5001
FRONTEND_PORT=5173

# Function to check if port is available
check_port() {
    local port=$1
    if nc -z localhost $port 2>/dev/null; then
        return 1  # Port is in use
    else
        return 0  # Port is available
    fi
}

# Function to kill process on port
kill_port() {
    local port=$1
    echo -e "${YELLOW}🔧 Killing any process on port $port...${NC}"
    lsof -ti:$port | xargs kill -9 2>/dev/null || true
    sleep 1
}

# Check and kill any existing processes on our ports
echo -e "${YELLOW}🔍 Checking for existing processes on ports $BACKEND_PORT and $FRONTEND_PORT...${NC}"

if ! check_port $BACKEND_PORT; then
    echo -e "${YELLOW}⚠️  Port $BACKEND_PORT is in use${NC}"
    kill_port $BACKEND_PORT
fi

if ! check_port $FRONTEND_PORT; then
    echo -e "${YELLOW}⚠️  Port $FRONTEND_PORT is in use${NC}"
    kill_port $FRONTEND_PORT
fi

# Additional cleanup
pkill -f "python.*app.py" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
pkill -f "vercel dev" 2>/dev/null || true

sleep 2

echo -e "${GREEN}✅ Backend will use stable port: $BACKEND_PORT${NC}"
echo -e "${GREEN}✅ Frontend will use stable port: $FRONTEND_PORT${NC}"

# Ensure frontend .env has correct backend URL
echo "VITE_API_URL=http://localhost:$BACKEND_PORT" > frontend/.env
echo -e "${GREEN}✅ Updated frontend .env with stable backend URL${NC}"

# Start backend with fixed port (no auto-port discovery)
echo -e "${BLUE}🖥️  Starting backend server on port $BACKEND_PORT...${NC}"
cd backend
PORT=$BACKEND_PORT python app.py --port $BACKEND_PORT &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo -e "${YELLOW}⏳ Waiting for backend to start...${NC}"
sleep 4

# Verify backend is running
if check_port $BACKEND_PORT; then
    echo -e "${RED}❌ Backend failed to start on port $BACKEND_PORT${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
fi

# Start frontend with fixed port
echo -e "${BLUE}🌐 Starting frontend server on port $FRONTEND_PORT...${NC}"
cd frontend
npm run dev -- --port $FRONTEND_PORT &
FRONTEND_PID=$!
cd ..

# Wait for frontend to start
sleep 3

echo -e "${GREEN}🎉 Development environment started successfully with stable ports!${NC}"
echo -e "${GREEN}📱 Frontend: http://localhost:$FRONTEND_PORT${NC}"
echo -e "${GREEN}🖥️  Backend:  http://localhost:$BACKEND_PORT${NC}"
echo -e "${GREEN}🩺 Health:   http://localhost:$BACKEND_PORT/health${NC}"
echo ""
echo -e "${YELLOW}To stop the servers, press Ctrl+C${NC}"

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Shutting down servers...${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    echo -e "${GREEN}✅ Servers stopped${NC}"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Keep script running
wait
