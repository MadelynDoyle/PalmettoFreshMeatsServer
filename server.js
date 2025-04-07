// server.js
const express = require('express');
const cors = require('cors');
const app = express();

// Load JSON data
const beef = require('./data/beef.json');
const pork = require('./data/pork.json');

app.use(cors());
app.use(express.static('public')); // for serving index.html

// Routes
app.get('/api/beef', (req, res) => {
  res.json(beef);
});

app.get('/api/pork', (req, res) => {
  res.json(pork);
});

// Home route with a simple API list
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

