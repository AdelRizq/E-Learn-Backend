const dbconfig = require('../config/db.config');
const {
    Sequelize,
    DataTypes
} = require('sequelize');


const sequelize = new Sequelize(
    dbconfig.DB,
    dbconfig.USER,
    dbconfig.PASSWORD, {
        host: dbconfig.HOST,
        dialect: dbconfig.dialect,
        opperatorsAliases: false,

        pool: {
            max: dbconfig.pool.max,
            min: dbconfig.pool.min,
            acquire: dbconfig.pool.acquire,
            idle: dbconfig.pool.idle
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

db.ninjas = require('./ninjaModel.js')(sequelize, DataTypes);

db.sequelize.sync({
    force: false
}).then(() => {
    console.log('re-sync done');
});

module.exports = db;