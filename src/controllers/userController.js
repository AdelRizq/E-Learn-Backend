const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const httpStatus = require("http-status");

const constants = require("../config/constants.config");
const config = require("./../config/jwt.config");
const db = require("../models");

const User = db.users;
const UserCourse = db.userCourses;

// 1. Authentication
const signup = async(req, res) => {
    const info = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        birthDate: req.body.birthDate,
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
            type: user.type,
        };

        info._id = user._id;
        return res.status(httpStatus.CREATED).send({
            token: jwt.sign(userData, config.SECRET_KEY, {
                expiresIn: config.JWT_EXPIRES_IN,
            }),
            userData: userData,
        });
    } catch (error) {
        return res.status(httpStatus.BAD_REQUEST).send({
            message: "Please try different username or email",
        });
    }
};

const login = async(req, res) => {
    const user = await User.findOne({
        where: {
            email: req.body.email,
        },
    });

    if (!user) {
        return res.status(httpStatus.UNAUTHORIZED).send({
            message: "Email Not Found",
        });
    }

    if (!user.password || !(await user.validPassword(req.body.password, user.dataValues.password))) {
        return res.status(httpStatus.UNAUTHORIZED).send({
            message: "Password is not correct, please try again",
        });
    }

    const userData = {
        _id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        birthDate: user.birthDate,
        type: user.type,
    };

    return res.status(httpStatus.OK).send({
        token: jwt.sign(userData, config.SECRET_KEY, {
            expiresIn: config.JWT_EXPIRES_IN,
        }),
        userData: userData,
    });
};

const forgotPassword = async(req, res) => {
    const userData = {
        email: req.body.email,
    };

    const token = jwt.sign(userData, config.SECRET_KEY_RESET_PASSWORD, {
        expiresIn: config.JWT_EXPIRES_IN,
    });
    try {

        const user = await User.findOne({
            where: {
                email: req.body.email,
            },
        });

        if (!user) {
            return res.status(httpStatus.UNAUTHORIZED).send({
                message: "Email Not Found",
            });
        }
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
            message: "Internal server error",
        });
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "dragonlerarners@gmail.com",
            pass: "9_Dragon_Learners_9",
        },
    });

    const mailOptions = {
        from: "9_Dragon_Learners_9",
        to: req.body.email,
        subject: "Reset Password",
        html: `<h2>please click on the given link to reset your password<h2/>
                <p>${constants.env.CLIENT_URL}/reset/${token}<p/>`,
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            return res.status(httpStatus.OK).send({
                message: "invalid email sent",
            });
        } else {
            return res.status(httpStatus.OK).send({
                message: "email sent",
            });
        }
    });
};

const resetPassword = async(req, res) => {
    try {
        const email = jwt.verify(
            req.body.token,
            config.SECRET_KEY_RESET_PASSWORD
        ).email;

        const salt = await bcrypt.genSaltSync(10, "a");
        const updatedPassword = bcrypt.hashSync(req.body.password, salt);

        const user = await User.update({
            password: updatedPassword,
        }, {
            where: {
                email: email,
            },
        });

        if (!user) {
            return res.status(httpStatus.FORBIDDEN).send({
                message: "invalid email",
            });
        }

        return res.status(httpStatus.OK).send({
            message: "password updated successfully",
        });
    } catch (error) {
        return res.status(httpStatus.FORBIDDEN).send({
            message: "invalid token sent",
        });
    }
};

// 2. Get current user
const getUser = async(req, res) => {
    jwt.verify(req.token, config.SECRET_KEY, async(err, authData) => {
        if (err) {
            return res.status(httpStatus.UNAUTHORIZED).send({
                message: err.message,
            });
        }

        const user = await User.findOne({
            where: {
                _id: authData._id,
            },
            attributes: [
                "username",
                "email",
                "firstName",
                "lastName",
                "type",
                "birthDate",
            ],
        });

        if (!user) {
            return res.status(httpStatus.NOT_FOUND).send({
                message: "Not Found",
            });
        }

        return res.status(httpStatus.OK).send(user);
    });
};

// 3. Get Users for manage users page
const getUsers = async(req, res) => {
    jwt.verify(req.token, config.SECRET_KEY, async(err, authData) => {
        if (err) {
            return res.status(httpStatus.UNAUTHORIZED).send({
                message: err.message,
            });
        }

        const user = await User.findOne({
            where: {
                username: authData.username,
            },
        });

        if (!user) {
            return res.status(httpStatus.NOT_FOUND).send({
                message: "user Not Found",
            });
        }

        if (user.type != constants.userType.ADMIN) {
            return res.status(httpStatus.UNAUTHORIZED).send({
                message: "you must be an admin to make this operation ",
            });
        }
        try { 
            const users = await User.findAll({
                where: { type: ["learner", "instructor"] },
                attributes: ["username", "type"],
            });

            return res.status(httpStatus.OK).send(users);
        } catch (error) {
            return res.status(httpStatus.NOT_FOUND).send({
                message: "error fetching users",
            });
        }
    });
};

const upgradeLearner = async(req, res) => {
    jwt.verify(req.token, config.SECRET_KEY, async(err, authData) => {
        if (err) {
            return res.status(httpStatus.UNAUTHORIZED).send({
                message: err.message,
            });
        }

        const admin = await User.findOne({
            where: {
                username: authData.username,
            },
        });

        if (!admin) {
            return res.status(httpStatus.NOT_FOUND).send({
                message: "user Not Found",
            });
        }

        if (admin.type != constants.userType.ADMIN) {
            return res.status(httpStatus.UNAUTHORIZED).send({
                message: "you must be an admin to make this operation ",
            });
        }

        const user = await User.findOne({
            where: {
                username: req.params.username,
            },
        });

        if (!user) {
            return res.status(httpStatus.NOT_FOUND).send({
                message: "user not found",
            });
        }

        if (user.type != constants.userType.LEARNER) {
            return res.status(httpStatus.FORBIDDEN).send({
                message: "user is already instructor",
            });
        }
        try {
            await User.update({
                type: constants.userType.INSTRUCTOR,
            }, {
                where: {
                    username: req.params.username,
                },
                attributes: [
                    "username",
                    "email",
                    "firstName",
                    "lastName",
                    "type",
                    "birthDate",
                ],
            });
            await UserCourse.destroy({
                where: {
                    userId: user._id
                }
            });
            return res.status(httpStatus.OK).send({
                message: "updated successfully",
            });
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
                message: "error during updating database",
            });
        }
    });
};

const updateUser = async(req, res) => {
    jwt.verify(req.token, config.SECRET_KEY, async(err, authData) => {
        if (err) {
            return res.status(httpStatus.UNAUTHORIZED).send({
                message: err.message,
            });
        }
        const user = await User.findOne({
            where: {
                _id: authData._id,
            },
        });

        if (!user) {
            return res.status(httpStatus.NOT_FOUND).send({
                message: "user Not Found",
            });
        }

        const updatedData = {
            username: req.body.username || user.username,
            email: req.body.email || user.email,
            firstName: req.body.firstName || user.firstName,
            lastName: req.body.lastName || user.lastName,
            birthDate: req.body.birthDate || user.birthDate,
        };

        try {
            await User.update(updatedData, {
                where: {
                    _id: user._id,
                },
            });
            const updatedUser = await User.findOne({
                where: {
                    _id: user._id,
                },
            });

            const userData = {
                username: updatedUser.username,
                email: updatedUser.email,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                birthDate: updatedUser.birthDate,
                type: updatedUser.type,
            };

            return res.status(httpStatus.OK).send({
                message: "updated successfully",
                userData: userData,
                token: jwt.sign(userData, config.SECRET_KEY, {
                    expiresIn: config.JWT_EXPIRES_IN,
                }),
            });
        } catch (error) {
            return res.status(httpStatus.BAD_REQUEST).send({
                message: "invalid info provided",
            });
        }
    });
};

const enrollMe = async(req, res) => {
    jwt.verify(req.token, config.SECRET_KEY, async(err, authData) => {
        if (err) {
            return res.status(httpStatus.UNAUTHORIZED).send({
                message: err.message,
            });
        }

        const user = await User.findOne({
            where: {
                _id: authData._id,
            },
        });

        if (!user) {
            return res.status(httpStatus.NOT_FOUND).send({
                message: "user Not Found",
            });
        }
        if (
            user.type != constants.userType.LEARNER &&
            user.type != constants.userType.ADMIN
        ) {
            return res.status(httpStatus.UNAUTHORIZED).send({
                message: "you must be an admin or learner to make this operation",
            });
        }
        try {
            const userCourse = await UserCourse.create({
                userId: authData._id,
                courseId: req.body.courseId,
            });

            if (!userCourse)
                return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
                    message: "failed to enroll, please try again",
                });

            return res.status(httpStatus.OK).send(userCourse);
        } catch (error) {
            return res.status(httpStatus.ALREADY_REPORTED).send({
                message: "Already enrolled",
            });
        }
    });
};

// 4. Delete User
const deleteUser = async(req, res) => {
    jwt.verify(req.token, config.SECRET_KEY, async(err, authData) => {
        if (err) {
            return res.status(httpStatus.UNAUTHORIZED).send({
                message: err.message,
            });
        }
        const user = await User.findOne({
            where: {
                username: authData.username,
            },
        });

        if (!user) {
            return res.status(httpStatus.NOT_FOUND).send({
                message: "user Not Found",
            });
        }

        if (user.type != constants.userType.ADMIN) {
            return res.status(httpStatus.UNAUTHORIZED).send({
                message: "you must be an admin to make this operation ",
            });
        }

        const userToBeDeleted = await User.findOne({
            where: {
                username: req.params.username,
            },
        });

        if (!userToBeDeleted) {
            return res.status(httpStatus.NOT_FOUND).send({
                message: "User Not Found",
            });
        }
        try {
            await User.destroy({
                where: {
                    username: req.params.username,
                },
            });
            return res.status(httpStatus.OK).send({
                message: "User Deleted Successfully",
            });
        } catch (error) {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
                message: "failed to delete user",
            });
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