const httpStatus = require("http-status");
const jwt = require("jsonwebtoken");

const db = require("../models");
const config = require("./../config/jwt.config");
const constants = require("./../config/constants.config");

const Activity = db.activities;
const User = db.users;

// 1. Add Activity
const addActivity = async (req, res) => {
    jwt.verify(req.token, config.SECRET_KEY, async (err, authData) => {
        if (err) {
            return res.status(httpStatus.UNAUTHORIZED).send({
                message: err.message,
            });
        } else {
            const user = await User.findOne({
                where: {
                    username: authData.username,
                },
            });

            if (user) {
                if (
                    user.type == constants.userType.ADMIN ||
                    user.type == constants.userType.INSTRUCTOR
                ) {
                    // Do Your function
                    const info = {
                        name: req.body.name,
                        type: req.body.type,
                        link: req.body.link,
                        courseId: req.params.courseId,
                    };
                    try {
                        const activity = await Activity.create(info);
                        return res.status(httpStatus.OK).send(activity);
                    } catch (error) {
                        return res.status(httpStatus.OK).send({
                            message: "bad information provided",
                        });
                    }
                } else {
                    return res.status(httpStatus.UNAUTHORIZED).send({
                        message:
                            "you must be an admin or instructor to do this operation ",
                    });
                }
            } else {
                return res.status(httpStatus.NOT_FOUND).send({
                    message: "user Not Found",
                });
            }
        }
    });
};

// 2. Get Activities
const getActivities = async (req, res) => {
    jwt.verify(req.token, config.SECRET_KEY, async (err, authData) => {
        if (err) {
            return res.status(httpStatus.UNAUTHORIZED).send({
                message: err.message,
            });
        } else {
            const user = await User.findOne({
                where: {
                    username: authData.username,
                },
            });

            if (user) {
                // Do your work
                try {
                    const activities = await Activity.findAll({
                        where: {
                            courseId: req.params.courseId,
                        },
                    });

                    if (activities) {
                        return res.status(httpStatus.OK).send(activities);
                    } else {
                        return res.status(httpStatus.NO_CONTENT).send({
                            message: "No Activities Found",
                        });
                    }
                } catch (error) {
                    return res.status(httpStatus.BAD_REQUEST).send({
                        message: "invalid information provieded",
                    });
                }
            } else {
                return res.status(httpStatus.NOT_FOUND).send({
                    message: "user Not Found",
                });
            }
        }
    });
};

// 3. Delete Activity
const deleteActivity = async (req, res) => {
    jwt.verify(req.token, config.SECRET_KEY, async (err, authData) => {
        if (err) {
            return res.status(httpStatus.UNAUTHORIZED).send({
                message: err.message,
            });
        } else {
            const user = await User.findOne({
                where: {
                    username: authData.username,
                },
            });
            const activity = await Activity.findOne({
                where: {
                    _id: req.params.id,
                },
            });

            if (user && activity) {
                if (
                    user.type == constants.userType.ADMIN ||
                    user.type == constants.userType.INSTRUCTOR
                ) {
                    // Do Your function
                    try {
                        await Activity.destroy({
                            where: {
                                _id: req.params.id,
                            },
                        });
                        return res.status(httpStatus.OK).send({
                            message: "Activity Deleted Successfully",
                        });
                    } catch (error) {
                        return res.status(httpStatus.FORBIDDEN).send({
                            message: "error during deletaion",
                        });
                    }
                } else {
                    return res.status(httpStatus.UNAUTHORIZED).send({
                        message:
                            "you must be an admin or instructor to do this operation ",
                    });
                }
            } else {
                return res.status(httpStatus.NOT_FOUND).send({
                    message: "activity Not Found",
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
