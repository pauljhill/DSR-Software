const fs = require('fs');
const PDFDocument = require('pdfkit');
const path = require('path');

// Create a document
const doc = new PDFDocument();

// Define the output path
const outputPath = path.join(__dirname, '../data/templates/custom_template.pdf');

// Pipe the PDF document to a file
const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

// Add content to the PDF
doc.fontSize(25).text('Custom PDF Template', 100, 80);
doc.fontSize(12).text('This is a custom template created using PDFKit.', 100, 120);

// Add form fields
doc.rect(100, 200, 400, 30).stroke();
doc.text('Show ID:', 50, 210);

doc.rect(100, 250, 400, 30).stroke();
doc.text('Show Name:', 50, 260);

doc.rect(100, 300, 400, 30).stroke();
doc.text('Show Date:', 50, 310);

doc.rect(100, 350, 400, 30).stroke();
doc.text('Venue:', 50, 360);

doc.rect(100, 400, 400, 100).stroke();
doc.text('Equipment List:', 50, 410);

// Finalize the PDF and end the stream
doc.end();

stream.on('finish', function() {
  console.log(`PDF created at ${outputPath}`);
});
