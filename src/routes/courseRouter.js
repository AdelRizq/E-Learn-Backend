const courseController = require("../controllers/courseController.js");
const auth = require("../auth/auth");

const router = require("express").Router();

router
.route("/")
.get(auth.verifyToken, courseController.getCourses)
.post(auth.verifyToken, courseController.addCourse);

router
    .route("/my-courses")
    .get(auth.verifyToken, courseController.getMyCourses);

router
.route("/top-courses")
.get(auth.verifyToken, courseController.getTopCourses);

router
    .route("/:id")
    .get(auth.verifyToken, courseController.getCourse)
    .post(auth.verifyToken, courseController.enrollLearner)
    .delete(auth.verifyToken, courseController.deleteCourse);

router
    .route("/:id/questions")
    .get(auth.verifyToken, courseController.getQuestions)
    .post(auth.verifyToken, courseController.addQuestion);

router
    .route("/:id/answers")
    .get(auth.verifyToken, courseController.getAnswers)
    .post(auth.verifyToken, courseController.addAnswer);

module.exports = router;
