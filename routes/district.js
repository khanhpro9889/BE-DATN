const express = require('express')
const router = express.Router();
const districtController = require('../controllers/district');

router.get('/', districtController.districts_get_all);
router.get('/province/:code', districtController.districts_get_by_province);
module.exports = router;