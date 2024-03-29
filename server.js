const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;
const recipeFilePath = path.join(__dirname, 'recipe.json');

// Function to read data from JSON file
function readDataFromFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data from file:', error);
    return [];
  }
}

// Create a basic HTTP server
const server = http.createServer((req, res) => {
  if (req.url === '/random' && req.method === 'GET') {
    // Read data from recipe file, select a random recipe, and send as response
    const recipes = readDataFromFile(recipeFilePath);
    const randomIndex = Math.floor(Math.random() * recipes.length);
    const randomRecipe = recipes[randomIndex];
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(randomRecipe));
  } 
  else if (req.url === '/today.html' && req.method === 'GET') {
    // Serve the today.html file
    const filePath = path.join(__dirname, 'today.html');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File not found');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } 
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
