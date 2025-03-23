/**
 * PDF Service Module
 * Handles PDF generation, form filling and updates for DSR documents
 */

const path = require('path');
const fs = require('fs-extra');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');
const csv = require('csv-parser');
const parse = require('csv-parser');

// Set data directory path (relative to project root)
const dataDir = path.join(__dirname, '..', 'data');
const SHOWS_DIR = path.join(dataDir, 'shows');
const TEMPLATES_DIR = path.join(dataDir, 'templates');

// Ensure directories exist
fs.ensureDirSync(dataDir);
fs.ensureDirSync(SHOWS_DIR);
fs.ensureDirSync(TEMPLATES_DIR);

/**
 * Read and parse a CSV file
 * @param {string} filename - The CSV file to read
 * @returns {Promise<Array>} - Promise resolving to array of objects
 */
function readCSVFile(filename) {
    return new Promise((resolve, reject) => {
        const results = [];
        const filePath = path.join(dataDir, filename);

        if (!fs.existsSync(filePath)) {
            return reject(new Error(`File not found: ${filePath}`));
        }

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
}

/**
 * Parse and expand an equipment list string into detailed equipment objects
 * @param {string} equipmentListString - String with equipment items (e.g. "2 x Brand Model;")
 * @returns {Promise<Array>} - Array of expanded equipment objects
 */
async function parseAndExpandEquipmentList(equipmentListString) {
    if (!equipmentListString) {
        return [];
    }
    
    const debugLogPath = path.join(__dirname, 'equipment-debug.log');
    
    // Ensure the debug log file exists
    if (!fs.existsSync(debugLogPath)) {
        fs.writeFileSync(debugLogPath, '--- Equipment Debug Log ---\n');
    }
    
    fs.appendFileSync(debugLogPath, `\n${new Date().toISOString()} - Starting parseAndExpandEquipmentList with: ${equipmentListString}\n`);
    
    try {
        // Load equipment database
        const equipmentListPath = path.join(dataDir, 'equipment.csv');
        fs.appendFileSync(debugLogPath, `Loading equipment database from: ${equipmentListPath}\n`);
        
        const equipmentData = await new Promise((resolve, reject) => {
            const results = [];
            fs.createReadStream(equipmentListPath)
                .pipe(parse({ columns: true, skip_empty_lines: true }))
                .on('data', (data) => results.push(data))
                .on('end', () => resolve(results))
                .on('error', (error) => reject(error));
        });
        
        fs.appendFileSync(debugLogPath, `Loaded ${equipmentData.length} equipment items from database\n`);
        
        // Parse the equipment string (format: "2 x Brand Model; 3 x Other Brand Other Model")
        const itemRegex = /(\d+)\s*x\s*([^;]+)(?:;|$)/g;
        const matches = [];
        let match;
        
        while ((match = itemRegex.exec(equipmentListString)) !== null) {
            matches.push({
                quantity: parseInt(match[1]),
                description: match[2].trim()
            });
        }
        
        fs.appendFileSync(debugLogPath, `Parsed ${matches.length} items from equipment string\n`);
        
        // Process each equipment item and find its details
        const expandedItems = await Promise.all(matches.map(async (item) => {
            fs.appendFileSync(debugLogPath, `Processing item: ${item.quantity} x ${item.description}\n`);
            
            try {
                // Find the equipment in the database
                let equipmentDetails = null;
                
                // Try exact match first
                equipmentDetails = equipmentData.find(eq => 
                    `${eq.brand} ${eq.model}`.toLowerCase() === item.description.toLowerCase());
                    
                if (equipmentDetails) {
                    fs.appendFileSync(debugLogPath, `Found exact match for "${item.description}"\n`);
                }
                
                // If not found, try brand and partial model match
                if (!equipmentDetails) {
                    for (const eq of equipmentData) {
                        const fullName = `${eq.brand} ${eq.model}`.toLowerCase();
                        const itemDesc = item.description.toLowerCase();
                        
                        if (itemDesc.includes(eq.brand.toLowerCase()) && 
                            (itemDesc.includes(eq.model.toLowerCase()) || 
                             eq.model.toLowerCase().includes(itemDesc.replace(eq.brand.toLowerCase(), '').trim()))) {
                            equipmentDetails = eq;
                            fs.appendFileSync(debugLogPath, `Found brand+model match for "${item.description}": ${eq.brand} ${eq.model}\n`);
                            break;
                        }
                    }
                }
                
                // Last resort: partial match
                if (!equipmentDetails) {
                    for (const eq of equipmentData) {
                        const fullName = `${eq.brand} ${eq.model}`.toLowerCase();
                        if (fullName.includes(item.description.toLowerCase()) || 
                            item.description.toLowerCase().includes(fullName)) {
                            equipmentDetails = eq;
                            fs.appendFileSync(debugLogPath, `Found partial match for "${item.description}": ${eq.brand} ${eq.model}\n`);
                            break;
                        }
                    }
                }
                
                if (equipmentDetails) {
                    fs.appendFileSync(debugLogPath, `Found equipment details for "${item.description}"\n`);
                    return {
                        ...item,
                        ...equipmentDetails,
                        notFound: false
                    };
                } else {
                    fs.appendFileSync(debugLogPath, `Equipment details not found for "${item.description}"\n`);
                    return {
                        ...item,
                        notFound: true
                    };
                }
            } catch (error) {
                fs.appendFileSync(debugLogPath, `Error processing equipment item "${item.description}": ${error.message}\n`);
                return {
                    ...item,
                    error: error.message,
                    unparseable: true
                };
            }
        }));
        
        fs.appendFileSync(debugLogPath, `Successfully expanded ${expandedItems.length} equipment items\n`);
        return expandedItems;
    } catch (error) {
        fs.appendFileSync(debugLogPath, `Error in parseAndExpandEquipmentList: ${error.message}\n${error.stack}\n`);
        throw error;
    }
}

/**
 * Generate or update a PDF for a specific show
 * @param {string} showId - The ID of the show
 * @returns {Promise<string>} - Path to the generated PDF
 */
async function generateShowPDF(showId) {
    try {
        console.log(`Generating PDF for show: ${showId}`);
        
        // Read the shows data
        const shows = await readCSVFile('shows.csv');
        
        // Find the show
        const show = shows.find(s => s.id === showId);
        if (!show) {
            throw new Error(`Show with ID ${showId} not found`);
        }
        
        // Get the show folder name (ID-Name format)
        const showName = show.name || '';
        const safeName = showName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const showFolderName = `${showId}-${safeName}`;
        const showFolderPath = path.join(SHOWS_DIR, showFolderName);
        
        // Ensure the show folder exists
        fs.ensureDirSync(showFolderPath);
        
        // Create output path
        const outputPath = path.join(showFolderPath, 'dsr.pdf');
        
        // Expand equipment list with detailed information
        if (show.equipmentList) {
            console.log(`Expanding equipment list: ${show.equipmentList}`);
            const expandedEquipment = await parseAndExpandEquipmentList(show.equipmentList);
            console.log(`Found ${expandedEquipment.length} equipment items:`, JSON.stringify(expandedEquipment, null, 2));
            
            show.expandedEquipmentList = expandedEquipment;
            
            // Create a formatted version for display
            show.formattedEquipmentList = expandedEquipment.map(item => {
                if (item.notFound || item.unparseable || item.error) {
                    return `${item.quantity || ''} ${item.description || ''}`;
                }
                
                const powerInfo = item.power ? ` - ${item.power}mW total` : '';
                const nohdInfo = item.nohd ? ` - NOHD: ${item.nohd}m` : '';
                const wavelengths = item.wavelengths && item.wavelengths.length > 0 
                    ? ` - Wavelengths: ${item.wavelengths.join(', ')}` 
                    : '';
                
                return `${item.quantity}x ${item.brand} ${item.model}${powerInfo}${nohdInfo}${wavelengths}`;
            }).join('\n');
            
            console.log(`Formatted equipment list: ${show.formattedEquipmentList}`);
        }
        
        // Get the template path
        const templatePath = path.join(TEMPLATES_DIR, 'dsr_template.pdf');
        
        // Generate PDF with form data from show
        await fillPDFForm(templatePath, outputPath, show);
        
        console.log(`Successfully generated PDF at ${outputPath}`);
        
        // Clear the PDF update flag if it exists
        await updateShowPDFFlag(showId, false);
        
        return outputPath;
    } catch (error) {
        console.error(`Error generating PDF for show ${showId}:`, error);
        throw error;
    }
}

/**
 * Fill out a PDF with data by replacing placeholders with actual text
 * @param {string} templatePath - Path to the PDF template
 * @param {string} outputPath - Path where to save the filled PDF
 * @param {object} formData - Key-value pairs for placeholders
 * @returns {Promise<string>} - Path to the generated PDF
 */
async function fillPDFForm(templatePath, outputPath, formData) {
    try {
        console.log(`Filling PDF: ${templatePath} -> ${outputPath}`);
        
        // Write to a debug file
        const debugLogPath = path.join(__dirname, 'equipment-debug.log');
        
        // Ensure the debug log file exists
        if (!fs.existsSync(debugLogPath)) {
            fs.writeFileSync(debugLogPath, '--- Equipment Debug Log ---\n');
        }
        
        fs.appendFileSync(debugLogPath, `\n${new Date().toISOString()} - Starting fillPDFForm\n`);
        fs.appendFileSync(debugLogPath, `Has equipmentList: ${Boolean(formData.equipmentList)}\n`);
        fs.appendFileSync(debugLogPath, `Has formattedEquipmentList: ${Boolean(formData.formattedEquipmentList)}\n`);
        
        // Process equipment list
        if (formData.equipmentList && !formData.formattedEquipmentList) {
            fs.appendFileSync(debugLogPath, `Processing equipment list directly in fillPDFForm: ${formData.equipmentList}\n`);
            
            try {
                const expandedEquipment = await parseAndExpandEquipmentList(formData.equipmentList);
                fs.appendFileSync(debugLogPath, `Got expandedEquipment with ${expandedEquipment.length} items\n`);
                
                // Create a formatted version for display
                formData.formattedEquipmentList = expandedEquipment.map(item => {
                    if (item.notFound || item.unparseable || item.error) {
                        return `${item.quantity || ''} ${item.description || ''}`;
                    }
                    
                    const powerInfo = item.power ? ` - ${item.power}mW total` : '';
                    const nohdInfo = item.nohd ? ` - NOHD: ${item.nohd}m` : '';
                    const wavelengths = item.wavelengths && item.wavelengths.length > 0 
                        ? ` - Wavelengths: ${item.wavelengths.join(', ')}` 
                        : '';
                    
                    return `${item.quantity}x ${item.brand} ${item.model}${powerInfo}${nohdInfo}${wavelengths}`;
                }).join('\n');
                
                fs.appendFileSync(debugLogPath, `Formatted equipment list: ${formData.formattedEquipmentList}\n`);
            } catch (error) {
                fs.appendFileSync(debugLogPath, `Error processing equipment list in fillPDFForm: ${error.message}\n${error.stack}\n`);
            }
        }
        
        // Load the PDF template
        const templateBytes = fs.readFileSync(templatePath);
        const pdfDoc = await PDFDocument.load(templateBytes);
        
        // Register fontkit
        pdfDoc.registerFontkit(fontkit);
        
        // Get the pages
        const pages = pdfDoc.getPages();
        
        // For the demo, we extract the actual data and use the provided coordinates from the template
        // These coordinates match where the placeholders are in the template
        
        // Page 1
        if (pages.length > 0) {
            const page1 = pages[0];
            const margin = 50;
            
            // Show Details
            if (formData.id) page1.drawText(formData.id, { x: margin + 100, y: page1.getHeight() - margin - 85, size: 10 });
            if (formData.name) page1.drawText(formData.name, { x: margin + 380, y: page1.getHeight() - margin - 85, size: 10 });
            if (formData.date) page1.drawText(formData.date, { x: margin + 100, y: page1.getHeight() - margin - 120, size: 10 });
            if (formData.status) page1.drawText(formData.status, { x: margin + 380, y: page1.getHeight() - margin - 120, size: 10 });
            if (formData.showTimes) page1.drawText(formData.showTimes, { x: margin + 100, y: page1.getHeight() - margin - 155, size: 10 });
            if (formData.venue) page1.drawText(formData.venue, { x: margin + 100, y: page1.getHeight() - margin - 190, size: 10 });
            if (formData.venuePhone) page1.drawText(formData.venuePhone, { x: margin + 380, y: page1.getHeight() - margin - 190, size: 10 });
            if (formData.venueAddress) page1.drawText(formData.venueAddress, { x: margin + 100, y: page1.getHeight() - margin - 225, size: 10 });
            
            // Yes/No fields - replace with Yes or No
            if (formData.venueConsulted) {
                const value = (formData.venueConsulted === true || formData.venueConsulted === 'true' || formData.venueConsulted === 'Yes') ? 'Yes' : 'No';
                page1.drawText(value, { x: margin + 100, y: page1.getHeight() - margin - 260, size: 10 });
            }
            
            if (formData.laserAreaSigned) {
                const value = (formData.laserAreaSigned === true || formData.laserAreaSigned === 'true' || formData.laserAreaSigned === 'Yes') ? 'Yes' : 'No';
                page1.drawText(value, { x: margin + 350, y: page1.getHeight() - margin - 260, size: 10 });
            }
            
            if (formData.venueConsultedNotes) page1.drawText(formData.venueConsultedNotes, { x: margin + 100, y: page1.getHeight() - margin - 295, size: 10 });
            
            // Client Information
            if (formData.client) page1.drawText(formData.client, { x: margin + 100, y: page1.getHeight() - margin - 355, size: 10 });
            if (formData.clientEmail) page1.drawText(formData.clientEmail, { x: margin + 100, y: page1.getHeight() - margin - 390, size: 10 });
            if (formData.clientPhone) page1.drawText(formData.clientPhone, { x: margin + 380, y: page1.getHeight() - margin - 390, size: 10 });
            
            // LSO Information
            if (formData.lsoName) page1.drawText(formData.lsoName, { x: margin + 100, y: page1.getHeight() - margin - 465, size: 10 });
            if (formData.lsoContact) page1.drawText(formData.lsoContact, { x: margin + 100, y: page1.getHeight() - margin - 500, size: 10 });
            if (formData.lsoEmail) page1.drawText(formData.lsoEmail, { x: margin + 100, y: page1.getHeight() - margin - 535, size: 10 });
            
            // Operator Information
            if (formData.operatorName) page1.drawText(formData.operatorName, { x: margin + 100, y: page1.getHeight() - margin - 595, size: 10 });
            if (formData.operatorContact) page1.drawText(formData.operatorContact, { x: margin + 100, y: page1.getHeight() - margin - 630, size: 10 });
            if (formData.crew) page1.drawText(formData.crew, { x: margin + 100, y: page1.getHeight() - margin - 665, size: 10 });
        }
        
        // Page 2
        if (pages.length > 1) {
            const page2 = pages[1];
            const margin = 50;
            
            // Safety Checklist
            if (formData.aviationNeeded) {
                const value = (formData.aviationNeeded === true || formData.aviationNeeded === 'true' || formData.aviationNeeded === 'Yes') ? 'Yes' : 'No';
                page2.drawText(value, { x: margin + 200, y: page2.getHeight() - margin - 95, size: 10 });
            }
            
            if (formData.notamIssued) {
                const value = (formData.notamIssued === true || formData.notamIssued === 'true' || formData.notamIssued === 'Yes') ? 'Yes' : 'No';
                page2.drawText(value, { x: margin + 200, y: page2.getHeight() - margin - 120, size: 10 });
            }
            
            // Equipment List - Use the formatted equipment list if available
            if (formData.formattedEquipmentList) {
                const equipmentText = formData.formattedEquipmentList;
                const lines = equipmentText.split('\n');
                
                for (let i = 0; i < Math.min(lines.length, 6); i++) {
                    page2.drawText(lines[i], { x: margin + 100, y: page2.getHeight() - margin - 445 - (i * 15), size: 9 });
                }
            } else if (formData.equipmentList) {
                page2.drawText(formData.equipmentList, { x: margin + 100, y: page2.getHeight() - margin - 445, size: 9 });
            }
        }
        
        // Save the filled PDF
        const pdfBytes = await pdfDoc.save();
        fs.writeFileSync(outputPath, pdfBytes);
        
        console.log(`PDF saved successfully to: ${outputPath}`);
        return outputPath;
    } catch (error) {
        console.error(`Error filling PDF form: ${error.message}`);
        throw error;
    }
}

/**
 * Update the PDF_needs_update flag for a show
 * @param {string} showId - The ID of the show
 * @param {boolean} needsUpdate - Whether the PDF needs updating
 * @returns {Promise<boolean>} - Success status
 */
async function updateShowPDFFlag(showId, needsUpdate) {
    try {
        const filePath = path.join(dataDir, 'shows.csv');
        
        // Read the CSV file content
        const csvContent = fs.readFileSync(filePath, 'utf8');
        
        // Parse the CSV content
        const rows = csvContent.split('\n');
        const headers = rows[0].split(',');
        
        // Find the pdf_needs_update column index
        let pdfFlagIndex = headers.indexOf('pdf_needs_update');
        const idIndex = headers.indexOf('id');
        
        // If pdf_needs_update column doesn't exist, add it
        if (pdfFlagIndex === -1) {
            headers.push('pdf_needs_update');
            pdfFlagIndex = headers.length - 1;
            rows[0] = headers.join(',');
        }
        
        // Update the show's pdf_needs_update value
        for (let i = 1; i < rows.length; i++) {
            if (rows[i].trim() === '') continue;
            
            const columns = rows[i].split(',');
            
            // Ensure we have enough columns for the pdf_needs_update field
            while (columns.length <= pdfFlagIndex) {
                columns.push('');
            }
            
            // If this is the row for our show
            if (columns[idIndex] === showId) {
                columns[pdfFlagIndex] = needsUpdate.toString();
                rows[i] = columns.join(',');
            }
        }
        
        // Write the updated CSV back to the file
        fs.writeFileSync(filePath, rows.join('\n'));
        
        console.log(`Updated pdf_needs_update flag to ${needsUpdate} for show ${showId}`);
        return true;
    } catch (error) {
        console.error(`Error updating show PDF flag: ${error.message}`);
        return false;
    }
}

/**
 * Check for shows needing PDF updates and process them
 * @returns {Promise<Array>} - Array of processed show IDs
 */
async function checkAndUpdatePDFs() {
    try {
        console.log('Checking for shows needing PDF updates...');
        
        // Read shows.csv
        const showsData = await readCSVFile('shows.csv');
        
        // Filter shows that need updates
        const showsToUpdate = showsData.filter(show => 
            show.pdf_needs_update === 'true' || 
            show.pdf_needs_update === true
        );
        
        console.log(`Found ${showsToUpdate.length} shows needing PDF updates`);
        
        // Process each show
        const updatedShows = [];
        
        for (const show of showsToUpdate) {
            console.log(`Updating PDF for show: ${show.id} - ${show.name}`);
            
            try {
                // Generate updated PDF
                const pdfPath = await generateShowPDF(show.id);
                
                // Mark as updated in CSV
                await updateShowPDFFlag(show.id, false);
                
                // Return relative path instead of absolute path
                const relativePath = pdfPath.replace(path.join(__dirname, '..'), '').replace(/\\/g, '/');
                
                updatedShows.push({
                    id: show.id,
                    name: show.name,
                    pdfPath: relativePath
                });
                
                console.log(`Successfully updated PDF for show: ${show.id}`);
            } catch (error) {
                console.error(`Error updating PDF for show ${show.id}:`, error);
            }
        }
        
        return updatedShows;
    } catch (error) {
        console.error('Error checking for PDF updates:', error);
        return [];
    }
}

module.exports = {
    fillPDFForm,
    generateShowPDF,
    updateShowPDFFlag,
    checkAndUpdatePDFs,
    readCSVFile
};