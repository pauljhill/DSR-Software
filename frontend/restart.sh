#!/bin/bash

# Get the description of the changes from the first argument
CHANGE_DESC="${1:-No description provided}"

echo "🔄 Restarting frontend with changes: $CHANGE_DESC"

# Kill any existing frontend server
pkill -f "react-scripts start" || true

# Start the frontend
cd /home/tech/DSR/frontend
HOST=0.0.0.0 npm start > ./frontend.log 2>&1 &

echo "✅ Frontend restarted successfully!"