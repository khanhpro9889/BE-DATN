const Gym = require('../models/Gym');
const mongoose = require("mongoose");
const User = require('../models/User');
const Service = require("../models/Service");
const District = require("../models/District");
const Utility = require("../models/Utility");

exports.getAllGym = async (req, res, next) => {
    var listService = [];
    try {
        const gyms = await Gym.find()
        .populate({ path: 'district', model: District });
        for(g of gyms) {
            const services = await Service.find({gym: g._id});
            listService.push(services);
        }
        const newGyms = await gyms.map((item, index) => {
            return {
                ...item,
                services: listService[index]
            }
        })
        res.status(200).json({gym: newGyms});
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}

exports.getAllGymByUser = async (req, res, next) => {
    const { uid } = req.params;
    try {
        const Gyms = await Gym.find({createBy: uid})
        .populate({ path: 'createBy', model: User })
        .populate({ path: 'district', model: District });
        res.status(200).json({gyms: Gyms});
    } catch (error) {
        res.status(500).json(error);
    }
}

exports.addGym = async (req, res, next) => {
    const {content, title, address, province, district, uid, phone, facebook, services, utilities} = req.body;
    const newUtil = JSON.parse(utilities).map(item => {
        return {
            utility: item
        }
    })
    const files = req.files;
    const paths = files.map(item => {
        return {
            path: `http://localhost:3001/uploads/${item.filename}`
        }
    })
    const newGym = new Gym({
        _id: new mongoose.Types.ObjectId(),
        content,
        province,
        district,
        address,
        phone,
        facebook,
        title,
        utilities: newUtil,
        gallery: paths,
        createAt: new Date(),
        createBy: uid
    })
    try {
        await newGym.save();
        for(const s of JSON.parse(services)) {
            const newService = new Service({
                _id: new mongoose.Types.ObjectId(),
                name: s.name,
                description: s.description,
                gym: newGym._id,
                price: s.price,
                unitPricing: s.unitPricing,
                createAt: new Date()
            })
            await newService.save();
        }
        res.status(200).json({gym: newGym});
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}

exports.deleteGym = async (req, res, next) => {
    const { id } = req.params;
    try {
        await Gym.deleteOne({_id: id});
        await Service.deleteMany({gym: id});
        res.status(200).json({messages: 'Delete successfully'});
    } catch (error) {  
        res.status(500).json({error});
    }
}

exports.getGymDetail = async (req, res, next) => {
    const { id } = req.params;
    try {
        const gym = await Gym.findById(id)
        .populate({ path: 'createBy', model: User })
        .populate({ path: 'district', model: District })
        .populate({ path: 'utilities.utility', model: Utility});
        const services = await Service.find({gym: id});
        res.status(200).json({gym: gym, services: services});
    } catch (error) {  
        res.status(500).json({error});
    }
}