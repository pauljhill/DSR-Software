#!/bin/bash

echo "Creating symlinks for data files..."
mkdir -p ./public/data
rm -f ./public/data/*.csv
ln -sf ../../data/*.csv ./public/data/

echo "Stopping any running instances..."
pkill -f "react-scripts start" || true

echo "Restarting React development server..."
npm start 