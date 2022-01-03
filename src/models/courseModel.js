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
            unique: true,
            allowNull: false,
        },
        syllabus: {
            type: DataTypes.STRING,
            allowNull: false,
            get() {
                const syllabus = this.getDataValue('syllabus');
                return syllabus.split("$%&");
            },
            set(syllabus) {
                this.setDataValue('syllabus', syllabus.join("$%&"));
            }
        },
    });
};