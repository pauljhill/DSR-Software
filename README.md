# DSR Management Software

A specialized software application for managing Dangerous Substances Records (DSR) for laser and entertainment equipment.

## Features

- Show management for live events
- Equipment tracking and management
- PDF generation of DSR forms
- Equipment expansion from shorthand notation to detailed specifications
- Venue and airport database

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
cd ..
```

3. Make the restart scripts executable:
```
chmod +x restart.sh
chmod +x frontend/restart.sh
chmod +x backend/restart.sh
```

## Running the Application

You can use the provided restart scripts to run the application:

### Start both servers (recommended):
```
./restart.sh
```

### Start only the frontend:
```
cd frontend
./restart.sh
```

### Start only the backend:
```
cd backend
./restart.sh
```

## Accessing the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Application Structure

- `frontend/` - React frontend application
  - `src/components/` - Reusable UI components
  - `src/pages/` - Page components for different routes
  - `public/` - Static assets
- `backend/` - Node.js backend API
  - `server.js` - Main server file
  - `pdf-service.js` - PDF generation service
- `data/` - CSV data files and storage for shows
  - `shows.csv` - Show database
  - `equipment.csv` - Equipment database with specifications
  - `venues.csv` - Venue information
  - `airports.csv` - Airport information for travel
  - `templates/` - PDF templates
  - `shows/` - Show-specific files organized by folder

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

## PDF Generation

The application can automatically generate PDF documents for shows:
1. It loads the show data from the database
2. Fills in a template PDF with show details
3. Expands equipment shorthand into detailed specifications
4. Saves the completed PDF in the show's folder

Generated PDFs can be viewed directly in the application or downloaded.

## License

This software is proprietary and confidential.

## Support

For support inquiries, please contact the development team.