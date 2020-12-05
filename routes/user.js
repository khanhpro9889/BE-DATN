const express = require('express')
const router = express.Router()
const UserController = require('../controllers/user')
const checkAuth = require('../middlewares/check-auth')
const uploadFiles = require('../middlewares/upload-files');

router.get('/', UserController.getAllUser);
router.get('/get-user-for-auth/:uid', checkAuth, UserController.getUser);
router.get('/:uid', UserController.getUser);
router.patch('/change-role/:uid', UserController.changeRoleUser);
router.patch('/:uid', uploadFiles.single('avatar'), UserController.updateUser);
router.delete('/:uid', UserController.deleteUser);


module.exports = router