const uuid = require("uuid");
const { courses } = require("../models");
const httpStatus = require("http-status");
const db = require("../models");

const User = db.users;
const UserCourses = db.userCourses;

// 1. Authentication
const signup = async (req, res) => {
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

    const user = await User.create(info);

    // TODO: generate token and send it back
    res.status(httpStatus.OK).send(user._id);
    console.log(user);
};

const login = async (req, res) => {
    const user = await User.findOne({
        where: { email: req.body.email, password: req.body.password },
    });

    if (user) res.status(httpStatus.OK).send(user);
    else
        res.status(httpStatus.UNAUTHORIZED).send("Incorrect email or password");
};

const forgotPassword = async (req, res) => {
    const user = await User.findOne({ where: { email: req.body.email } });

    if (user) res.status(httpStatus.OK).send(user);
    else res.status(httpStatus.UNAUTHORIZED).send("Email Not Found");
};

const resetPassword = async (req, res) => {
    const user = await User.update(
        { password: req.body.password },
        {
            where: {
                // TODO: revise it, how FE will get hte email (we don't have session also)
                email: req.body.email,
            },
        }
    );

    res.status(httpStatus.OK).send(user);
};

// 2. Get User by Username
const getUser = async (req, res) => {
    const user = await User.findOne({
        where: { username: req.params.username },
    });

    if (user) res.status(httpStatus.OK).send(user);
    else res.status(httpStatus.NOT_FOUND).send("Not Found");
};

// 3. Get Users for manage users page
const getUsers = async (req, res) => {
    const users = await User.findAll({
        attributes: ["username", "type"],
    });
    res.status(httpStatus.OK).send(users);
};

const upgradeLearner = async (req, res) => {
    const user = await User.update(
        { type: "instructor" },
        {
            where: {
                username: req.params.username,
            },
        }
    );

    res.status(httpStatus.OK).send(user);
};

const addCourse = async (req, res) => {
    const userCourse = await UserCourses.create({
        userId: req.params._id,
        courseId: req.body.courseId,
    });

    if (userCourse) res.status(httpStatus.OK).send(userCourse);
    else
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(
            "Didn't added, please try again"
        );
};

// 4. Delete User
const deleteUser = async (req, res) => {
    // TODO: use the id from session instead of username
    await User.destroy({ where: { username: req.params.username } });
    res.status(httpStatus.OK).send("User Deleted Successfully");
};

module.exports = {
    signup,
    login,
    forgotPassword,
    resetPassword,
    getUser,
    getUsers,
    upgradeLearner,
    addCourse,
    deleteUser,
};
