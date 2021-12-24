const adminController = require('../controllers/adminController.js');

const router = require('express').Router()

router.post('/addAdmin', adminController.addAdmin)

router.get('/:username', adminController.getAdmin)

router.delete('/:username', adminController.deleteAdmin)

module.exports = router