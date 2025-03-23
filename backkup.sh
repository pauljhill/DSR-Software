#!/bin/bash

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

# Check if backup directory exists or create it
BACKUP_DIR="/mnt/backup/DSR_backups"
if [ ! -d "$BACKUP_DIR" ]; then
    display_step "Creating backup directory at $BACKUP_DIR"
    mkdir -p "$BACKUP_DIR"
    if [ $? -ne 0 ]; then
        display_error "Failed to create backup directory. Check permissions."
        exit 1
    fi
fi

# Create a timestamp for the backup
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_PATH="$BACKUP_DIR/dsr_backup_$TIMESTAMP.tar.gz"

display_step "Creating backup of the DSR system"

# Create the backup (excluding node_modules and other unnecessary files)
tar --exclude="node_modules" --exclude=".git" -czf "$BACKUP_PATH" .

if [ $? -eq 0 ]; then
    display_success "Backup created successfully at: $BACKUP_PATH"
    # Keep only the last 10 backups
    display_step "Maintaining backup history (keeping last 10 backups)"
    ls -t "$BACKUP_DIR"/*.tar.gz | tail -n +11 | xargs -r rm
    display_success "Backup maintenance completed"
    
    # Show total number of backups and disk usage
    BACKUP_COUNT=$(ls "$BACKUP_DIR"/*.tar.gz 2>/dev/null | wc -l)
    DISK_USAGE=$(du -sh "$BACKUP_DIR" | cut -f1)
    echo -e "${GREEN}Total backups: ${NC}$BACKUP_COUNT"
    echo -e "${GREEN}Backup storage usage: ${NC}$DISK_USAGE"
else
    display_error "Backup failed!"
    exit 1
fi
