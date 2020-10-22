const express = require('express')
const router = express.Router()
const UtilityController = require('../controllers/utility')

router.get('/', UtilityController.getAllUtilities);

module.exports = router