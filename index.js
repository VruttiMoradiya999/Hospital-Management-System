const express = require('express');
const path = require('path');
const app = require('./backend/server');

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Temporary seed route (Delete this after use!)
app.get('/api/seed', async (req, res) => {
  try {
    const User = require('./backend/models/User');
    const bcrypt = require('bcryptjs');

    // Create Admin User
    const hashedPassword = await bcrypt.hash('password', 10);
    
    // Upsert Admin
    await User.findOneAndUpdate(
      { email: 'admin@hospital.com' },
      { name: 'Admin User', password: hashedPassword, role: 'admin' },
      { upsert: true }
    );

    // Upsert Doctor
    await User.findOneAndUpdate(
      { email: 'doctor@hospital.com' },
      { name: 'Dr. Smith', password: hashedPassword, role: 'doctor' },
      { upsert: true }
    );

    // Upsert Nurse
    await User.findOneAndUpdate(
      { email: 'nurse@hospital.com' },
      { name: 'Nurse Joy', password: hashedPassword, role: 'nurse' },
      { upsert: true }
    );

    res.send('<h1>Database Seeded Successfully!</h1><p>Accounts Created: Admin, Doctor, and Nurse. (Password: password)</p>');
  } catch (error) {
    res.status(500).send('Error seeding database: ' + error.message);
  }
});

// The "catchall" handler
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).send('API route not found');
  }
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

module.exports = app;
