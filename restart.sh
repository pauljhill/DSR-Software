#!/bin/bash

# Get the backup name from the first argument or use date-time if not provided
BACKUP_NAME="${1:-restart_$(date +"%Y%m%d_%H%M%S")}"

echo "🔄 Restarting servers..."

# Kill any existing servers
echo "🛑 Stopping existing servers..."
echo "Stopping processes on ports 3000 (frontend) and 3001 (backend)..."
pkill -f "node server.js" || true
lsof -ti :3000,3001 | xargs -r kill -9 || true

# Wait a moment to ensure ports are freed
echo "⏱️ Waiting for ports to be released..."
sleep 2

# Ensure data directory exists
echo "📁 Ensuring data directories exist..."
mkdir -p /home/tech/DSR/data/shows

# Start backend server
echo "🚀 Starting backend server..."
cd /home/tech/DSR/backend
HOST=0.0.0.0 node server.js > /home/tech/DSR/backend/server.log 2>&1 &
BACKEND_PID=$!
echo "Backend server started with PID: $BACKEND_PID"

# Wait for backend to initialize
echo "⏱️ Waiting for backend to initialize..."
sleep 3

# Start frontend server
echo "🚀 Starting frontend server..."
cd /home/tech/DSR/frontend
HOST=0.0.0.0 npm start > /home/tech/DSR/frontend/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend server started with PID: $FRONTEND_PID"

# Get the local IP address
LOCAL_IP=$(hostname -I | awk '{print $1}')

echo "✨ Servers restarted successfully!"
echo "📌 Frontend: http://localhost:3000 or http://$LOCAL_IP:3000"
echo "📌 Backend: http://localhost:3001 or http://$LOCAL_IP:3001"
echo "📝 Logs:"
echo "   - Backend: /home/tech/DSR/backend/server.log"
echo "   - Frontend: /home/tech/DSR/frontend/frontend.log"

# Run backup after restarting (in background) using the new backkup.sh script
echo "📦 Starting project backup in background with name: $BACKUP_NAME..."
cd /home/tech/DSR
./backkup.sh "$BACKUP_NAME" > /home/tech/DSR-backups/backup.log 2>&1 &
echo "📦 Backup process started in background (see /home/tech/DSR-backups/backup.log for details)"