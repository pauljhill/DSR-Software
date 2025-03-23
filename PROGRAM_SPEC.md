# RayLX DSR Management System

**NOTE: PDF generation specification is incomplete. See backend/PDF-GENERATOR-DOCUMENTATION.md for current implementation details.**

## Overview
A system to create, manage and store Display Safety Records (DSRs) for laser shows, compliant with AS/NZS IEC 60825.3:2022.

## Project Scope
- This is a small program designed for a small company
- Development team consists of a single developer
- System requirements are focused on simplicity and practicality rather than enterprise scale
- Technology choices prioritize developer productivity and maintainability

## Core Purpose
- Create and manage DSRs for laser shows
- Track equipment usage
- Manage user access and LSO certifications
- Generate standardized PDF reports
- Maintain audit trail of changes

## System Components

### 1. File Structure
```
/mnt/nas/raylx_storage/
├── data/
│   ├── shows.csv         # Main show records
│   ├── users.csv         # Users and LSO certifications
│   └── equipment.csv     # Equipment inventory
│
└── shows/
    └── YYYYMMDD-ShowName/   # Show folders
        ├── dsr.pdf          # Current DSR PDF
        ├── changes.log      # Change history
        └── files/           # Attachments
```

### 2. CSV File Structures

#### users.csv
```csv
id,full_name,email,contact_number,role,lso_training_renew_date,password_hash,is_active,last_login
```

#### equipment.csv
```csv
id,brand,model,fb4_fitted,beam_block_fitted,max_power_draw,nohd,red_power_mw,red_divergence_mrad,red_wavelength_nm,red_lsfz,red_lcfz,red_lffz,green_power_mw,green_divergence_mrad,green_wavelength_nm,green_lsfz,green_lcfz,green_lffz,blue_power_mw,blue_divergence_mrad,blue_wavelength_nm,blue_lsfz,blue_lcfz,blue_lffz,color4_power_mw,color4_divergence_mrad,color4_wavelength_nm,color5_power_mw,color5_divergence_mrad,color5_wavelength_nm,notes
```

#### shows.csv (renamed from dsr.csv)
```csv
name,status,date,id,equipmentList,lsoName,crew,operatorName,operatorContact,showTimes,client,clientPhone,venue,venueAddress,lsoEmail,lsoContact,aviationNeeded,notamIssued,notamNotes,venueConsulted,venueConsultedNotes,laserAreaSigned,lasersSecurelyMounted,beamProtocolNeeded,crewBriefed,emergencyStops,eStopTestingNotes,lasersFocused,beamPathsVerified,beamsWithinZones,showNotes,clientFeedbackReceived,clientFeedback,equipmentIssues,equipmentChecked,equipmentIssuesNotes
```

### 3. User Interface

#### Main Views
- Show List: Table of all shows with filtering and sorting
- Show Form: Create/Edit DSR forms
- Equipment List: Manage equipment inventory
- User Management: Handle user accounts and LSO certs

#### Access Levels
- Admin: Full system access, user management
- LSO: Create/edit shows if certification valid
- Viewer: Read-only access to shows

### 4. Core Features

#### Show Management
- Create new DSRs
- Edit existing DSRs
- Generate PDF reports
- Track all changes
- Attach relevant files
- Detailed safety checklists:
  * Venue consultation
  * Aviation notification (NOTAM)
  * Laser area signage
  * Equipment mounting
  * Beam protocols
  * Crew briefing
  * Emergency stop testing
  * Laser focusing
  * Beam path verification
  * Zone compliance verification
- Post-event documentation:
  * Client feedback
  * Equipment issues
  * Show notes

#### Equipment Tracking
- Maintain detailed equipment inventory
- Track usage in shows
- Record comprehensive laser specifications:
  * Brand and model
  * FB4 and beam block status
  * Power specifications
  * Color-specific parameters (Red, Green, Blue)
  * Wavelength, power, and divergence per color
  * Safety zones (LSFZ, LCFZ, LFFZ) per color
  * NOHD calculations
- Support for additional color parameters

#### User Management
- User authentication
- Role-based access
- LSO certification tracking
- Annual training records

### 5. Technical Implementation

#### Frontend
- React with Material-UI
- Responsive design
- Form validation
- PDF preview
- File upload handling
- Modular architecture:
  * Custom hooks for data management
  * Service modules for business logic
  * Reusable UI components
  * Clean separation of concerns

#### Backend
- Node.js + Express
- CSV file operations
- PDF generation
- File system management
- User authentication

#### Security
- Password protection
- Role-based access
- Change logging
- Data validation
- Regular backups

### 6. Workflow

#### Creating a New Show
1. User fills DSR form
2. System validates all fields
3. Creates record in shows.csv
4. Creates show folder
5. Generates PDF
6. Initializes change log

#### Editing a Show
1. Load existing data
2. User makes changes
3. System validates changes
4. Updates shows.csv
5. Generates new PDF
6. Logs all changes

#### Show ID and Folder Naming
- Show IDs use format "SH###" (e.g., SH001, SH002) and are guaranteed to be unique
- System automatically increments the highest existing ID when creating new shows
- Show folders use format "SH###-ShowName" where ShowName is sanitized (special characters replaced with underscores)
- Backend has fallback mechanisms to find show folders using just the ID portion
- When adding new features, always respect this folder naming convention and unique ID system

#### Change Logging
```
[Timestamp] Username
Field: <field_name>
- Old: <old_value>
+ New: <new_value>
Reason: <change_reason>
```

### 7. Development Requirements

#### System Requirements
- Linux environment
- NAS mount point
- Node.js & npm
- PDF generation library

#### Development Setup
```bash
# Basic setup
sudo apt update
sudo apt install -y git nodejs npm

# NAS mount
//NAS_IP/share /mnt/nas/raylx_storage cifs credentials=/root/.smbcredentials 0 0
```

### 8. Future Enhancements
- Email notifications
- Equipment maintenance tracking
- Incident reporting
- Additional reporting options

## Project Timeline

### Week 1
- Basic system setup
- CSV structure implementation
- Core form creation
- PDF generation

### Week 2
- User authentication
- File management
- Testing
- Deployment

## Notes
- System designed for 1-5 concurrent users
- No database required - CSV based
- Focus on simplicity and reliability
- Must maintain data integrity
- Regular backups essential 