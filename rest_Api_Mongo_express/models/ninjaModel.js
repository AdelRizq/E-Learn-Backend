module.exports = (sequelize, DataTypes) => {
    const Ninja = sequelize.define('Ninja', {
        _id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(45),
            allowNull: false


        },
        rank: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'ninja'
    });

    return Ninja
}