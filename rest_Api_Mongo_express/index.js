const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// setup  express app 
const app = express();

// connect to db 
mongoose.connect('mongodb://localhost/ninjago');
mongoose.Promise = global.Promise;

app.use(bodyParser.json());

// routes 
app.use('/api', require('./routes/api'));

// Errors
app.use(function(err, req, res, next) {
    res.status(422).send({
        error: err.message
    });
});

// listen to requests
app.listen(process.env.port || 4000, function() {
    console.log('now listing to requests');
});