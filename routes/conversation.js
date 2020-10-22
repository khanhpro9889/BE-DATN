const express = require('express')
const router = express.Router()
const ConversationController = require('../controllers/conversation')

router.get('/:uid', ConversationController.getConversationById);
router.post('/', ConversationController.addConversation);


module.exports = router;