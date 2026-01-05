const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URL;


mongoose.connect(uri)
    .then(() => {
        console.log('Connected to MongoDB Atlas with Mongoose!');
    })
    .catch(err => {
        console.error('Connection error:', err);
        console.error('Possible causes: IP not whitelisted in MongoDB Atlas, incorrect password, or network issues.');
    });


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB Atlas with Mongoose!');
});

module.exports = db;