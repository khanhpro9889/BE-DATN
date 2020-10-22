const express = require('express')
const router = express.Router();
const provinceController = require('../controllers/province');

router.get('/', provinceController.provinces_get_all);

module.exports = router;