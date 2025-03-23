#!/bin/bash

# Restart script for backend server
# This script can be used to restart just the backend server

# Kill any existing processes on port 3001
echo "Checking for existing processes on port 3001..."
kill $(lsof -t -i:3001) 2>/dev/null

# Start backend server
echo "Starting backend server..."
npm install
node server.js &
BACKEND_PID=$!

# Display info
echo ""
echo "-------------------------------------"
echo "Backend server is starting up!"
echo "-------------------------------------"
echo "Backend URL: http://localhost:3001"
echo "-------------------------------------"
echo ""
echo "Press Ctrl+C to stop the server"

# Trap Ctrl+C and kill the process
trap "kill $BACKEND_PID; exit" INT

# Wait for process to finish
wait