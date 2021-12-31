const auth = require("../auth/auth");
const router = require("express").Router();

const activityController = require("../controllers/activityController.js");

router
    .route("/:courseId")
    .get(auth.verifyToken, activityController.getActivities)
    .post(auth.verifyToken, activityController.addActivity);

router
    .route("/:id")
    .delete(auth.verifyToken, activityController.deleteActivity);

module.exports = router;
