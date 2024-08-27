require('dotenv').config(); 

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const expressLayout = require('express-ejs-layouts');
const connectdb = require('./server/config/db');
const path = require('path');
connectdb().then(() => {
    console.log('Database connected and GridFS initialized.');

    // app.use('/uploads/resumes', express.static(path.join(__dirname, 'uploads/resumes')));
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(expressLayout);
    app.use(express.static('public'));
    app.set('layout', './layouts/main');
    app.set('view engine', 'ejs');
    app.use('/', require('./server/routes/main'));

    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
}).catch(err => {
    console.error('Failed to connect to the database:', err);
});