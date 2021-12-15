const {
    Sequelize,
    DataTypes,
    Model
} = require('sequelize');

class Instructor extends Model {}

Admin.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    firstname: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    lastname: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    birthdate: {
        type: DataTypes.STRING(45),
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Instructor',
    tableName: 'instructor'
});

module.exports = Instructor;