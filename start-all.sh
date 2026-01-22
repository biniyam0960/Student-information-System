#!/bin/bash

echo "🚀 Starting Student Information System - Full Stack"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# Check if MySQL is running
echo -e "${YELLOW}Checking MySQL...${NC}"
if pgrep -x "mysqld" > /dev/null; then
    echo -e "${GREEN}✅ MySQL is running${NC}"
else
    echo -e "${RED}❌ MySQL is not running. Please start MySQL first.${NC}"
    echo "   macOS: brew services start mysql"
    echo "   Linux: sudo systemctl start mysql"
fi

# Check and start backend
echo -e "${YELLOW}Checking Backend (Port 4000)...${NC}"
if check_port 4000; then
    echo -e "${GREEN}✅ Backend is already running on port 4000${NC}"
else
    echo -e "${YELLOW}Starting Backend...${NC}"
    cd backend
    npm install > /dev/null 2>&1
    npm run dev &
    BACKEND_PID=$!
    cd ..
    sleep 3
    echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID)${NC}"
fi

# Check and start frontend
echo -e "${YELLOW}Checking Frontend (Port 5173)...${NC}"
if check_port 5173; then
    echo -e "${GREEN}✅ Frontend is already running on port 5173${NC}"
else
    echo -e "${YELLOW}Starting Frontend...${NC}"
    cd frontend
    npm install > /dev/null 2>&1
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    sleep 3
    echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID)${NC}"
fi

# Wait a moment for services to fully start
echo -e "${YELLOW}Waiting for services to initialize...${NC}"
sleep 5

# Run the full-stack test
echo -e "${YELLOW}Running Full-Stack Tests...${NC}"
node test-fullstack.js

echo ""
echo "=================================================="
echo "🌐 Your application should be running at:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:4000"
echo "=================================================="
echo ""
echo "To stop services:"
echo "   Press Ctrl+C or run: pkill -f 'npm run dev'"