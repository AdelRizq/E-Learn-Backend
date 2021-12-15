const {
    Sequelize,
    DataTypes,
    Model,
} = require('sequelize');

class Course extends Model {}

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
    instructor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        foreignKey: true
    }
}, {
    sequelize,
    modelName: 'Course',
    tableName: 'course'
});

module.exports = Course;