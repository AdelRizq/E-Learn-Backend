module.exports = async() => {
    const Admin = require('./models/Admin');
    const Course = require('./models/Course');
    const Learner = require('./models/Learner');
    const Instructor = require('./models/Instructor');

    Instructor.hasMany(Course, {
        foreignKey: 'instructor_id'
    });
    Course.belongsTo(Instructor);
}