const dbConfig = require('../config/db.config');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,

        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    }
);

sequelize.authenticate()
    .then(() => {
        console.log('connected...');
    })
    .catch(err => {
        console.log('Error' + err);
    });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require('./userModel') (sequelize, DataTypes);
db.courses = require('./courseModel') (sequelize, DataTypes);
db.admins = require('./adminModel.js') (sequelize, DataTypes);
db.activities = require('./activityModel') (sequelize, DataTypes);

db.sequelize.sync({
    force: false
}).then(() => {
    console.log('re-sync done');
});

module.exports = db;