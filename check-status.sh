#!/bin/bash

echo "🔍 Quick Full-Stack Health Check"
echo "================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check MySQL
echo -n "Database (MySQL): "
if pgrep -x "mysqld" > /dev/null; then
    echo -e "${GREEN}✅ Running${NC}"
else
    echo -e "${RED}❌ Not running${NC}"
fi

# Check Backend
echo -n "Backend (Port 4000): "
if curl -s http://localhost:4000/ > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Running${NC}"
else
    echo -e "${RED}❌ Not running${NC}"
fi

# Check Frontend
echo -n "Frontend (Port 5173): "
if curl -s http://localhost:5173/ > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Running${NC}"
else
    echo -e "${RED}❌ Not running${NC}"
fi

echo ""
echo "To start all services: ./start-all.sh"
echo "To run detailed tests: node test-fullstack.js"