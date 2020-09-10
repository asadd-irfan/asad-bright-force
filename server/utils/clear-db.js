const mongoose = require('mongoose');
const connectDB = require('../config/db');

// used to clear the dev DB
// for testing purposes
const clearDB = () => {
    // Connect to Database
    connectDB();
    // Drop Database
    try {
        const connection = mongoose.connection;
        connection.once('open', () => {
            mongoose.connection.db.dropDatabase(console.log(`MongoDB: ${connection.db.databaseName} was dropped...`));
        });
    } catch (error) {
        console.log(error.message);
    }
};

module.exports.clearDB = clearDB;
