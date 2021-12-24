const userController = require("../controllers/userController.js");

const router = require("express").Router();

router.post("/login", userController.login);
router.post("/signup", userController.signup);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);

router.get("/users", userController.getUsers);
router.put("/upgrade-user", userController.upgradeUser);

router.get("/:username", userController.getUser);
router.delete("/delete-user", userController.deleteUser);

module.exports = router;
