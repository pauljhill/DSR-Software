#!/bin/bash

# Restart script for frontend server
# This script can be used to restart just the frontend server

# Kill any existing processes on port 3000
echo "Checking for existing processes on port 3000..."
kill $(lsof -t -i:3000) 2>/dev/null

# Start frontend server
echo "Starting frontend server..."
npm install
npm start &
FRONTEND_PID=$!

# Display info
echo ""
echo "-------------------------------------"
echo "Frontend server is starting up!"
echo "-------------------------------------"
echo "Frontend URL: http://localhost:3000"
echo "-------------------------------------"
echo ""
echo "Press Ctrl+C to stop the server"

# Trap Ctrl+C and kill the process
trap "kill $FRONTEND_PID; exit" INT

# Wait for process to finish
wait