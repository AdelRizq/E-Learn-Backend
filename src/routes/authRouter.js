const userController = require("../controllers/userController.js");

const router = require("express").Router();

router.post("/login", userController.login);
router.post("/signup", userController.signup);
router.post("/forgot", userController.forgotPassword);
router.post("/reset", userController.resetPassword);

module.exports = router;


/** 
 * localhost:4000/api/signup
 */