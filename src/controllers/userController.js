const uuid = require("uuid");
const { courses } = require("../models");
const db = require("../models");

const User = db.users;

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
    res.status(200).send(user);
    console.log(user);
};

const login = async (req, res) => {
    const user = await User.findOne({
        where: { email: req.body.email, password: req.body.password },
    });

    console.log(user);
    if (user) res.status(200).send(user);
    else res.status(200).send("Not Found");
};

const forgotPassword = async (req, res) => {
    const user = await User.findOne({ where: { email: req.body.email } });

    console.log(user);
    if (user) res.status(200).send(user);
    else res.status(200).send("Not Found");
};

const resetPassword = async (req, res) => {
    const user = await User.update(
        { password: req.body.password },
        {
            where: {
                email: req.body.email,
            },
        }
    );

    res.status(200).send(user);
};

// 2. Get User by Username
const getUser = async (req, res) => {
    const user = await User.findOne({
        where: { username: req.params.username },
    });
    res.status(200).send(user);
    console.log(user);
};

// 3. Get Users for manage users page
const getUsers = async (req, res) => {
    const users = await User.findAll({
        attributes: ["username", "type"],
    });
    res.status(200).send(users);
};

const upgradeLearner = async (req, res) => {
    // if instructor return already instructor
    const user = await User.update(
        { type: "instructor" },
        {
            where: {
                username: req.params.username,
            },
        }
    );
    res.status(200).send(user);
};

const addCourse = async (req, res) => {
    let coursesIds = await User.findOne(
        { where: { username: req.params.username } }
        // { attributes: "coursesIds" }
    );
    console.log(`coursesIds: ${coursesIds}`);

    const added = await User.update(
        {
            coursesIds: coursesIds + ";" + req.body.courseId,
        },
        { where: { username: req.params.username } }
    );

    res.status(200).send(added);
};

// 4. Delete User
const deleteUser = async (req, res) => {
    await User.destroy({ where: { username: req.params.username } });
    res.status(200).send("User Deleted Successfully");
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
