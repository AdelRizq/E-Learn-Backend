module.exports = (sequelize, DataTypes) => {
    return sequelize.define("course", {
        _id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,  
        },
        syllabus: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
};
