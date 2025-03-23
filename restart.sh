#!/bin/bash

# Check if an argument was provided
if [ $# -eq 0 ]; then
    echo "Error: Please provide a commit message describing the changes."
    echo "Usage: $0 'Your commit message here'"
    exit 1
fi

# Store the commit message
COMMIT_MESSAGE="$1"

# Define colors for output
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
RED="\033[0;31m"
NC="\033[0m" # No Color

# Function to display a step with colorized output
display_step() {
    echo -e "${YELLOW}[STEP]${NC} $1"
}

# Function to display success messages
display_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Function to display error messages
display_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Start the process
echo -e "${YELLOW}========== RESTARTING SERVICES ==========${NC}"

# Stop any running servers
display_step "Stopping any running servers..."
pkill -f "node" || true
display_success "Servers stopped."

# Pull the latest code from git
display_step "Pulling latest code from repository..."
git add .
git commit -m "$COMMIT_MESSAGE"
git pull
display_success "Code updated."

# Start backend server
display_step "Starting backend server..."
cd backend
npm start & 
cd ..
display_success "Backend server started."

# Start frontend server
display_step "Starting frontend server..."
cd frontend
npm start &
cd ..
display_success "Frontend server started."

echo -e "${GREEN}========== ALL SERVICES RESTARTED ==========${NC}"
echo -e "${GREEN}Commit message: ${NC}$COMMIT_MESSAGE"
