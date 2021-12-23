const Sequelize = require("sequelize");

const sequelize = new Sequelize('lms', 'root', 'Mahboub123', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;
global.sequelize = sequelize;