const express = require('express')
const router = express.Router()
const SaveController = require('../controllers/save')

router.post('/', SaveController.addSave);
router.get('/user/:id', SaveController.getSavesByUser);
router.delete('/:id', SaveController.deleteSave);

module.exports = router;