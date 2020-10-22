const express = require('express')
const router = express.Router()
const CategoryController = require('../controllers/category')

router.get('/', CategoryController.getAllCategories);
router.delete('/:id', CategoryController.deleteCategory)
router.post('/', CategoryController.addCategory);
router.patch('/:id', CategoryController.updateCategory);

module.exports = router;