const adminController = require('../controllers/adminController.js');

const router = require('express').Router()

router.post('/addAdmin', adminController.addAdmin)

router.get('/:email', adminController.getAdminByEmail)
router.get('/:username', adminController.getAdminByUsername)

router.delete('/:username', adminController.deleteAdmin)

module.exports = router