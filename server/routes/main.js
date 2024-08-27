const express = require('express');
const router = express.Router();
const Applicant = require('../models/Applicant');
const multer = require('multer');
const connectdb = require('../config/db');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
let gfs;
connectdb().then(db => {
    gfs = db;
}).catch(err => {
    console.error('Failed to initialize GridFS:', err);
});
router.get('/', async (req, res) => {
    try {
        const locals = {
            title: "Job Seekers Portal",
            description: "Find your dream job"
        };
        res.render('portal/home', { locals });
    } catch (err) {
        console.log(err);
        res.status(500).send('Error loading home page.');
    }
});

router.post('/api/register', upload.single('resume'), async (req, res) => {
    try {
        const { name, email, gender, institute, type, course, specialization, graduationYear, github, linkedin } = req.body;

        const resumeData = req.file ? {
            filename: req.file.originalname,
            data: req.file.buffer,
            contentType: req.file.mimetype
        } : {};

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

        const applicant = new Applicant(applicantData);
        await applicant.save();

        res.render('portal/submit', {
            message: "Your application has been submitted successfully."
        });
    } catch (error) {
        console.error('Error during form submission:', error);
        res.status(400).send({ error: error.message });
    }
});
router.get('/review/:id', async (req, res) => {
    try {
        const applicantId = req.params.id;
        const applicant = await Applicant.findById(applicantId);

        if (applicant) {
            res.render('portal/review', { applicants: [applicant] });
        } else {
            res.status(404).send('Applicant not found');
        }
    } catch (error) {
        console.error('Error retrieving applicant data:', error);
        res.status(500).send('Error retrieving applicant data.');
    }
});
router.get('/resume/:id', async (req, res) => {
    try {
        const applicantId = req.params.id;
        const applicant = await Applicant.findById(applicantId);

        if (applicant && applicant.resume.data) {
            res.contentType(applicant.resume.contentType);
            res.send(applicant.resume.data);
        } else {
            res.status(404).send('Resume not found.');
        }
    } catch (error) {
        console.error('Error retrieving resume:', error);
        res.status(500).send('Error retrieving resume.');
    }
});
router.get('/login', (req, res) => {
    res.render('portal/login');
});
router.post('/login', async (req, res) => {
    try {
        const { name, email } = req.body;
        const applicant = await Applicant.findOne({ name, email });

        if (applicant) {
            res.redirect(`/review/${applicant._id}`);
        } else {
            res.render('portal/login', { error: 'Invalid name or email. Please try again.' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;