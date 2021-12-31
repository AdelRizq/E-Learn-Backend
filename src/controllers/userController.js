const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const config = require("./../config/jwt.config")
const {
    courses
} = require("../models");
const httpStatus = require("http-status");
const db = require("../models");
const {
    use
} = require("../routes");

const User = db.users;
const UserCourses = db.userCourses;
const constants = require('../config/constants.config');
const {
    where
} = require("sequelize/dist");
const nodemailer = require('nodemailer');
// 1. Authentication


const signup = async(req, res) => {
    const info = {
        // _id: uuid.v4(),
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        birthDate: req.body.birthDate,
        coursesIds: req.body.coursesIds || [],
        type: req.body.type,
    };

    try {
        let user = await User.create(info);
        const userData = {
            _id: user._id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            birthDate: user.birthDate,
            coursesIds: user.coursesIds || [],
            type: user.type,
        }
        info._id = user._id;
        res.status(httpStatus.CREATED).send({
            token: jwt.sign(userData, config.SECRET_KEY, {
                expiresIn: config.JWT_EXPIRES_IN
            }),
            userData: userData
        });
    } catch (error) {
        res.status(httpStatus.BAD_REQUEST).send({
            message: "The server could not understand the request due to invalid syntax."
        });
        console.log(error);

    }
};

const login = async(req, res) => {

    const user = await User.findOne({
        where: {
            email: req.body.email,
            password: req.body.password
        },
    });

    if (user) {
        const userData = {
            _id: user._id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            birthDate: user.birthDate,
            coursesIds: user.coursesIds || [],
            type: user.type,
        };

        res.status(httpStatus.OK).send({
            token: jwt.sign(userData, config.SECRET_KEY, {
                expiresIn: config.JWT_EXPIRES_IN
            }),
            userData: userData
        });
    } else {
        res.status(httpStatus.UNAUTHORIZED).send({
            message: "error in auth information"
        });
    }
};


// TODO: Add send Mail 
const forgotPassword = async(req, res) => {

    const user = await User.findOne({
        where: {
            email: req.body.email
        }
    });
    const userData = {
        email: req.body.email
    }
    const token = jwt.sign(userData, config.SECRET_KEY_RESET_PASSWORD, {
        expiresIn: config.JWT_EXPIRES_IN
    })

    if (user) {
        // password: 9_Dragon_Learners_9
        // dragonlerarners@gmail.com
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'dragonlerarners@gmail.com',
                pass: '9_Dragon_Learners_9'
            }
        });

        const mailOptions = {
            from: '9_Dragon_Learners_9',
            to: req.body.email,
            subject: 'Reset Password',
            html: `<h2>please click on the given link to reset your password<h2/>
                  <p>${constants.env.CLIENT_URL}/reset/${token}<p/>`
        };
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                res.status(httpStatus.OK).send({
                    message: "invalid email sent"
                });

            } else {
                res.status(httpStatus.OK).send({
                    message: "email sent"
                });
            }
        });
    } else res.status(httpStatus.UNAUTHORIZED).send({
        message: "Email Not Found"
    });
};

const resetPassword = async(req, res) => {

    try {
        const email = jwt.verify(req.body.token, config.SECRET_KEY_RESET_PASSWORD).email;


        const user = await User.update({
            password: req.body.password
        }, {
            where: {
                // TODO: revise it, how FE will get hte email (we don't have session also)
                email: email,
            },
        });
        if (user) {
            res.status(httpStatus.OK).send({
                message: "password updated successfully"
            });
        } else {
            res.status(httpStatus.FORBIDDEN).send({
                message: "invalid email"
            });

        }

    } catch (error) {
        res.status(httpStatus.FORBIDDEN).send({
            message: "invalid token sent"
        });
    }

};

// 2. Get current user 
const getUser = async(req, res) => {
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
                res.status(httpStatus.OK).send(user);
            } else {
                res.status(httpStatus.NOT_FOUND).send({
                    message: "Not Found"
                });
            }
        }
    });

};

// 3. Get Users for manage users page
const getUsers = async(req, res) => {
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
                if (user.type == 'admin') {
                    const users = await User.findAll({
                        attributes: ["username", "type"],
                    });
                    res.status(httpStatus.OK).send(users);
                } else {
                    res.status(httpStatus.UNAUTHORIZED).send({
                        message: "you must be an admin to make this operation "
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

const upgradeLearner = async(req, res) => {

    jwt.verify(req.token, config.SECRET_KEY, async(err, authData) => {
        if (err) {
            res.status(httpStatus.UNAUTHORIZED).send({
                message: err.message
            });
        } else {
            const admin = await User.findOne({
                where: {
                    username: authData.username
                },
            });
            if (admin) {
                if (admin.type == 'admin') {

                    const user1 = await User.findOne({
                        where: {
                            username: req.params.username
                        },
                    });
                    if (user1.type == 'learner') {
                        const user = await User.update({
                            type: "instructor"
                        }, {
                            where: {
                                username: req.params.username,
                            },
                        });
                        res.status(httpStatus.OK).send({
                            message: "updated successfully"
                        });
                    } else {
                        res.status(httpStatus.FORBIDDEN).send({
                            message: "user is already instructor"
                        });
                    }

                } else {
                    res.status(httpStatus.UNAUTHORIZED).send({
                        message: "you must be an admin to make this operation "
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

const updateUser = async(req, res) => {
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
            console.log("userID", user._id);
            if (user) {
                const updatedData = {
                    username: req.body.username,
                    email: req.body.email,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    birthDate: req.body.birthDate,
                };
                try {

                    await User.update(updatedData, {
                        where: {
                            _id: user._id
                        }
                    });
                    const updatedUser = await User.findOne({
                        where: {
                            _id: user._id
                        },
                    });

                    console.log("ok", updatedUser);
                    const userData = {
                        _id: updatedUser._id,
                        username: updatedUser.username,
                        email: updatedUser.email,
                        firstName: updatedUser.firstName,
                        lastName: updatedUser.lastName,
                        birthDate: updatedUser.birthDate,
                        coursesIds: updatedUser.coursesIds || [],
                        type: updatedUser.type,
                    };


                    res.status(httpStatus.OK).send({
                        message: "updated successfully",
                        userData: userData,
                        token: jwt.sign(userData, config.SECRET_KEY, {
                            expiresIn: config.JWT_EXPIRES_IN
                        }),

                    });
                } catch (error) {
                    console.log(error);
                    res.status(httpStatus.BAD_REQUEST).send({
                        message: "invalid info provided"
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

// TODO :
const enrollMe = async(req, res) => {

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
                if (user.type == constants.userType.LEARNER || user.type == constants.userType.ADMIN) {
                    try {

                        const userCourse = await UserCourses.create({
                            userId: authData._id, //userId,
                            courseId: req.body.courseId,
                        });
                    } catch (error) {
                        res.status(httpStatus.ALREADY_REPORTED).send({
                            message: "Already enrolled"
                        });
                    }

                    if (userCourse) res.status(httpStatus.OK).send(userCourse);
                    else
                        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
                            message: "failed to add, please try again"
                        });

                } else {
                    res.status(httpStatus.UNAUTHORIZED).send({
                        message: "you must be an admin or learner to make this operation"
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

// 4. Delete User
const deleteUser = async(req, res) => {
    // TODO: use the id from session instead of username
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
                if (user.type == 'admin') {
                    const userToBeDeleted = await User.findOne({
                        where: {
                            username: req.params.username
                        },
                    });
                    if (userToBeDeleted) {
                        await User.destroy({
                            where: {
                                username: req.params.username
                            }
                        });
                        res.status(httpStatus.OK).send({
                            message: "User Deleted Successfully"
                        });
                    } else {
                        res.status(httpStatus.NOT_FOUND).send({
                            message: "User Not Found"
                        });
                    }

                } else {
                    res.status(httpStatus.UNAUTHORIZED).send({
                        message: "you must be an admin to make this operation "
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

module.exports = {
    signup,
    login,
    updateUser,
    forgotPassword,
    resetPassword,
    getUser,
    getUsers,
    upgradeLearner,
    enrollMe,
    deleteUser,
};