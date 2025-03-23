# DSR Management Software

A specialized software application for managing Dangerous Substances Records (DSR) for laser and entertainment equipment.

## Features

- Show management for live events
- Equipment tracking and management
- PDF generation of DSR forms
- CSV data import/export
- Equipment expansion from shorthand notation to detailed specifications

## Installation

1. Clone this repository:
```
git clone https://github.com/pauljhill/DSR-Software.git
cd DSR-Software
```

2. Install dependencies for both frontend and backend:
```
cd frontend
npm install
cd ../backend
npm install
```

## Running the Application

You can use the provided restart scripts to run the application:

### Start both servers (recommended):
```
chmod +x restart.sh
./restart.sh
```

### Start only the frontend:
```
cd frontend
chmod +x restart.sh
./restart.sh
```

### Start only the backend:
```
cd backend
chmod +x restart.sh
./restart.sh
```

## Accessing the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Application Structure

- `frontend/` - React frontend application
- `backend/` - Node.js backend API
- `data/` - Sample data and storage for shows
- `equipment/` - Equipment database files

## Equipment Expansion

The system can expand shorthand equipment notation like "8 x ClubMax 1800 RGB" into detailed specifications including:
- Quantity
- Brand
- Model
- Power
- NOHD (Nominal Ocular Hazard Distance)
- Wavelengths
- Other safety specifications

This feature is used when generating PDF documents with complete equipment details.

## License

This software is proprietary and confidential.