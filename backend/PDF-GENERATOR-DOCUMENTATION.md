# PDF Generator Documentation

## Overview
This documentation covers the implementation of the PDF generation system used in the DSR application. The system is designed to generate Display Safety Record (DSR) PDF documents from show data, compliant with AS/NZS IEC 60825.3:2022.

## Components

### 1. PDF Service Module (`pdf-service.js`)
The main module that handles PDF generation, form filling, and updates for DSR documents.

### 2. Template Creator (`create-template.js`)
A utility script that creates the PDF template with placeholders for data fields.

## PDF Generation Process

### 1. Data Collection
- Show data is read from `shows.csv`
- Equipment details are retrieved from `equipment.csv`
- User information is collected from `users.csv`

### 2. Template Preparation
- A PDF template with invisible placeholders is used as the base
- The template has multiple pages to accommodate all required information

### 3. Form Filling
- The PDF service populates the template with actual show data
- Special formatting is applied (dates, equipment lists, etc.)
- Tables and lists are dynamically generated based on the data

### 4. PDF Output
- The filled PDF is saved to the show's folder as `dsr.pdf`
- A record of the generation is added to the change log

## Background PDF Update Process

- The server runs a background task that checks for shows needing PDF updates
- When show data changes, the corresponding DSR is automatically regenerated
- This ensures PDFs are always in sync with the CSV data

## Key Functions

### `generateShowPDF(showId)`
Generates a PDF for a specific show based on its ID.

### `checkAndUpdatePDFs()`
Background process that checks for and updates any PDFs that need regeneration.

### `parseAndExpandEquipmentList(equipmentListString)`
Parses equipment strings and expands them with detailed information from the equipment database.

## Implementation Notes

1. **PDF Library**: We use `pdf-lib` for PDF manipulation
2. **Font Support**: The PDF generator uses custom fonts registered with fontkit
3. **Error Handling**: Detailed error logging for PDF generation issues
4. **Performance**: The PDF generation happens asynchronously to prevent blocking the main thread

## Debugging

- Logging is enabled for PDF operations in `equipment-debug.log`
- PDF generation errors are logged in the server console
- Failed PDF generations are retried automatically

## Future Improvements

- Add support for custom templates
- Implement PDF form filling for interactive forms
- Add more visualization options (charts, diagrams)
- Optimize PDF generation for large equipment lists
