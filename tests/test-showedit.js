/**
 * Simple test script to test ShowEdit functionality
 * 
 * This script makes requests to the server to test basic functionality
 * like retrieving shows and venues.
 */
const http = require('http');

// Options for the shows request
const showsOptions = {
  hostname: 'localhost',
  port: 3001,
  path: '/data/shows.csv',
  method: 'GET'
};

// Options for the venues request
const venuesOptions = {
  hostname: 'localhost',
  port: 3001,
  path: '/data/venues.csv',
  method: 'GET'
};

// Options for the equipment request
const equipmentOptions = {
  hostname: 'localhost',
  port: 3001,
  path: '/data/equipment.csv',
  method: 'GET'
};

// Function to make a request and print the result
function makeRequest(options, description) {
  return new Promise((resolve, reject) => {
    console.log(`Testing: ${description}...`);
    
    const req = http.request(options, (res) => {
      let data = '';
      
      // Log the status code
      console.log(`Status: ${res.statusCode}`);
      
      // A chunk of data has been received
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      // The whole response has been received
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`✅ SUCCESS: ${description}`);
          resolve(data);
        } else {
          console.log(`❌ FAILED: ${description}`);
          reject(new Error(`Request failed with status code ${res.statusCode}`));
        }
      });
    });
    
    req.on('error', (error) => {
      console.error(`❌ ERROR: ${error.message}`);
      reject(error);
    });
    
    req.end();
  });
}

// Run all tests
async function runTests() {
  console.log('========================================');
  console.log('     Testing ShowEdit Functionality     ');
  console.log('========================================');
  
  try {
    // Test retrieving shows data
    const showsData = await makeRequest(showsOptions, 'Retrieving shows data');
    console.log(`Shows data length: ${showsData.length} bytes`);
    
    // Test retrieving venues data
    const venuesData = await makeRequest(venuesOptions, 'Retrieving venues data');
    console.log(`Venues data length: ${venuesData.length} bytes`);
    
    // Test retrieving equipment data
    const equipmentData = await makeRequest(equipmentOptions, 'Retrieving equipment data');
    console.log(`Equipment data length: ${equipmentData.length} bytes`);
    
    console.log('========================================');
    console.log('     All tests completed successfully!  ');
    console.log('========================================');
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// Run the tests
runTests(); 