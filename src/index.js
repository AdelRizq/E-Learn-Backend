const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.port || 4000;

let corsOptions = {
    origin: "*",
};

// ^ Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

// ^ Routers
const router = require("./routes");
app.use("/api", router);

// ^ Routes
app.get("/", (req, res) => {
    res.json({
        works: "fine",
    });
});

// ^ Errors
app.use(function (err, req, res, next) {
    return res.status(422).send({
        error: err.message,
    });
});

// ^ Listen to requests
app.listen(PORT, function () {
    console.log(`Listening on port: ${PORT}`);
});
