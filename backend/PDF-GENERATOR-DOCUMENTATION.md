# PDF Generator Documentation

## Overview
The PDF generation system for the DSR Management System creates standardized Display Safety Record (DSR) PDFs from show data.

## Features
- Generates professional PDFs with consistent branding
- Includes all required DSR information
- Embeds equipment specifications
- Supports dynamic content based on show requirements
- Creates a standardized structure for compliance with AS/NZS IEC 60825.3:2022

## Tech Stack
- **PDFKit**: Core PDF generation library
- **Node.js Streams**: For efficient file handling
- **fs-extra**: For file system operations

## PDF Structure

### 1. Header
- RayLX logo
- Document title: "Display Safety Record"
- Show ID and date

### 2. Show Information
- Show name and venue
- Date and times
- Client information
- Location details

### 3. LSO Information
- LSO name and contact details
- Certification status

### 4. Equipment Details
- List of equipment used
- Technical specifications for each piece
- Power and safety calculations

### 5. Safety Checklist
- Venue consultation record
- Aviation notification status
- Safety measures implemented
- Emergency procedures

### 6. Post-Show Information
- Client feedback
- Issues encountered
- Notes for future shows

### 7. Appendices
- Equipment specification sheets
- Venue diagrams (if provided)

## Usage

```javascript
const pdfGenerator = require('./pdf-service');

// Generate PDF for a show
pdfGenerator.generateShowPDF(showId)
  .then(pdfPath => {
    console.log(`PDF generated at: ${pdfPath}`);
  })
  .catch(err => {
    console.error('PDF generation failed:', err);
  });
```

## Functions

### `generateShowPDF(showId)`
Generates a complete PDF for the specified show.

**Parameters:**
- `showId` (String): The ID of the show to generate a PDF for

**Returns:**
- Promise that resolves with the path to the generated PDF

### `updateShowPDF(showId)`
Updates an existing PDF when show details change.

**Parameters:**
- `showId` (String): The ID of the show to update

**Returns:**
- Promise that resolves with the path to the updated PDF

### `generateEquipmentPDF(equipmentId)`
Generates a specification sheet for a specific piece of equipment.

**Parameters:**
- `equipmentId` (String): The ID of the equipment

**Returns:**
- Promise that resolves with the path to the generated equipment PDF

## Styling

The PDF styling is controlled through a combination of PDFKit options and custom functions. Key style elements include:

- **Fonts**: Main text uses Helvetica, headers use Helvetica-Bold
- **Colors**: 
  - Primary: #003366 (dark blue)
  - Secondary: #FF6600 (orange)
  - Text: #333333 (dark gray)
- **Page size**: A4 portrait
- **Margins**: 40 points on all sides

## Troubleshooting

### Common Issues

1. **PDF generation fails with data error**: 
   - Ensure all required show data fields are present
   - Check for malformed data in the CSV files

2. **PDF is missing equipment details**:
   - Verify equipment IDs exist in equipment.csv
   - Check equipment list format in the show record

3. **Images not appearing**:
   - Confirm logo file path is correct
   - Verify image files are in supported formats (PNG, JPEG)

### Debugging

Set DEBUG environment variable to see detailed logging:

```bash
DEBUG=pdf:* node server.js
```

## Future Enhancements

1. Digital signatures for LSO approval
2. Automated email distribution of PDFs
3. QR codes linking to online records
4. Additional language support
5. Interactive form elements

## Notes

- PDFs are stored in the show folder along with the change log
- Each PDF generation creates a backup of any existing PDF
- PDF filenames follow the pattern: `dsr.pdf` (current) and `dsr-YYYYMMDD-HHMMSS.pdf` (backups)
