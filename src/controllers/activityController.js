const httpStatus = require("http-status");
const uuid = require("uuid");
const db = require("../models");

const Activity = db.activities;

// 1. Add Activity
const addActivity = async (req, res) => {
    const info = {
        // _id: uuid.v4(),
        name: req.body.name,
        type: req.body.type,
        link: req.body.link,
        courseId: req.body.courseId,
    };

    const activity = await Activity.create(info);
    res.status(httpStatus.OK).send(activity);
    console.log(activity);
};

// 2. Get Activities
const getActivities = async (req, res) => {
    const activities = await Activity.findAll({
        where: { courseId: req.params.courseId },
    });

    if (activities) res.status(httpStatus.OK).send(activities);
    else res.status(httpStatus.NO_CONTENT).send("No Activities Found");
};

const getActivity = async (req, res) => {
    const activity = await Activity.findOne({
        where: { id: req.params.id },
    });

    if (activity) res.status(httpStatus.OK).send(activity);
    else res.status(httpStatus.NOT_FOUND).send("Course Not Found");
};

// 3. Delete Activity
const deleteActivity = async (req, res) => {
    await Activity.destroy({ where: { id: req.body.id } });
    res.status(httpStatus.OK).send("Activity Deleted Successfully");
};

module.exports = {
    addActivity,
    getActivity,
    getActivities,
    deleteActivity,
};
