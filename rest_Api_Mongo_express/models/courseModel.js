module.exports = (sequelize, DataTypes) => {
    return sequelize.define('course', {
        _id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        instructor: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        learnersIds: {
            type: DataTypes.STRING,
            allowNull: true,
            // https://stackoverflow.com/questions/41860792/how-can-i-have-a-datatype-of-array-in-mysql-sequelize-instance
            get() {
                return this.getDataValue('learnersIds').split(';')
            },
            set(val) {
               this.setDataValue('learnersIds',val.join(';'));
            },
        },
        activitiesIds: {
            type: DataTypes.STRING,
            allowNull: true,
            // https://stackoverflow.com/questions/41860792/how-can-i-have-a-datatype-of-array-in-mysql-sequelize-instance
            get() {
                return this.getDataValue('activitiesIds').split(';')
            },
            set(val) {
               this.setDataValue('activitiesIds',val.join(';'));
            },
        }
    });
}