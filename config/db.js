// Keeping database connection seperate to avoid cluttering server.js

const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

// Arrow function to connect to DB
const connectDB = async () => {
    // Try catch block for connection
    try {
        await mongoose.connect(db, {
            // Use new methods
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        // Exit process with failure
        process.exit(1);
    }
}

module.exports = connectDB;