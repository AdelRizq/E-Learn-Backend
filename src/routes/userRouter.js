const userController = require("../controllers/userController.js");
const auth = require("../auth/auth");

const router = require("express").Router();

router.route("/").get(auth.verifyToken, userController.getUsers);

router.route("/enrollMe").post(auth.verifyToken, userController.enrollMe);

router
    .route("/:id")
    .get(auth.verifyToken, userController.getUser)
    .put(auth.verifyToken, userController.updateUser)
    .delete(auth.verifyToken, userController.deleteUser);

router
    .route("/upgrade/:username")
    .put(auth.verifyToken, userController.upgradeLearner);


module.exports = router;
