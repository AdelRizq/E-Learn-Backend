const db = require('../models');

const Admin = db.admins


// 1. Add Admin
const addAdmin = async (req, res) => {
    const info = {
        username: req.body.username,
        email: req.body.email,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        birthDate: req.body.birthDate
    }

    const admin = await Admin.create(info);
    res.status(200).send(admin);
    console.log(admin);


}

// 2. Get Admin
const getAdminByEmail = async (req, res) => {
    const admin = await Admin.findOne({ where: { email: req.body.email } });
    res.status(200).send(admin);
    console.log(admin);
}

const getAdminByUsername = async (req, res) => {
    const admin = await Admin.findOne({ where: { username: req.body.username } });
    res.status(200).send(admin);
    console.log(admin);
}

// 3. Delete Admin
const deleteAdmin = async (req, res) => {
    await Admin.destroy(req.params.username);
    res.status(200).send("Admin Deleted Successfully");
}


module.exports = {
    addAdmin,
    getAdminByEmail,
    getAdminByUsername,
    deleteAdmin
}