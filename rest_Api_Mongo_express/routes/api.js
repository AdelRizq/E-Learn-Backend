const express = require('express');
const {
    param
} = require('express/lib/router');
const Ninja = require('../models/ninjas')
const router = express.Router();

router.get('/ninjas', function(req, res, next) {
    Ninja.find({}).then(function(ninjas) {
        res.send(ninjas);
    });
});

router.post('/ninjas', function(req, res, next) {
    Ninja.create(req.body).then(function(ninja) {
        res.send(ninja);
    }).catch(next); // promise 

});

router.put('/ninjas/:id', function(req, res, next) {
    Ninja.findByIdAndUpdate({
        _id: req.params.id
    }, req.body).then(function(ninja) {
        Ninja.findOne({
            _id: req.params.id
        }).then(function(ninja) {
            res.send(ninja);
        });
    });
});

router.delete('/ninjas/:id', function(req, res, next) {
    Ninja.findByIdAndRemove({
        _id: req.params.id
    }).then(function(ninja) {
        res.send(ninja);
    });
});

module.exports = router;