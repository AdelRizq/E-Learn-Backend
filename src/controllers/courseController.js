const uuid = require("uuid");
const db = require("../models");

const Course = db.courses;

// 1. Add Course
const addCourse = async (req, res) => {
    const info = {
        // _id: uuid.v4(),
        name: req.body.name,
        instructor: req.body.instructor,
        syllabus: req.body.syllabus,
        learners: req.body.learners || [], // get learners with these usernames
        activities: req.body.activities || [],
    };

    const course = await Course.create(info);
    res.status(200).send(course);
    console.log(course);
};

// 2. Get Courses
const getCourse = async (req, res) => {
    const course = await Course.findOne({
        where: { id: req.params.id },
    });
    res.status(200).send(course);
    console.log(course);
};

const getCourses = async (req, res) => {
    // TODO: do we store instructor ID or username
    const courses = await Course.findAll({
        attributes: ["name", "instructor", "syllabus"],
    });
    res.status(200).send(courses);
};

const enrollLearner = async (req, res) => {
    let username = req.body.username;
    let courseId = req.body.id;

    // TODO: get user with his username or id
    // TODO: update the courseLearners with this user

    res.status(200).send(course);
    console.log(course);
};

// 3. Delete Course
const deleteCourse = async (req, res) => {
    await Course.destroy({ where: { id: req.body.id } });
    res.status(200).send("Course Deleted Successfully");
};

module.exports = {
    addCourse,
    getCourse,
    getCourses,
    enrollLearner,
    deleteCourse,
};
