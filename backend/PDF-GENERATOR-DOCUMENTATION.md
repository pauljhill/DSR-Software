# PDF Generator Documentation

This document describes the PDF generation system for the DSR Management Software.

## Overview

The PDF generation system creates standardized PDF documents for show documentation, using data from the shows.csv file and equipment database.

## Components

### pdf-service.js

The main module that handles PDF generation, form filling, and updates for DSR documents.

**Key Functions:**

- `generateShowPDF(showId)`: Generates or updates a PDF for a specific show
- `fillPDFForm(templatePath, outputPath, formData)`: Fills out a PDF with data by replacing placeholders with actual text
- `parseAndExpandEquipmentList(equipmentListString)`: Parses and expands an equipment list string into detailed equipment objects

### create-template.js

Utility for creating PDF templates with placeholders that can be filled in by the pdf-service.

## Data Flow

1. User requests PDF generation for a show
2. System retrieves show data from shows.csv
3. Equipment list is expanded with details from equipment database
4. PDF template is filled with the show data
5. Completed PDF is saved to the show's folder

## Template Format

The PDF template uses placeholders in the format `{{fieldName}}` which are replaced with actual data during generation.