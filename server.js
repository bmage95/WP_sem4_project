const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const dataFilePath = path.join(__dirname, 'data.json');

// Function to read data from JSON file
function readDataFromFile() {
  try {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data from file:', error);
    return [];
  }
}

// Function to write data to JSON file
function writeDataToFile(data) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    console.log('Data written to file successfully');
  } catch (error) {
    console.error('Error writing data to file:', error);
  }
}

// Create a basic HTTP server
const server = http.createServer((req, res) => {
  if (req.url === '/data' && req.method === 'GET') {
    // Read data from file and send as response
    const jsonData = readDataFromFile();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(jsonData));
  } else if (req.url === '/data' && req.method === 'POST') {
    // Receive data from client, append to file, and send back updated data
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString(); // convert Buffer to string
    });
    req.on('end', () => {
      const newData = JSON.parse(body);
      const currentData = readDataFromFile();
      currentData.push(newData);
      writeDataToFile(currentData);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(currentData));
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
