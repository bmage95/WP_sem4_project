const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = 3008;

// Read recipe data from JSON file
function readRecipeData() {
  const recipeFilePath = path.join(__dirname, 'recipe.json');
  try {
    const data = fs.readFileSync(recipeFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading recipe data from file:', error);
    return [];
  }
}

const server = http.createServer((req, res) => {
  if (req.url === '/random' && req.method === 'GET') {
    // Serve a random recipe
    const recipes = readRecipeData();
    const randomIndex = Math.floor(Math.random() * recipes.length);
    const randomRecipe = recipes[randomIndex];
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(randomRecipe));
  } else if (req.url === '/today.html' && req.method === 'GET') {
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
  } else {
    // Serve the main.html file for any other request
    const filePath = path.join(__dirname, 'main.html');
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
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
