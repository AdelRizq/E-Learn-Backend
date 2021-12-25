const httpStatus = require("http-status");
const uuid = require("uuid");
const { userCourses } = require("../models");
const db = require("../models");

const Course = db.courses;

// 1. Add Course
const addCourse = async (req, res) => {
    const info = {
        // _id: uuid.v4(),
        name: req.body.name,
        syllabus: req.body.syllabus,
        instructorId: req.body.instructor, // TODO: from body or get it from session (instructor will create the course himself)
    };

    const course = await Course.create(info);
    res.status(httpStatus.OK).send(course);
    console.log(course);
};

// 2. Get Courses
const getCourse = async (req, res) => {
    const course = await Course.findOne({
        where: { _id: req.params.id },
    });

    if (course) res.status(httpStatus.OK).send(course);
    else res.status(httpStatus.NOT_FOUND).send("Course Not Found");
    console.log(course);
};

const getCourses = async (req, res) => {
    const courses = await Course.findAll({
        attributes: ["name", "syllabus", "instructorId"],
    });

    if (courses) res.status(httpStatus.OK).send(courses);
    else res.status(httpStatus.NO_CONTENT).send("No Courses Found");
};

const enrollLearners = async (req, res) => {
    const learners = req.body.learners; // ! learners are array of ids
    let courseId = req.body.id;

    // TODO: need test
    await userCourses.bulkCreate(
        learners.map((learner) => {
            return { userId: learner, courseId: courseId };
        })
    );

    res.status(httpStatus.OK).send("learners enrolled successfully");
};

// 3. Delete Course
const deleteCourse = async (req, res) => {
    await Course.destroy({ where: { id: req.params.id } });
    res.status(httpStatus.OK).send("Course Deleted Successfully");
};

module.exports = {
    addCourse,
    getCourse,
    getCourses,
    enrollLearners,
    deleteCourse,
};
