const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = 3012;

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
    } else if (req.url === '/add' && req.method === 'POST') {
        // Handle recipe addition
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // convert Buffer to string
        });
        req.on('end', () => {
            const newRecipe = JSON.parse(body);
            const recipes = readRecipeData();
            recipes.push(newRecipe);
            fs.writeFileSync(path.join(__dirname, 'recipe.json'), JSON.stringify(recipes, null, 2), 'utf8');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Recipe added successfully' }));
        });
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
    } else if (req.url === '/about.html' && req.method === 'GET') {
        // Check if already at /about.html, if not, redirect
        if (req.url !== '/about.html') {
            res.writeHead(301, { 'Location': '/about.html' });
            res.end();
        } else {
            // Serve the about.html file
            const filePath = path.join(__dirname, 'about.html');
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
    } else if (req.url === '/add.html' && req.method === 'GET') {
        // Serve the add.html file
        const filePath = path.join(__dirname, 'add.html');
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
