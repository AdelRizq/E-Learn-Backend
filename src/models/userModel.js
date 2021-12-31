const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
    let userSchema = sequelize.define(
        "user",
        {
            _id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
                // defaultValue: DataTypes.UUIDV4,
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
            type: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            hooks: {
                beforeCreate: async (user) => {
                    if (user.password) {
                        const salt = await bcrypt.genSaltSync(10, "a");
                        user.password = bcrypt.hashSync(user.password, salt);
                    }
                },
                beforeUpdate: async (user) => {
                    if (user.password) {
                        const salt = await bcrypt.genSaltSync(10, "a");
                        user.password = bcrypt.hashSync(user.password, salt);
                    }
                },
            },
            instanceMethods: {
                validPassword: (password) => {
                    return bcrypt.compareSync(password, this.password);
                },
            },
        }
    );

    userSchema.prototype.validPassword = async (password, hash) => {
        return bcrypt.compareSync(password, hash);
    };

    return userSchema;
};
