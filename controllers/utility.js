const mongoose = require("mongoose");
const Utility = require("../models/Utility");

exports.getAllUtilities = async (req, res, next) => {
    try {
        const utilities = await Utility.find();
        res.status(200).json({utilities: utilities});
    } catch (error) {
        res.status(500).json(error)
    } 
}