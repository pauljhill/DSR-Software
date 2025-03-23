#!/bin/bash

# Colors for output
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
NC="\033[0m" # No Color

echo -e "${YELLOW}Stopping any running react dev server...${NC}"
pkill -f "react-scripts start" || true

echo -e "${YELLOW}Starting frontend development server...${NC}"
npm start &

echo -e "${GREEN}Frontend server started!${NC}"
