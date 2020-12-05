const express = require('express')
const router = express.Router();

const reviewController = require('../controllers/review');
router.get('/user/:id', reviewController.getReviewsByUser);
router.get('/get-reviews-by-gym/:id', reviewController.getAllReviewsByGym);
router.post('/', reviewController.addReview);
router.delete('/:id', reviewController.deleteReview);
router.patch('/:id', reviewController.updateReview);

module.exports = router;