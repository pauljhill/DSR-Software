# PDF Generator Documentation

## Overview

The PDF generation system is designed to create standardized DSR (Dangerous Substances Record) forms for shows. It takes show data from CSV files and creates a PDF document with all relevant information filled in.

## Components

### 1. PDF Service Module (`pdf-service.js`)

The core functionality is in the PDF service module, which contains the following key functions:

#### `readCSVFile(filePath)`

Reads and parses a CSV file, returning an array of objects with column headers as keys.

#### `parseAndExpandEquipmentList(equipmentString)`

Parses a string of equipment (e.g., "8 x ClubMax 1800 RGB; 4.x Chauvet Geyser") and expands it into detailed objects with:
- Quantity
- Brand
- Model
- Power output
- NOHD (Nominal Ocular Hazard Distance)
- Wavelengths

This function loads equipment data from the equipment database CSV and matches each item to get its specifications.

#### `generateShowPDF(showId)`

Main function that generates a PDF for a specific show:
1. Reads show data from shows.csv
2. Loads the PDF template
3. Calls fillPDFForm to populate the template with show data
4. Saves the filled PDF to the show's folder

#### `fillPDFForm(pdfBytes, formData)`

Takes a PDF template and form data, and populates the PDF form fields with the data:
1. Processes the equipment list if present
2. Fills in all form fields based on field names matching keys in formData

#### `updateShowPDFFlag(showId, hasGeneratedPDF)`

Updates the shows.csv file to mark a show as having a generated PDF.

### 2. Express API Endpoint (`server.js`)

```javascript
app.post('/api/pdf/generate/:id', async (req, res) => {
  try {
    const showId = req.params.id;
    logger.info(`Generating PDF for show ${showId}`);
    
    const pdfPath = await generateShowPDF(showId);
    
    if (pdfPath) {
      // Update the show record to mark PDF as generated
      await updateShowPDFFlag(showId, true);
      
      logger.info(`PDF generated successfully: ${pdfPath}`);
      res.json({ success: true, message: 'PDF generated successfully', pdfPath });
    } else {
      logger.error(`Failed to generate PDF for show ${showId}`);
      res.status(500).json({ success: false, message: 'PDF generation failed' });
    }
  } catch (err) {
    logger.error(`Error generating PDF: ${err.message}`);
    res.status(500).json({ success: false, message: err.message });
  }
});
```

## PDF Template

The system uses a pre-designed PDF template with form fields. The template is located at `/data/templates/dsr_template.pdf`. 

Field names in the template should match the property names in the shows.csv file for automatic population.

## Equipment Expansion

One key feature is the expansion of equipment notation. For example:

```
8 x ClubMax 1800 RGB
```

Is expanded to objects containing:

```json
{
  "quantity": 8,
  "brand": "Kvant",
  "model": "ClubMax 1800 RGB",
  "power": "1800mW",
  "nohd": "450m",
  "wavelengths": "638nm, 520nm, 450nm"
}
```

This allows for detailed equipment information in the generated PDF.

## Usage

To generate a PDF for a show:

```
POST /api/pdf/generate/:showId
```

For example:

```
curl -X POST http://localhost:3001/api/pdf/generate/SH001
```

The response will include the path to the generated PDF:

```json
{
  "success": true,
  "message": "PDF generated successfully",
  "pdfPath": "/data/shows/SH001-base_makes_the_face/dsr.pdf"
}
```

## Error Handling

The system includes error handling for:
- Missing shows
- Missing template files
- Issues with PDF generation
- Issues with form filling
- Equipment not found in the database

All errors are logged to the server log file.
