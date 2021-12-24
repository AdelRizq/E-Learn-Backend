module.exports = (sequelize, DataTypes) => {
    return sequelize.define("user", {
        _id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING(45),
            allowNull: false,
            unique: true,
        },
        email: {
            type: DataTypes.STRING(45),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        birthDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        coursesIds: {
            type: DataTypes.STRING,
            allowNull: true,
            // https://stackoverflow.com/questions/41860792/how-can-i-have-a-datatype-of-array-in-mysql-sequelize-instance
            get() {
                return this.getDataValue("coursesIds")?.split(";");
            },
            set(val) {
                this.setDataValue("coursesIds", val.join(";"));
            },
        },
        type: {
            // {"learner", "instructor"}
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
};
