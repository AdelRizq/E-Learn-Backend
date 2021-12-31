const httpStatus = require("http-status");

function verifyToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];

    if (typeof bearerHeader !== "undefined") {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];

        req.token = bearerToken;
        next();
    } else {
        return res.status(httpStatus.FORBIDDEN).send({
            message: "This operation is forbibden for you hehe hahhaha !",
        });
    }
}

module.exports = {
    verifyToken,
};
