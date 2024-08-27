const mongoose = require('mongoose');

const applicantSchema = new mongoose.Schema({
    name: String,
    email: String,
    gender: String,
    institute: String,
    type: String,
    course: String,
    specialization: String,
    graduationYear: String,
    githubId: String,
    linkedinId: String,
    resume: {
        data: Buffer,
        contentType: String
    }
});

module.exports = mongoose.model('Applicant', applicantSchema);