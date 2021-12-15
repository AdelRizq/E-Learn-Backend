const {
    Sequelize,
    DataTypes,
    Model
} = require('sequelize');

class Learner extends Model {}

Learner.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true
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
    modelName: 'Learner',
    tableName: 'learner'
});

module.exports = Learner;