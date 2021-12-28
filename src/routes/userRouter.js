const userController = require("../controllers/userController.js");
const auth = require("../auth/auth");
const router = require("express").Router();

router
    .route("/")
    .get(auth.verifyToken, userController.getUsers);

router
    .route("/me")
    .get(auth.verifyToken, userController.getUser)

router
    .route("/:username")
    .put(auth.verifyToken, userController.upgradeLearner)
    .delete(auth.verifyToken, userController.deleteUser);

router
    .route("/:id/enrollMe")
    .post(auth.verifyToken, userController.enrollMe);

module.exports = router;