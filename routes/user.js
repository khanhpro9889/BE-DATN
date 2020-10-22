const express = require('express')
const router = express.Router()
const UserController = require('../controllers/user')
const checkAuth = require('../middlewares/check-auth')
const uploadFiles = require('../middlewares/upload-files');

router.get('/:uid', UserController.getUser)
router.post('/:uid', uploadFiles.single('avatar'), UserController.updateUser);
module.exports = router