const user = require("./userModel");
const course = require("./courseModel");

module.exports = (sequelize, DataTypes) => {
    return sequelize.define("user_courses", {
        userId: {
            type: DataTypes.INTEGER,
            references: {
                model: user,
                key: "_id",
            },
        },
        courseId: {
            type: DataTypes.INTEGER,
            references: {
                model: course,
                key: "_id",
            },
        },
    });
};
