#!/bin/bash

# Define the source directory (your project)
SOURCE_DIR="/home/tech/DSR"

# Define the backup directory
BACKUP_DIR="/mnt/backup/DSR_backups"

# Create a timestamp for the backup folder
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Create the backup folder with timestamp
BACKUP_FOLDER="$BACKUP_DIR/backup_$TIMESTAMP"
mkdir -p "$BACKUP_FOLDER"

# Define colors for output
GREEN="\033[0;32m"
YELLOW="\033[1;33m"
NC="\033[0m" # No Color

echo -e "${YELLOW}Starting backup process...${NC}"

# Copy the project files to the backup folder
rsync -av --exclude="node_modules" --exclude=".git" "$SOURCE_DIR/" "$BACKUP_FOLDER/"

# Check if the backup was successful
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Backup completed successfully to:${NC} $BACKUP_FOLDER"
else
    echo -e "\033[0;31mBackup failed!\033[0m"
    exit 1
fi
