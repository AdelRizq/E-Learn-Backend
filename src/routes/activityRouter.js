const activityController = require("../controllers/activityController.js");

const router = require("express").Router();

// activity id as a param
router
    .route("/:id")
    .get(activityController.getActivity)
    .delete(activityController.deleteActivity);

router
    .route("/")
    .post(activityController.addActivity)
    .get(activityController.getActivities);

module.exports = router;
