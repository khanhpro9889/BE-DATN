const express = require('express')
const router = express.Router();
const replyController = require('../controllers/reply');

router.get('/get-replies-by-review/:id', replyController.getAllRepliesByReview);
router.post('/', replyController.addReply);
router.delete('/:id', replyController.deleteReply);
router.patch('/:id', replyController.updateReply);

module.exports = router;