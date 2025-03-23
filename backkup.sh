#!/bin/bash

# DSR Project Named Backup Script
# This script creates a backup of the DSR project with a custom name

# Check if name argument is provided
if [ $# -eq 0 ]; then
    echo "ERROR: Backup name argument is required"
    echo "Usage: $0 <backup_name>"
    echo "Example: $0 preupdate"
    exit 1
fi

# Get the backup name from the first argument
BACKUP_NAME="$1"

# Set variables
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="$HOME/DSR-backups"
PROJECT_DIR="/home/tech/DSR"
BACKUP_FILE="$BACKUP_DIR/DSR_${BACKUP_NAME}_$TIMESTAMP.zip"

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
echo "Starting ${BACKUP_NAME} backup at $(date)"
echo "Backing up $PROJECT_DIR to $BACKUP_FILE"

# Create the backup using zip
cd /home/tech
zip -r "$BACKUP_FILE" DSR -x "DSR/node_modules/*"

# Check if backup was successful
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to create ${BACKUP_NAME} backup."
    exit 1
fi

# Display success message
echo "${BACKUP_NAME} backup completed successfully at $(date)"
echo "Backup saved to: $BACKUP_FILE"
echo "Backup size: $(du -h "$BACKUP_FILE" | cut -f1)"

exit 0