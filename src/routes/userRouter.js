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
    .route("/:username/addCourse")
    .put(auth.verifyToken, userController.addCourse);

module.exports = router;