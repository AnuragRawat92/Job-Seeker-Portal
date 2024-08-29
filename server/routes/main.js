const express = require('express');
const router = express.Router();
const Applicant = require('../models/Applicant');
const multer = require('multer');
const connectdb = require('../config/db');

// Configure multer for handling file uploads
const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage: storage }); // Create multer instance with storage configuration

let gfs; // Variable to hold GridFS instance

// Connect to the database and initialize GridFS
connectdb().then(db => {
    gfs = db; // Assign the connected database instance to gfs
}).catch(err => {
    console.error('Failed to initialize GridFS:', err); 
});

// Route for the home page
router.get('/', async (req, res) => {
    try {
        const locals = {
            title: "Job Seekers Portal", // Page title
            description: "Find your dream job" // Page description
        };
        res.render('portal/home', { locals }); 
    } catch (err) {
        console.log(err); // Log any errors
        res.status(500).send('Error loading home page.'); 
    }
});

// Route for handling applicant registration
router.post('/api/register', upload.single('resume'), async (req, res) => {
    try {
        // Extract form data from request body
        const { name, email, gender, institute, type, course, specialization, graduationYear, github, linkedin } = req.body;

        // Prepare resume data if file is uploaded
        const resumeData = req.file ? {
            filename: req.file.originalname,
            data: req.file.buffer,
            contentType: req.file.mimetype
        } : {};

        // Create applicant data object
        const applicantData = {
            name: name,
            email: email,
            gender: gender,
            institute: institute,
            type: type,
            course: course,
            specialization: specialization,
            graduationYear: graduationYear,
            githubId: github,
            linkedinId: linkedin,
            resume: resumeData
        };

        // Create a new applicant and save to the database
        const applicant = new Applicant(applicantData);
        await applicant.save();

        // Render the submission success page
        res.render('portal/submit', {
            message: "Your application has been submitted successfully."
        });
    } catch (error) {
        console.error('Error during form submission:', error); 
        res.status(400).send({ error: error.message }); 
    }
});

// Route for reviewing an applicant's details
router.get('/review/:id', async (req, res) => {
    try {
        const applicantId = req.params.id; // Get applicant ID from URL parameters
        const applicant = await Applicant.findById(applicantId); // Find applicant by ID

        if (applicant) {
            res.render('portal/review', { applicants: [applicant] }); // Render review page with applicant data
        } else {
            res.status(404).send('Applicant not found'); 
        }
    } catch (error) {
        console.error('Error retrieving applicant data:', error); // Log errors during data retrieval
        res.status(500).send('Error retrieving applicant data.'); 
    }
});

// Route for serving applicant's resume
router.get('/resume/:id', async (req, res) => {
    try {
        const applicantId = req.params.id; // Get applicant ID from URL parameters
        const applicant = await Applicant.findById(applicantId); 

        if (applicant && applicant.resume.data) {
            res.contentType(applicant.resume.contentType); // Set content type for resume file
            res.send(applicant.resume.data); 
        } else {
            res.status(404).send('Resume not found.'); // Handle case where resume is not found
        }
    } catch (error) {
        console.error('Error retrieving resume:', error); // Log errors during resume retrieval
        res.status(500).send('Error retrieving resume.');
    }
});

// Route for displaying login page
router.get('/login', (req, res) => {
    res.render('portal/login'); // Render login page
});

// Route for handling login form submission
router.post('/login', async (req, res) => {
    try {
        const { name, email } = req.body; // Extract login details from request body
        const applicant = await Applicant.findOne({ name, email }); // Find applicant by name and email

        if (applicant) {
            res.redirect(`/review/${applicant._id}`); // Redirect to review page for the applicant
        } else {
            res.render('portal/login', { error: 'Invalid name or email. Please try again.' }); // Render login page with error message
        }
    } catch (error) {
        console.error('Error during login:', error); // Log errors during login
        res.status(500).send('Server error'); // Send error response
    }
});

module.exports = router; // Export router to be used in other parts of the application
