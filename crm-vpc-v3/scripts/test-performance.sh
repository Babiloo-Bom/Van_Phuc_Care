#!/bin/bash

# Performance Testing Script for Lighthouse

echo "🚀 Starting Performance Test..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if lighthouse is installed
if ! command -v lighthouse &> /dev/null; then
    echo -e "${YELLOW}⚠️  Lighthouse CLI not found. Installing...${NC}"
    npm install -g lighthouse
fi

# Build production
echo -e "${YELLOW}📦 Building production bundle...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful${NC}"
echo ""

# Start preview server in background
echo -e "${YELLOW}🖥️  Starting preview server...${NC}"
npm run preview &
SERVER_PID=$!

# Wait for server to start
sleep 5

# Test URL
URL="http://localhost:3101"

echo -e "${GREEN}🧪 Running Lighthouse tests...${NC}"
echo ""

# Test Mobile
echo -e "${YELLOW}📱 Testing Mobile Performance...${NC}"
lighthouse $URL \
  --preset=perf \
  --emulated-form-factor=mobile \
  --throttling.cpuSlowdownMultiplier=4 \
  --output=html \
  --output-path=./lighthouse-reports/mobile-report.html \
  --chrome-flags="--headless" \
  --quiet

echo ""

# Test Desktop
echo -e "${YELLOW}🖥️  Testing Desktop Performance...${NC}"
lighthouse $URL \
  --preset=perf \
  --emulated-form-factor=desktop \
  --output=html \
  --output-path=./lighthouse-reports/desktop-report.html \
  --chrome-flags="--headless" \
  --quiet

# Kill preview server
kill $SERVER_PID

echo ""
echo -e "${GREEN}✅ Tests completed!${NC}"
echo -e "${GREEN}📊 Reports generated in ./lighthouse-reports/${NC}"
echo ""
echo "View reports:"
echo "  Mobile:  ./lighthouse-reports/mobile-report.html"
echo "  Desktop: ./lighthouse-reports/desktop-report.html"
