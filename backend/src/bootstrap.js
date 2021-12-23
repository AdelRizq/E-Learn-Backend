module.exports = async() => {
    const Admin = require('./models/Admin');
    const Course = require('./models/Course');
    const Learner = require('./models/Learner');
    const Instructor = require('./models/Instructor');

    Instructor.hasMany(Course, {
        foreignKey: 'instructor_id'
    });
    Course.belongsTo(Instructor);
    const admin = await Admin.create({
        name: "Mahboub",
        email: "ahmed@gmail.com",
        password: "ffffdf",
        firstname: "Ahmed",
        lastname: "Mahboub",
        birthdate: "9-3-99"

    });
    console.log(admin);
}