#!/bin/bash

# Restart script for DSR Management System
# Starts both frontend and backend servers

# Kill any existing processes on the relevant ports
echo "Checking for existing processes on ports 3000 and 3001..."
kill $(lsof -t -i:3000) 2>/dev/null
kill $(lsof -t -i:3001) 2>/dev/null

# Start backend server
echo "Starting backend server..."
cd backend
npm install
node server.js &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to initialize
sleep 2

# Start frontend server
echo "Starting frontend server..."
cd frontend
npm install
npm start &
FRONTEND_PID=$!

# Display info
echo ""
echo "-------------------------------------"
echo "DSR Management System is starting up!"
echo "-------------------------------------"
echo "Frontend server: http://localhost:3000"
echo "Backend server: http://localhost:3001"
echo "-------------------------------------"
echo ""
echo "Press Ctrl+C to stop both servers"

# Trap Ctrl+C and kill both processes
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT

# Wait for process to finish
wait