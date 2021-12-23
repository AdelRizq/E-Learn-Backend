const db = require('../models');

const Ninja = db.ninjas;


// create ninja 
const addNinja = async function (req, res) {
    let info = {
        name: req.body.name,
        rank: req.body.rank
    }

    const ninja = await Ninja.create(info);
    res.status(200).send(ninja);
    console.log(ninja);
}

// get all ninja 
const getAllNinjas = async function (req, res) {

    const ninjas = await Ninja.findAll({});
    res.status(200).send(ninja);
    console.log(ninjas);
}

// get single ninja
const getOneNinja = async function (req, res) {

    let id = req.params.id;
    const ninjas = await Ninja.findOne({
        where: {
            id: id
        }
    });
    res.status(200).send(ninjas);
    console.log(ninjas);
}

// update ninja
const getOneNinja = async function (req, res) {

    let id = req.params.id;
    const ninjas = await Ninja.findOne({
        where: {
            id: id
        }
    });
    res.status(200).send(ninjas);
    console.log(ninjas);
}