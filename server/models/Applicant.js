const mongoose = require('mongoose');
// Define the schema for the Applicant model
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
// Create and export the Applicant model based on the schema
module.exports = mongoose.model('Applicant', applicantSchema);
