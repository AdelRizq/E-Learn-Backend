const courseController = require("../controllers/courseController.js");

const router = require("express").Router();

router
    .route("/:id")
    .get(courseController.getCourse)
    .put(courseController.enrollLearner)
    .delete(courseController.deleteCourse);

router
    .route("/")
    .post(courseController.addCourse)
    .get(courseController.getCourses);

module.exports = router;
