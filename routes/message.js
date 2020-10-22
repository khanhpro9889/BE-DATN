const express = require('express')
const router = express.Router()
const MessageController = require('../controllers/message');
const uploadFiles = require('../middlewares/upload-files');

router.get('/:conversationId', MessageController.getMessageByConversation);
router.post('/', uploadFiles.single('img'), MessageController.addMessage);
router.delete('/:id', MessageController.deleteMessage);
module.exports = router;