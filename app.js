// Load environment variables from .env file
require('dotenv').config(); 
// Import required modules
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const expressLayout = require('express-ejs-layouts');
// Connect to the database and initialize GridFS
const connectdb = require('./server/config/db');
const path = require('path');
connectdb().then(() => {
    console.log('Database connected and GridFS initialized.');

    // app.use('/uploads/resumes', express.static(path.join(__dirname, 'uploads/resumes')));
    app.use(express.urlencoded({ extended: true }));
      // Middleware to parse JSON bodies
    app.use(express.json());
    // Middleware for EJS layouts
    app.use(expressLayout);
       // Middleware to serve static files from 'public' directory
    app.use(express.static('public'));
    app.set('layout', './layouts/main');
    // Set EJS layout file
    app.set('view engine', 'ejs');
     // Routes for the application
    app.use('/', require('./server/routes/main'));

    // Start the server and listen on the specified port
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
}).catch(err => {
    console.error('Failed to connect to the database:', err);
});
