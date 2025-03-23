#!/bin/bash

# Create backup script for DSR project
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/tech/backup/DSR_backup_${TIMESTAMP}"

echo "Creating backup of DSR project to ${BACKUP_DIR}"

# Create backup directory
mkdir -p ${BACKUP_DIR}

# Copy all project files
cp -R /home/tech/DSR/* ${BACKUP_DIR}/

# Create backup log
echo "Backup created on $(date)" > ${BACKUP_DIR}/backup_info.txt
echo "Source: /home/tech/DSR" >> ${BACKUP_DIR}/backup_info.txt
echo "Files included:" >> ${BACKUP_DIR}/backup_info.txt
find /home/tech/DSR -type f | grep -v "node_modules" | sort >> ${BACKUP_DIR}/backup_info.txt

echo "Backup completed successfully to ${BACKUP_DIR}"
echo "Total size of backup: $(du -sh ${BACKUP_DIR} | cut -f1)"