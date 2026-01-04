const mongoose = require('mongoose');

// Replace <connection string> with your Atlas connection string
const uri = '<connection string>';

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Connected to MongoDB Atlas with Mongoose!');
    })
    .catch(err => {
        console.error('Connection error:', err);
    });
