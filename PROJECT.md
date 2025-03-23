# RayLX DSR Management System

## Core Purpose
A web-based system to create, store, and manage Display Safety Records (DSRs) for laser shows, compliant with AS/NZS IEC 60825.3:2022.

## System Components

### 1. User Interface
- **Main View**: Table of all shows (read-only)
- **Show View**: Detailed view/edit of individual shows
- **Equipment View**: Manage laser equipment inventory
- **User View**: Manage users and LSO certifications

### 2. Data Structure
```
Database Tables:
- shows (main show information)
- equipment (laser inventory)
- users (staff and permissions)
- lso_certifications (tracking validity)

File Storage (/mnt/nas/raylx_storage/):
├── shows/                    # Show folders
│   └── YYYYMMDD-ShowName/   # Individual show
│       ├── files/           # Show attachments
│       ├── changes.log      # Change history
│       └── dsr.pdf         # Current DSR
└── database/               # CSV exports
```

### 3. User Roles
- **Admin**: Full access, manages users/LSO certs, can create LSO accounts
- **LSO**: Can create/edit shows if certification valid, needs personal login
- **Viewer**: Read-only access to shows

### 4. Core Features
1. **Show Management**
   - Create/edit shows with required safety info
   - Attach photos and documents
   - Generate standardized PDF reports
   - Track all changes in log

2. **Equipment Tracking**
   - Maintain laser inventory
   - Track usage in shows
   - Mark equipment as retired

3. **LSO Management**
   - Track certification expiry
   - Automatic access control based on valid cert
   - Yearly in-house training tracking

### 5. Technical Implementation
- **Frontend**: React with Material-UI
- **Backend**: Node.js + Express
- **Storage**: PostgreSQL + NAS for files
- **Security**: Basic auth, role-based access

## Development Status

### Confirmed Decisions
1. **Shows**
   - Naming: date-name-location
   - No archiving needed
   - Support for images and documents

2. **Equipment**
   - Use retired flag for old equipment
   - Simple quantity tracking in shows
   - No certificate storage needed

3. **Users**
   - LSO certification countdown
   - Records preserved when users leave
   - Admin is also LSO

4. **Files**
   - One log file per show
   - No file size limits
   - Backups handled by NAS

### Pending Decisions
1. Complete DSR form fields from standard
2. Equipment database structure
3. NAS mount details
4. Standard-specific formatting

## Next Steps
1. Define complete DSR form structure
2. Create equipment database schema
3. Setup development environment
4. Begin frontend development

## Project Plan

### Week 1
- Day 1: Setup project & database view
- Day 2-3: Basic login & table interface
- Day 4-5: DSR creation & PDF export

### Week 2
- Day 1-2: Equipment list & editing interface
- Day 3-4: Testing & fixes
- Day 5: Deploy

### Future Ideas (If Needed)
- Email reminders
- Incident reports
- Equipment maintenance

## Project Structure
```
raylx-dsr/
├── frontend/               # React frontend application
│   ├── src/               # Source files
│   ├── public/            # Static files
│   └── package.json       # Frontend dependencies
├── backend/               # Node.js backend application
│   ├── models/           # Data models
│   ├── data/             # CSV data storage
│   └── package.json      # Backend dependencies
└── start.sh              # Start script
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation
1. Clone the repository:
```bash
git clone <repository-url>
cd raylx-dsr
```

2. Install dependencies and start the application:
```bash
chmod +x start.sh
./start.sh
```

The script will:
- Install backend dependencies and start the server on port 5000
- Install frontend dependencies and start the development server on port 3000

### Manual Setup
If you prefer to run the services separately:

#### Backend
```bash
cd backend
npm install
npm start
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

## Data Storage
The application uses CSV files for data storage, located in the `backend/data` directory:
- `shows.csv`: Contains show information
- No database required - CSV based

## Development Guidelines
1. Use CSV files for all data storage
2. Follow ESLint rules for code consistency
3. Test all API endpoints before committing changes

## Development Questions

### Business Requirements
- Specific Australian standards compliance details   
AS-NZS-IEC-60825-3-2022
- DSR record retention requirements
assume more then enough stroage for ever
- LSO certification requirements
each LSO dose the ILDA reconised corse as well as in house training 
thie in house is yearly 
- Incident reporting procedures
need something for this 


### Technical Requirements
- Expected user load
low 1-5 users at most 

- File storage specifications
image and vedio might need some kind of playback 
- Security compliance standards
just good enough 
- Performance requirements
just good enough


### Integration Requirements
- External system interfaces
- Data import/export formats
hmmm this will need to be done but mostlikely a csv for database info 
- Email/notification systems
Not at this time 
- Reporting integrations



## Security Implementation
- JWT authentication with secure token handling
- Role-based access control (Admin/LSO/Viewer)
- Input validation on all forms
- SQL injection prevention
- XSS/CSRF protection
- Rate limiting on login attempts
- Audit logging of all actions
- Secure file handling
- HTTPS enforcement
- Secure cookie configuration
- Password complexity requirements
- Brute force protection

## Questions to Answer

### Show Details
1. What fields are required for each show?
   ✓ Basic fields identified: date, showname, location
   ❗ Need complete list of all required fields from standard

2. What is the naming convention for shows?
   ✓ Confirmed: date-name-location

3. What file types need to be supported?
   ✓ Confirmed: jpg, png, and any camera-generated files

4. Should old shows be archived after a certain time?
   ✓ Confirmed: No archiving needed, keep all records

### Equipment
1. What details are needed for each piece of equipment?
   ❗ Still needs to be defined

2. How to handle equipment that gets replaced/updated?
   ✓ Confirmed: Add 'retired' field, hide retired items from active lists

3. What certificates need to be stored?
   ✓ Confirmed: No certificates stored, just record keeping