const BoxMessage = require('../models/BoxMessage');
const mongoose = require("mongoose");

exports.getByGym = async (req, res, next) => {
    const { id } = req.params;
    try {
        const bms = await BoxMessage.find({gym: id});
        console.log(bms);
        res.status(200).json({boxMessage: bms});
    } catch (error) {
        res.status(500).json(error);
    }
}

exports.addMessage = async (req, res, next) => {
    const { answer, question, gym } = req.body;
    try {
        const newBM = new BoxMessage({
            _id: new mongoose.Types.ObjectId(),
            answer,
            question,
            gym
        })
        newBM.save();
        res.status(200).json({message: 'Add successfully'});
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}

exports.update = async (req, res, next) => {
    const { id } = req.params;
    const { answer, question } = req.body;
    try {
        await BoxMessage.updateOne({_id: id}, {answer: answer, question: question});
        res.status(200).json({message: 'Add successfully'});
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}


exports.deleteMessage = async (req, res, next) => {
    const { id } = req.params;
    try {
        await BoxMessage.deleteOne({_id: id});
        res.status(200).json({messages: 'Delete successfully'});
    } catch (error) {  
        res.status(500).json({error});
    }
}