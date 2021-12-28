const courseController = require("../controllers/courseController.js");
const auth = require("../auth/auth");

const router = require("express").Router();

router
    .route("/:id")
    .get(auth.verifyToken, courseController.getCourse)
    .put(auth.verifyToken, courseController.enrollLearners)
    .delete(auth.verifyToken, courseController.deleteCourse);

router
    .route("/")
    .get(auth.verifyToken, courseController.getCourses)
    .post(auth.verifyToken, courseController.addCourse);

module.exports = router;