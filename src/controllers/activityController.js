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
    res.status(200).send(activity);
    console.log(activity);
};

// 2. Get Activities
const getActivities = async (req, res) => {
    const activities = await Activity.findAll({
        where: { courseId: req.params.courseId },
    });

    res.status(200).send(activities);
    console.log(activities);
};

const getActivity = async (req, res) => {
    const activity = await Activity.findOne({
        where: { id: req.params.id },
    });
    res.status(200).send(activity);
    console.log(activity);
};

// 3. Delete Activity
const deleteActivity = async (req, res) => {
    await Activity.destroy({ where: { id: req.body.id } });
    res.status(200).send("Activity Deleted Successfully");
};

module.exports = {
    addActivity,
    getActivity,
    getActivities,
    deleteActivity,
};
