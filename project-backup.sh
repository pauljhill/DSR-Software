#!/bin/bash

# Simple DSR Project Backup Script
# This script creates a complete backup of the DSR project and stores it in ~/DSR-backups

# Set variables
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="$HOME/DSR-backups"
PROJECT_DIR="/home/tech/DSR"
BACKUP_FILE="$BACKUP_DIR/DSR_backup_$TIMESTAMP.zip"

# Create backup directory if it doesn't exist
if [ ! -d "$BACKUP_DIR" ]; then
    echo "Creating backup directory $BACKUP_DIR"
    mkdir -p "$BACKUP_DIR"
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to create backup directory. Check permissions."
        exit 1
    fi
fi

# Display start message
echo "Starting complete backup at $(date)"
echo "Backing up $PROJECT_DIR to $BACKUP_FILE"

# Create the backup using zip
cd /home/tech
zip -r "$BACKUP_FILE" DSR -x "DSR/node_modules/*"

# Check if backup was successful
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to create backup."
    exit 1
fi

# Display success message
echo "Backup completed successfully at $(date)"
echo "Backup saved to: $BACKUP_FILE"
echo "Backup size: $(du -h "$BACKUP_FILE" | cut -f1)"

exit 0 