const httpStatus = require("http-status");
const jwt = require("jsonwebtoken");
const config = require("./../config/jwt.config")
const uuid = require("uuid");
const db = require("../models");

const Activity = db.activities;
const Course = db.courses;
const User = db.users;

// 1. Add Activity
const addActivity = async(req, res) => {

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

            if (user) {
                if (user.type == 'admin' || user.type == 'instructor') {
                    // Do Your function 
                    const info = {
                        name: req.body.name,
                        type: req.body.type,
                        link: req.body.link,
                        courseId: req.params.courseId,
                    };
                    try {
                        const activity = await Activity.create(info);
                        res.status(httpStatus.OK).send(activity);

                    } catch (error) {
                        console.log(error);
                        res.status(httpStatus.OK).send({
                            message: "bad information provided"
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

// 2. Get Activities
const getActivities = async(req, res) => {
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

            if (user) {
                // Do your work
                try {

                    const activities = await Activity.findAll({
                        where: {
                            courseId: req.params.courseId
                        },
                    });

                    if (activities) {
                        res.status(httpStatus.OK).send(activities);
                    } else {
                        res.status(httpStatus.NO_CONTENT).send({
                            message: "No Activities Found"
                        });
                    }
                } catch (error) {
                    res.status(httpStatus.BAD_REQUEST).send({
                        message: "invalid information provieded"
                    })
                }

            } else {
                res.status(httpStatus.NOT_FOUND).send({
                    message: "user Not Found"
                });
            }
        }
    });
};

// const getActivity = async(req, res) => {
//     const activity = await Activity.findOne({
//         where: {
//             id: req.params.id
//         },
//     });

//     if (activity) res.status(httpStatus.OK).send(activity);
//     else res.status(httpStatus.NOT_FOUND).send("Course Not Found");
// };

// 3. Delete Activity
const deleteActivity = async(req, res) => {
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
            const activity = await Activity.findOne({
                where: {
                    _id: req.params.id
                },
            });

            if (user && activity) {
                if (user.type == 'admin' || user.type == 'instructor') {
                    // Do Your function 
                    try {

                        await Activity.destroy({
                            where: {
                                _id: req.params.id
                            }
                        });
                        res.status(httpStatus.OK).send({
                            message: "Activity Deleted Successfully"
                        });
                    } catch (error) {
                        res.status(httpStatus.FORBIDDEN).send({
                            message: "error during deletaion"
                        });

                    }

                } else {
                    res.status(httpStatus.UNAUTHORIZED).send({
                        message: "you must be an admin or instructor to do this operation "
                    });
                }

            } else {
                res.status(httpStatus.NOT_FOUND).send({
                    message: "activity Not Found"
                });
            }
        }
    });

};


module.exports = {
    addActivity,
    getActivities,
    deleteActivity,
};