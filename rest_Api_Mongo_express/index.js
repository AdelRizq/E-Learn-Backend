const cors = require('cors')
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.port || 4000

let corsOptions = {
    origin: 'https://localhost:4001'
}

app.use(cors(corsOptions))
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }))

// routes 
app.get('/', (req, res) => {
    res.json({"works": "fine"})
})

// Errors
app.use(function(err, req, res, next) {
    res.status(422).send({
        error: err.message
    });
});

// listen to requests
app.listen(PORT, function() {
    console.log(`Listening on port: ${PORT}`);
});