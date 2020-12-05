const express = require('express')
const router = express.Router()
const BoxMessageController = require('../controllers/box-message')

router.get('/gym/:id', BoxMessageController.getByGym);
router.delete('/:id', BoxMessageController.deleteMessage)
router.post('/', BoxMessageController.addMessage);
router.patch('/:id', BoxMessageController.update);

module.exports = router;