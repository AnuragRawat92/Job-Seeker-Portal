const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

let gfs;

const connectdb = async () => {
    try {
        mongoose.set('strictQuery', false);
        const mongoUri = process.env.MONGODB_URL;

        if (!mongoUri) {
            throw new Error('MONGODB_URL is not defined in .env file');
        }

        const conn = await mongoose.connect(mongoUri, {
            
        });

        console.log(`Connection successful: ${conn.connection.host}`);

        
        gfs = Grid(conn.connection.db, mongoose.mongo);
        gfs.collection('resumes'); 
        return conn.connection.db; 
    } catch (err) {
        console.error('Database connection error:', err);
        process.exit(1); 
    }
};

module.exports = connectdb;