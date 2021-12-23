module.exports = (sequelize, DataTypes) => {

    return sequelize.define('admin', {
        _id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING(45),
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING(45),
            allowNull: false,
            unique: true
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        birthDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
    });
}