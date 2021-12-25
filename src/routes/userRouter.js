const userController = require("../controllers/userController.js");

const router = require("express").Router();

router.get("/", userController.getUsers);

router
    .route("/:username")
    .get(userController.getUser)
    .put(userController.upgradeLearner)
    .delete(userController.deleteUser);

module.exports = router;
