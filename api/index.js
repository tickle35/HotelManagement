const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');  // Import the cors package
const { createDatabaseIfNotExists, createTablesIfNotExist } = require('./config/database');
const staffRoutes = require('./routes/staffRoutes'); // Include routes for staff
const guestRoutes = require('./routes/guestRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const app = express();

// Middleware
app.use(cors());  // Enable CORS for all requests
app.use(express.json());

// Initialize database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // Replace with your database username
    password: 'emma1234',  // Replace with your database password
    database: 'hotel'  // Database name
});

// Check and create database if not exists
createDatabaseIfNotExists(db);

// Create tables if not exists
createTablesIfNotExist(db);

// Use staff routes
app.use('/api/staff', staffRoutes);
app.use('/api/guest', guestRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/dashboards', dashboardRoutes);

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
