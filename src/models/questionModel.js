module.exports = (sequelize, DataTypes) => {
    return sequelize.define("question", {
        _id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        courseId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        body: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
    });
};