const express = require('express')
const router = express.Router()
const NotificationController = require('../controllers/notification')

router.get('/user/:id', NotificationController.getByUser);
router.get('/quantity/user/:id', NotificationController.getQuantityByUser)
router.delete('/:id', NotificationController.deleteNoti);

module.exports = router;