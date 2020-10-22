const Category = require('../models/Category');
const mongoose = require("mongoose");

exports.getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category.find();
        res.status(200).json({categories: categories});
    } catch (error) {
        res.status(500).json(err);
    }
}

exports.addCategory = async (req, res, next) => {
    const { name } = req.body;
    try {
        const newCategory = new Category({
            _id: new mongoose.Types.ObjectId(),
            name: name,
            createAt: new Date(),
            updateAt: null
        })
        newCategory.save();
        res.status(200).json({message: 'Add successfully'});
    } catch (error) {
        res.status(500).json(err);
    }
}

exports.deleteCategory = async (req, res, next) => {
    const { id } = req.params;
    try {
        await Category.deleteOne({_id: id});
        res.status(200).json({messages: 'Delete successfully'});
    } catch (error) {  
        res.status(500).json({err});
    }
}

exports.updateCategory = async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        await Category.updateOne({_id: id}, {name: name, updateAt: new Date()});
        res.status(200).json({messages: 'Update successfully'});
    } catch (error) {  
        res.status(500).json({err});
    }
}