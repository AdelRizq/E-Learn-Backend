const Sequelize = require("sequelize");

const sequelize = new Sequelize('lms', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;
global.sequelize = sequelize;