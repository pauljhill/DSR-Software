/**
 * Script to create a PDF template with invisible placeholders
 * This template will be used for testing the PDF generation system
 * Updated to include all fields from shows.csv
 */

const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const fs = require('fs-extra');
const path = require('path');
const csv = require('csv-parser');

console.log('Starting DSR template creation script...');

// Set the template directory
const DATA_DIR = path.join(__dirname, '..', 'data');
const TEMPLATES_DIR = path.join(DATA_DIR, 'templates');

// Ensure templates directory exists
fs.ensureDirSync(TEMPLATES_DIR);
console.log(`Template directory: ${TEMPLATES_DIR}`);

// Helper function to read CSV headers
async function getCSVFields(csvPath) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(csvPath)) {
      return reject(new Error(`File not found: ${csvPath}`));
    }
    
    console.log(`Opening CSV file: ${csvPath}`);
    
    // Read just the first row to get headers
    let headers = [];
    let isFirstRow = true;
    
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('headers', (headerList) => {
        console.log(`Found headers: ${headerList.join(', ')}`);
        headers = headerList;
      })
      .on('data', (row) => {
        // We only need headers, so we'll immediately end the stream
        // after the first row using a flag
        if (isFirstRow) {
          isFirstRow = false;
          // No need to do anything, just let it continue and end naturally
          console.log('Read first row of data, headers are complete');
        }
      })
      .on('end', () => {
        console.log(`CSV reading complete, found ${headers.length} headers`);
        resolve(headers);
      })
      .on('error', (error) => {
        console.error(`Error reading CSV: ${error.message}`);
        reject(error);
      });
  });
}

async function createDSRTemplate() {
  // Get all fields from shows.csv
  const csvPath = path.join(DATA_DIR, 'shows.csv');
  let fields = [];
  
  console.log(`Reading CSV fields from: ${csvPath}`);
  try {
    fields = await getCSVFields(csvPath);
    console.log('Found fields in shows.csv:', fields);
  } catch (error) {
    console.error('Error reading CSV fields:', error);
    console.log('Using default fields list instead');
    // Use a default set of fields if we can't read the CSV
    fields = [
      'name', 'status', 'date', 'id', 'equipmentList', 'lsoName', 'crew', 
      'operatorName', 'operatorContact', 'showTimes', 'client', 'clientPhone', 
      'venue', 'venueAddress', 'lsoEmail', 'lsoContact', 'aviationNeeded', 
      'notamIssued', 'notamNotes', 'venueConsulted', 'venueConsultedNotes', 
      'laserAreaSigned', 'lasersSecurelyMounted', 'beamProtocolNeeded', 
      'crewBriefed', 'emergencyStops', 'eStopTestingNotes', 'lasersFocused', 
      'beamPathsVerified', 'beamsWithinZones', 'showNotes', 'clientFeedbackReceived', 
      'clientFeedback', 'equipmentIssues', 'equipmentChecked', 'equipmentIssuesNotes'
    ];
  }
  
  console.log(`Creating PDF with ${fields.length} fields`);

  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Add blank pages for a multi-page template
  const page1 = pdfDoc.addPage([612, 792]); // US Letter size
  const page2 = pdfDoc.addPage([612, 792]); // Second page
  const page3 = pdfDoc.addPage([612, 792]); // Third page for additional fields
  
  // Get the fonts
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  
  // Set margins
  const margin = 50;
  const width = page1.getWidth() - 2 * margin;
  
  // ======= PAGE 1 =======
  // Add heading
  page1.drawText('Display Safety Record (DSR)', {
    x: margin,
    y: page1.getHeight() - margin,
    size: 18,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  // Add a subheading
  page1.drawText('AS/NZS IEC 60825.3:2022 Compliance Document', {
    x: margin,
    y: page1.getHeight() - margin - 24,
    size: 12,
    font: italicFont,
    color: rgb(0, 0, 0),
  });
  
  // Show details section
  let yPos = page1.getHeight() - margin - 60;
  
  // Section header
  page1.drawText('1. Show Details', {
    x: margin,
    y: yPos,
    size: 14,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  yPos -= 25;
  
  // Draw labels and invisible placeholders
  // Show ID
  page1.drawText('Show ID:', {
    x: margin,
    y: yPos,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  // Show name
  page1.drawText('Show Name:', {
    x: margin + 300,
    y: yPos,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  yPos -= 35;
  
  // Date
  page1.drawText('Date:', {
    x: margin,
    y: yPos,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  // Status
  page1.drawText('Status:', {
    x: margin + 300,
    y: yPos,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  yPos -= 35;
  
  // Show Times
  page1.drawText('Show Times:', {
    x: margin,
    y: yPos,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  yPos -= 35;
  
  // Venue
  page1.drawText('Venue:', {
    x: margin,
    y: yPos,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  // Venue Phone
  page1.drawText('Venue Phone:', {
    x: margin + 300,
    y: yPos,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  yPos -= 35;
  
  // Venue Address
  page1.drawText('Venue Address:', {
    x: margin,
    y: yPos,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  yPos -= 35;
  
  // Venue Consulted
  page1.drawText('Venue Consulted:', {
    x: margin,
    y: yPos,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  // Laser Area Signed
  page1.drawText('Laser Area Signed:', {
    x: margin + 230,
    y: yPos,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  yPos -= 35;
  
  // Venue Consulted Notes
  page1.drawText('Venue Notes:', {
    x: margin,
    y: yPos,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  yPos -= 35;

  // LSO section
  yPos -= 15;
  page1.drawText('2. Laser Safety Officer', {
    x: margin,
    y: yPos,
    size: 14,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  yPos -= 25;
  
  // LSO Name
  page1.drawText('LSO Name:', {
    x: margin,
    y: yPos,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  // LSO Contact
  page1.drawText('LSO Contact:', {
    x: margin + 300,
    y: yPos,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  yPos -= 35;
  
  // LSO Email
  page1.drawText('LSO Email:', {
    x: margin,
    y: yPos,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  yPos -= 35;
  
  // Client section
  yPos -= 15;
  page1.drawText('3. Client Information', {
    x: margin,
    y: yPos,
    size: 14,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  yPos -= 25;
  
  // Client Name
  page1.drawText('Client Name:', {
    x: margin,
    y: yPos,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  // Client Phone
  page1.drawText('Client Phone:', {
    x: margin + 300,
    y: yPos,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  yPos -= 35;
  
  // Operator section
  yPos -= 15;
  page1.drawText('4. Operator Information', {
    x: margin,
    y: yPos,
    size: 14,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  yPos -= 25;
  
  // Operator Name
  page1.drawText('Operator Name:', {
    x: margin,
    y: yPos,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  // Operator Contact
  page1.drawText('Operator Contact:', {
    x: margin + 300,
    y: yPos,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  yPos -= 35;
  
  // Crew
  page1.drawText('Crew:', {
    x: margin,
    y: yPos,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  // ======= PAGE 2 =======
  // Reset y position for next page
  yPos = page2.getHeight() - margin;
  
  // Add heading for page 2
  page2.drawText('Display Safety Record (DSR) - Page 2', {
    x: margin,
    y: yPos,
    size: 18,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  yPos -= 30;
  
  // Equipment section
  page2.drawText('5. Equipment', {
    x: margin,
    y: yPos,
    size: 14,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  yPos -= 25;
  
  // Equipment List
  page2.drawText('Equipment List:', {
    x: margin,
    y: yPos,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  yPos -= 100; // Leave space for equipment list
  
  // Equipment Checked
  page2.drawText('Equipment Checked:', {
    x: margin,
    y: yPos,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  // Equipment Issues
  page2.drawText('Equipment Issues:', {
    x: margin + 230,
    y: yPos,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  yPos -= 35;
  
  // Equipment Issues Notes
  page2.drawText('Equipment Issues Notes:', {
    x: margin,
    y: yPos,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  yPos -= 50; // Leave space for notes
  
  // Safety section
  yPos -= 15;
  page2.drawText('6. Safety Checklist', {
    x: margin,
    y: yPos,
    size: 14,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  yPos -= 25;
  
  // Aviation Needed
  page2.drawText('Aviation Notification Needed:', {
    x: margin,
    y: yPos,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  // NOTAM Issued
  page2.drawText('NOTAM Issued:', {
    x: margin + 230,
    y: yPos,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  yPos -= 35;
  
  // NOTAM Notes
  page2.drawText('NOTAM Notes:', {
    x: margin,
    y: yPos,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  yPos -= 50; // Leave space for notes
  
  // Lasers Securely Mounted
  page2.drawText('Lasers Securely Mounted:', {
    x: margin,
    y: yPos,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  // Beam Protocol Needed
  page2.drawText('Beam Protocol Needed:', {
    x: margin + 230,
    y: yPos,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  yPos -= 35;
  
  // Crew Briefed
  page2.drawText('Crew Briefed:', {
    x: margin,
    y: yPos,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  // Emergency Stops
  page2.drawText('Emergency Stops Tested:', {
    x: margin + 230,
    y: yPos,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  yPos -= 35;
  
  // E-Stop Testing Notes
  page2.drawText('E-Stop Testing Notes:', {
    x: margin,
    y: yPos,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  yPos -= 50; // Leave space for notes
  
  // Lasers Focused
  page2.drawText('Lasers Focused:', {
    x: margin,
    y: yPos,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  // Beam Paths Verified
  page2.drawText('Beam Paths Verified:', {
    x: margin + 230,
    y: yPos,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  yPos -= 35;
  
  // Beams Within Zones
  page2.drawText('Beams Within Zones:', {
    x: margin,
    y: yPos,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  // ======= PAGE 3 =======
  // Reset y position for next page
  yPos = page3.getHeight() - margin;
  
  // Add heading for page 3
  page3.drawText('Display Safety Record (DSR) - Page 3', {
    x: margin,
    y: yPos,
    size: 18,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  yPos -= 30;
  
  // Notes section
  page3.drawText('7. Notes and Feedback', {
    x: margin,
    y: yPos,
    size: 14,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  yPos -= 25;
  
  // Show Notes
  page3.drawText('Show Notes:', {
    x: margin,
    y: yPos,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  yPos -= 100; // Leave space for show notes
  
  // Client Feedback Received
  page3.drawText('Client Feedback Received:', {
    x: margin,
    y: yPos,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  yPos -= 35;
  
  // Client Feedback
  page3.drawText('Client Feedback:', {
    x: margin,
    y: yPos,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  yPos -= 100; // Leave space for client feedback
  
  // Signatures section
  yPos -= 15;
  page3.drawText('8. Sign-Off', {
    x: margin,
    y: yPos,
    size: 14,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  yPos -= 25;
  
  // LSO Signature
  page3.drawText('LSO Signature:', {
    x: margin,
    y: yPos,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  // Date
  page3.drawText('Date:', {
    x: margin + 300,
    y: yPos,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  yPos -= 50; // Leave space for signature
  
  // Client Signature
  page3.drawText('Client Signature:', {
    x: margin,
    y: yPos,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  // Date
  page3.drawText('Date:', {
    x: margin + 300,
    y: yPos,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  // Save the PDF template
  const templatePath = path.join(TEMPLATES_DIR, 'dsr_template.pdf');
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(templatePath, pdfBytes);
  
  console.log(`Template created successfully: ${templatePath}`);
  return templatePath;
}

// Main function
async function main() {
  try {
    const templatePath = await createDSRTemplate();
    console.log(`Template created at: ${templatePath}`);
  } catch (error) {
    console.error('Error creating template:', error);
    process.exit(1);
  }
}

// Run the main function
main();
