const httpStatus = require("http-status");
const jwt = require("jsonwebtoken");
const config = require("./../config/jwt.config")
const uuid = require("uuid");
const {
    userCourses
} = require("../models");
const db = require("../models");
const {
    use
} = require("../routes");

const Course = db.courses;
const User = db.users;


// 1. Add Course
// instructor or admin accounts 
const addCourse = async(req, res) => {

    jwt.verify(req.token, config.SECRET_KEY, async(err, authData) => {
        if (err) {
            res.status(httpStatus.UNAUTHORIZED).send({
                message: err.message
            });
        } else {
            const user = await User.findOne({
                where: {
                    username: authData.username
                },
            });
            console.log(user);
            if (user) {
                if (user.type == 'admin' || user.type == 'instructor') {
                    // Do Your function 

                    const info = {
                        name: req.body.name,
                        syllabus: req.body.syllabus,
                        instructorId: user._id, // TODO: from body or get it from session (instructor will create the course himself)
                    };
                    try {
                        const course = await Course.create(info);
                        res.status(httpStatus.OK).send(course);
                    } catch (error) {
                        console.log(error.sqlMessage);
                        res.status(httpStatus.FORBIDDEN).send({
                            message: "Duplicate course name"
                        });
                    }


                } else {
                    res.status(httpStatus.UNAUTHORIZED).send({
                        message: "you must be an admin or instructor to do this operation "
                    });
                }

            } else {
                res.status(httpStatus.NOT_FOUND).send({
                    message: "user Not Found"
                });
            }
        }
    });

};

// 2. Get Courses
// any authrized user  
const getCourse = async(req, res) => {
    jwt.verify(req.token, config.SECRET_KEY, async(err, authData) => {
        if (err) {
            res.status(httpStatus.UNAUTHORIZED).send({
                message: err.message
            });
        } else {

            const course = await Course.findOne({
                where: {
                    _id: req.params.id
                },
            });

            if (course) {
                res.status(httpStatus.OK).send(course);
            } else {
                res.status(httpStatus.NOT_FOUND).send({
                    message: "Course Not Found"
                });
            }

        }
    });

};

// any authrized user  
const getCourses = async(req, res) => {
    jwt.verify(req.token, config.SECRET_KEY, async(err, authData) => {
        if (err) {
            res.status(httpStatus.UNAUTHORIZED).send({
                message: err.message
            });
        } else {

            const courses = await Course.findAll({
                attributes: ["name", "syllabus", "instructorId"],
            });
            if (courses) {
                {
                    res.status(httpStatus.OK).send(courses);
                }
            } else {
                {
                    res.status(httpStatus.NO_CONTENT).send({
                        message: "No Courses Found"
                    });
                }
            }
        }
    });
};

const enrollLearners = async(req, res) => {
    const learners = req.body.learners; // ! learners are array of ids [ids] 
    let courseId = req.params.id;


    // TODO: need test
    await userCourses.bulkCreate(
        learners.map((learner) => {
            return {
                userId: learner,
                courseId: courseId
            };
        })
    );

    res.status(httpStatus.OK).send("learners enrolled successfully");
};

// 3. Delete Course
const deleteCourse = async(req, res) => {


    jwt.verify(req.token, config.SECRET_KEY, async(err, authData) => {
        if (err) {

            res.status(httpStatus.UNAUTHORIZED).send({
                message: err.message
            });
        } else {
            const user = await User.findOne({
                where: {
                    username: authData.username
                },
            });
            const course = await Course.findOne({
                where: {
                    _id: req.params.id
                },
            });

            if (user && course) {
                if (user.type == 'admin' || user._id == course.instructorId) {
                    // Do Your function 
                    try {
                        await Course.destroy({
                            where: {
                                _id: req.params.id
                            }
                        });
                        res.status(httpStatus.OK).send({
                            message: "Course Deleted Successfully"
                        });
                    } catch (error) {
                        res.status(httpStatus.FORBIDDEN).send({
                            message: "error during deletion"
                        });
                    }

                } else {
                    res.status(httpStatus.UNAUTHORIZED).send({
                        message: "you must be an admin  or instructor this course to do this operation "
                    });
                }

            } else {
                res.status(httpStatus.NOT_FOUND).send({
                    message: "course Not Found"
                });
            }
        }
    });
};

module.exports = {
    addCourse,
    getCourse,
    getCourses,
    enrollLearners,
    deleteCourse,
};