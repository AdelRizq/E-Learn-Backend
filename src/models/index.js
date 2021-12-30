const dbConfig = require("../config/db.config");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    logging: false,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle,
    },
});

sequelize
    .authenticate()
    .then(() => {
        console.log("connected...");
    })
    .catch((err) => {
        console.log("Error" + err);
    });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./userModel")(sequelize, DataTypes);
db.courses = require("./courseModel")(sequelize, DataTypes);
db.activities = require("./activityModel")(sequelize, DataTypes);

db.answers = require("./answerModel")(sequelize, DataTypes);
db.questions = require("./questionModel")(sequelize, DataTypes);
db.userCourses = require("./userCoursesModel")(sequelize, DataTypes);

db.users.belongsToMany(db.courses, {
    through: db.userCourses,
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
});

db.courses.belongsToMany(db.users, {
    through: db.userCourses,
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
});

db.courses.belongsTo(db.users, {
    as: "instructor",
});

db.courses.hasMany(db.activities, {
    foreignKey: "courseId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});
db.activities.belongsTo(db.courses, {
    foreignKey: "courseId",
});

db.courses.hasMany(db.questions, {
    foreignKey: "courseId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

db.questions.hasMany(db.answers, {
    foreignKey: "questionId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

db.sequelize
    .sync({
        force: false,
    })
    .then(() => {
        console.log("re-sync done");
    });

module.exports = db;
