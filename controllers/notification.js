const Notification = require('../models/Notification');
const mongoose = require("mongoose");

exports.getByUser = async (req, res, next) => {
    const { id } = req.params;
    try {
        const bms = await Notification.find({user: id});
        await Notification.updateMany({unread: true, user: id}, {unread: false});
        req.io.sockets.emit(`notification ${id}`, id);
        res.status(200).json({notifications: bms});
    } catch (error) {
        res.status(500).json(error);
    }
}

exports.getQuantityByUser = async (req, res, next) => {
    const { id } = req.params;
    try {
        const bms = await Notification.find({user: id, unread: true});
        res.status(200).json({quantity: bms.length});
    } catch (error) {
        res.status(500).json(error);
    }
}

exports.deleteNoti = async (req, res, next) => {
    const { id } = req.params;
    try {
        await Notification.deleteOne({_id: id});
        res.status(200).json({messages: 'Delete successfully'});
    } catch (error) {  
        res.status(500).json({error});
    }
}
