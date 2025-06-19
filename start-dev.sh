#!/bin/bash

# CBMo4ers Development Server Startup Script
# Handles dynamic port assignment for both frontend and backend

set -e

echo "🚀 Starting CBMo4ers Development Environment..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if port is available
check_port() {
    local port=$1
    if nc -z localhost $port 2>/dev/null; then
        return 1  # Port is in use
    else
        return 0  # Port is available
    fi
}

# Function to find available port starting from given port
find_available_port() {
    local start_port=$1
    local max_attempts=${2:-10}
    
    for ((port=start_port; port<start_port+max_attempts; port++)); do
        if check_port $port; then
            echo $port
            return 0
        fi
    done
    
    echo "ERROR: No available ports found starting from $start_port" >&2
    return 1
}

# Kill any existing processes
echo -e "${YELLOW}🔍 Checking for existing processes...${NC}"
pkill -f "python.*app.py" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
pkill -f "vercel dev" 2>/dev/null || true

sleep 2

# Find available ports
echo -e "${BLUE}🔍 Finding available ports...${NC}"
BACKEND_PORT=$(find_available_port 5001)
FRONTEND_PORT=$(find_available_port 5173)

if [ -z "$BACKEND_PORT" ] || [ -z "$FRONTEND_PORT" ]; then
    echo -e "${RED}❌ Could not find available ports${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Backend will use port: $BACKEND_PORT${NC}"
echo -e "${GREEN}✅ Frontend will use port: $FRONTEND_PORT${NC}"

# Update frontend .env file with backend port
echo "VITE_API_URL=http://localhost:$BACKEND_PORT" > frontend/.env
echo -e "${GREEN}✅ Updated frontend .env with backend URL${NC}"

# Start backend
echo -e "${BLUE}🖥️  Starting backend server...${NC}"
cd backend
python app.py --port $BACKEND_PORT --auto-port &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo -e "${YELLOW}⏳ Waiting for backend to start...${NC}"
sleep 3

# Start frontend
echo -e "${BLUE}🌐 Starting frontend server...${NC}"
cd frontend
npm run dev -- --port $FRONTEND_PORT &
FRONTEND_PID=$!
cd ..

# Wait for both servers to start
sleep 5

echo -e "${GREEN}🎉 Development environment started successfully!${NC}"
echo -e "${GREEN}📱 Frontend: http://localhost:$FRONTEND_PORT${NC}"
echo -e "${GREEN}🖥️  Backend:  http://localhost:$BACKEND_PORT${NC}"
echo ""
echo -e "${YELLOW}To stop the servers, press Ctrl+C or run: pkill -f 'python.*app.py' && pkill -f 'vite'${NC}"

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Shutting down servers...${NC}"
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Keep script running
wait
