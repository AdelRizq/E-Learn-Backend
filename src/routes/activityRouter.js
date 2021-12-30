const activityController = require("../controllers/activityController.js");
const auth = require("../auth/auth");
const router = require("express").Router();

// activity id as a param
router
    .route("/:id")
    .delete(auth.verifyToken, activityController.deleteActivity);
// .get(activityController.getActivity)

router
    .route("/:courseId")
    .get(auth.verifyToken, activityController.getActivities)
    .post(auth.verifyToken, activityController.addActivity);

module.exports = router;