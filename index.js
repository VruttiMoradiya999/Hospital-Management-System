const express = require('express');
const path = require('path');
const app = require('./backend/server');

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// The "catchall" handler
app.get('/:path*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).send('API route not found');
  }
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

module.exports = app;
