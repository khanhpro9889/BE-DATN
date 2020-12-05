const Gym = require('../models/Gym');
const mongoose = require("mongoose");
const User = require('../models/User');
const District = require("../models/District");
const Utility = require("../models/Utility");
const Review = require("../models/Review");
const Province = require("../models/Province");
const Reply = require("../models/Reply");
const Conversation = require("../models/Conversation");
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const Save = require('../models/Save');
const Token = require('../models/Token');
const mail = require('../configs/mail');
const BoxMessage = require('../models/BoxMessage');

const mailOptions = (to, content) => {
  return {
    from: 'giakhanh9890@gmail.com',
    to: to,
    subject: 'Delete Gym',
    text: content
  }
}

exports.getAllGym = async (req, res, next) => {
    const { approve, complete } = req.query;
    var listReviews = [];
    try {
        var gyms = [];
        if (approve) {
            gyms = await Gym.find({approve: approve, complete: complete}).skip()
            .populate({ path: 'addresses.district', model: District });
        } else {
            gyms = await Gym.find()
            .populate({ path: 'addresses.district', model: District });
        }
        for(g of gyms) {
            const reviews = await Review.find({gym: g._id})
            listReviews.push(reviews)
        }
        const newGyms = gyms.map((item, index) => {
            return {
                ...item,
                reviews: listReviews[index]
            }
        })
        res.status(200).json({gym: newGyms});
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}

exports.getTopRatingGym = async (req, res, next) => {
    var listReviews = [];
    try {
        const gyms = await Gym.find({approve: true})
        .populate({ path: 'addresses.district', model: District });
        for(g of gyms) {
            const reviews = await Review.find({gym: g._id})
            listReviews.push(reviews)
        }
        const newGyms = gyms.map((item, index) => {
            return {
                ...item,
                reviews: listReviews[index]
            }
        })
        const afterSort = newGyms.map(item => {
            return {
                ...item._doc,
                reviews: item.reviews
            }
        }).sort((a, b) => {
            const averageA = (a.reviews.length > 0 ? a.reviews.reduce((sum, item) => {
                return sum + item.rating;
            }, 0) / a.reviews.length : 0)
            const averageB = (b.reviews.length > 0 ? b.reviews.reduce((sum, item) => {
                return sum + item.rating;
            }, 0) / b.reviews.length : 0)
            if (averageB > averageA) {
                return 1;
            }
            if (averageA > averageB) {
                return -1;
            }
            if (averageA === averageB) {
                return 0;
            }
        })
        var final = [];
        for (const [index, a] of afterSort.entries()) {
            if (index < 5) {
                final.push(a);
            }
        }
        res.status(200).json({gym: final});
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}

exports.getNewestGym = async (req, res, next) => {
    var listReviews = [];
    try {
        const gyms = await Gym.find({approve: true}).limit(5).sort({$natural: -1})
        .populate({ path: 'addresses.district', model: District });
        const finalGyms = gyms.sort((a, b) => new Date(a.createAt).getTime() - new Date(b.createAt).getTime());
        for(g of finalGyms) {
            const reviews = await Review.find({gym: g._id})
            listReviews.push(reviews)
        }
        const newGyms = finalGyms.map((item, index) => {
            return {
                ...item,
                reviews: listReviews[index]
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
    var listReviews = [];
    try {
        const gyms = await Gym.find({createBy: uid})
        .populate({ path: 'addresses.district', model: District })
        .populate({ path: 'utilities.utility', model: Utility });
        for(g of gyms) {
            const reviews = await Review.find({gym: g._id})
            listReviews.push(reviews)
        }
        const newGyms = await gyms.map((item, index) => {
            return {
                ...item,
                reviews: listReviews[index]
            }
        })
        res.status(200).json({gyms: newGyms});
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}
//content, title, address, province, district, , phone, facebook, services, utilities
exports.addGym = async (req, res, next) => {
    const {uid} = req.body;
    // const newUtil = JSON.parse(utilities).map(item => {
    //     return {
    //         utility: item
    //     }
    // })
    // const files = req.files;
    // const paths = files.map(item => {
    //     return {
    //         path: `http://localhost:3001/uploads/${item.filename}`
    //     }
    // })
    const newGym = new Gym({
        _id: new mongoose.Types.ObjectId(),
        createAt: new Date(),
        createBy: uid
    })
    try {
        await newGym.save();
        // for(const s of JSON.parse(services)) {
        //     const newService = new Service({
        //         _id: new mongoose.Types.ObjectId(),
        //         name: s.name,
        //         description: s.description,
        //         gym: newGym._id,
        //         price: s.price,
        //         unitPricing: s.unitPricing,
        //         createAt: new Date()
        //     })
        //     await newService.save();
        // }
        res.status(200).json({_id: newGym._id});
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}

function random4Digits() {
    return Math.floor(1000 + Math.random() * 9000);
}

exports.deleteGym1st = async (req, res, next) => {
    const { id } = req.params;
    const token = random4Digits();
    try {
        const finded = await Token.find({uid: id, type: 'delete'});
        if (finded[0]) {
            await Token.updateOne({_id: finded[0]._id}, {createAt: new Date(), token: token});
        } else {
            const newToken = new Token({
                _id: new mongoose.Types.ObjectId(),
                uid: id,
                type: 'delete',
                token: token,
                createAt: new Date()
            })
            await newToken.save();
        }
        const content = `Mật mã để xóa phòng gym là: ${token} (Mật mã có thời hạn 15 phút)`;
        const mailOtp = mailOptions(req.body.email, content);
        
        mail.sendMail(mailOtp, (err, info) => {
          if(err) {
            console.log(err)
            res.status(500).json(err);
          } else {
            res.status(200).json({
              info: info,
              uid: newUser._id,
              message: "Waiting verify",
            });
          }
        });
        res.status(200).json({message: 'Waiting verify'});
    } catch (error) {
        res.status(500).json(error);
    }
}

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
}

exports.deleteGym2nd = async (req, res, next) => {
    const { id } = req.params;
    const { token } = req.body;
    try {
        const tokens = await Token.find({token: token, uid: id, type: 'delete'});
        if (tokens[0]) {
            const now = new Date();
            const newCreateAt = addMinutes(tokens[0].createAt, 15);
            if (now.getTime() <= newCreateAt.getTime()) {
                await Gym.deleteOne({_id: id});
                const reviews = await Review.find({gym: id});
                for(r of reviews) {
                    await Reply.deleteMany({review: r._id});
                }
                await Review.deleteMany({gym: id});
                const conversations = await Conversation.find({gym: id});
                for(c of conversations) {
                    await Message.deleteMany({conversation: c._id});
                }
                await Conversation.deleteMany({gym: id});
                await Save.deleteMany({gym: id});
                await BoxMessage.deleteMany({gym: id});
                res.status(200).json({messages: 'Delete successfully'});
            } else {
                return res.status(500).json({messages: "time's up"});
            }
        } else {
            res.status(500).json({messages: 'Fail'});
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({error});
    }
}

exports.deleteGym = async (req, res, next) => {
    const { id } = req.params;
    try {
        await Gym.deleteOne({_id: id});
        const reviews = await Review.find({gym: id});
        for(r of reviews) {
            await Reply.deleteMany({review: r._id});
        }
        await Review.deleteMany({gym: id});
        const conversations = await Conversation.find({gym: id});
        for(c of conversations) {
            await Message.deleteMany({conversation: c._id});
        }
        await Conversation.deleteMany({gym: id});
        await Save.deleteMany({gym: id});
        await BoxMessage.deleteMany({gym: id});
        res.status(200).json({messages: 'Delete successfully'});
    } catch (error) {  
        res.status(500).json({error});
    }
}

function getWeekNumber(d) {
    // Copy date so don't modify original
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    // Get first day of year
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    // Return array of year and week number
    return [d.getUTCFullYear(), weekNo];
}

exports.getGymDetail = async (req, res, next) => {
    const { id } = req.params;
    try {
        const gym = await Gym.findById(id)
        .populate({ path: 'createBy', model: User })
        .populate({ path: 'addresses.province', model: Province})
        .populate({ path: 'addresses.district', model: District})
        .populate({ path: 'utilities.utility', model: Utility});
        const currentWeek = getWeekNumber(new Date());
        if (currentWeek[1] === gym.weekViews.view.week) {
            await Gym.updateOne({_id: id}, {
                totalViews: gym.totalViews + 1,
                weekViews: {view: {
                    week: currentWeek[1],
                    quantity: gym.weekViews.view.quantity + 1
                }}
            })
        } else {
            await Gym.updateOne({_id: id}, {
                totalViews: gym.totalViews + 1,
                weekViews: {view: {
                    week: currentWeek[1],
                    quantity: 0
                }}
            })
        }
        res.status(200).json({gym: gym});
    } catch (error) {  
        console.log(error)
        res.status(500).json({error});
    }
}

exports.getTopWeek = async (req, res, next) => {
    var listReviews = [];
    try {
        const week = getWeekNumber(new Date());
        const gyms = await Gym.find({approve: true, 'weekViews.view.week': week[1]}).limit(5).sort({'weekViews.view.quantity': -1})
        .populate({ path: 'addresses.district', model: District });
        for(g of gyms) {
            const reviews = await Review.find({gym: g._id})
            listReviews.push(reviews)
        }
        const newGyms = gyms.map((item, index) => {
            return {
                ...item,
                reviews: listReviews[index]
            }
        })
        res.status(200).json({gym: newGyms});
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}

exports.getGymDetailToUpdate = async (req, res, next) => {
    const { id } = req.params;
    try {
        const gym = await Gym.findById(id)
        .populate({ path: 'createBy', model: User })
        .populate({ path: 'addresses.province', model: Province})
        .populate({ path: 'addresses.district', model: District})
        res.status(200).json({gym: gym});
    } catch (error) {  
        console.log(error)
        res.status(500).json({error});
    }
}

exports.approveGym = async (req, res, next) => {
    const {id} = req.params;
    const {approve, user} = req.body;
    try {
        await Gym.updateOne({_id: id}, {
            approve: approve
        });
        const findedNoti = await Notification.find({user: user, type: 3, unread: true});
        var newNoti;
        if (findedNoti.length > 0) {
            await Notification.updateOne({_id: findedNoti[0]._id}, {
                gym: id,
                user: user,
                type: 3,
                quantity: findedNoti[0].quantity + 1,
                unread: true,
                createAt: new Date()
            })
            req.io.sockets.emit(`notification ${user}`, user);
        } else {
            newNoti = new Notification({
                _id: new mongoose.Types.ObjectId(),
                gym: id,
                user: user,
                type: 3,
                quantity: 1,
                unread: true,
                createAt: new Date()
            })
            await newNoti.save();
            req.io.sockets.emit(`notification ${user}`, user);
        }
        res.status(200).json({_id: id});
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }                 
}

exports.updateGym = async (req, res, next) => {
    const {id} = req.params;
    const {content, title, addresses, facebooks, phones, services, utilities, times, holiday, gallery, complete, approve} = req.body;
    try {
        await Gym.updateOne({_id: id}, {
            title: title || null,
            content: content || null,
            addresses: addresses || {province: null, district: null, lat: null, lng: null, addresses: null},
            facebooks: facebooks || [],
            phones: phones || [],
            utilities: utilities || [],
            gallery: gallery || [],
            times: times || [],
            holiday: holiday || false,
            services: services || [],
            complete: complete || false,
            updateAt: new Date()
        });
        if (complete && !approve) {
            const admins = await User.find({role: 'admin'});
            for (const a of admins) {
                const newNoti = new Notification({
                    _id: new mongoose.Types.ObjectId(),
                    gym: id,
                    user: a._id,
                    type: 4,
                    quantity: 1,
                    unread: true,
                    createAt: new Date()
                })
                await newNoti.save();
                req.io.sockets.emit(`notification ${a._id}`, a._id);
            }
        }
        res.status(200).json({_id: id});
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }                 
}

exports.updateGymFormData = async (req, res, next) => {
    const {id} = req.params;
    const {content, title, addresses, webs, phones, services, utilities, times, holiday, images} = req.body;
    const nAddresses = JSON.parse(addresses);
    const nWebs = JSON.parse(webs);
    const nPhones = JSON.parse(phones);
    const nServices = JSON.parse(services);
    const nTimes = JSON.parse(times);
    const nUtilities = JSON.parse(utilities);
    const nImages = JSON.parse(images);
    var paths = [];
    if (req.files !== undefined) {
        const files = req.files;
        paths = files.map(item => {
            return {
                path: `http://localhost:3001/uploads/${item.filename}`,
            }
        })
    }  
    newPaths = paths.concat(nImages);
    try {
        await Gym.updateOne({_id: id}, {
            title: title || null,
            content: content || null,
            addresses: nAddresses || [],
            facebooks: nWebs || [],
            phones: nPhones || [],
            utilities: nUtilities || [],
            gallery: req.files ? newPaths : nImages,
            times: nTimes || [],
            holiday: holiday || false,
            services: nServices || [],
            updateAt: new Date()
        });
        res.status(200).json({_id: id});
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }                 
}

exports.getQuantityDHH = async (req, res, next) => {
    var hn = 0;
    var hcm = 0;
    var dn = 0;
    try {
        const gyms = await Gym.find({approve: true}).populate({ path: 'addresses.province', model: Province });
        for (g of gyms) {
            if (g.addresses.province.code === '48') {
                dn = dn + 1;
            }
            if (g.addresses.province.code === '01') {
                hn = hn + 1;
            }
            if (g.addresses.province.code === '79') {
                hcm = hcm + 1;
            }
        }
        res.status(200).json({hn: hn, hcm: hcm, dn: dn})
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}

exports.search = async (req, res, next) => {
    const perPage = 7;
    const { search, province, district, page} = req.query;
    const listReviews = [];
    try {
        const findedGyms = await Gym.find({approve: true})
        .populate({ path: 'addresses.district', model: District })
        .populate({ path: 'addresses.province', model: Province });
        for(g of findedGyms) {
            const reviews = await Review.find({gym: g._id})
            listReviews.push(reviews)
        }
        const newGyms = findedGyms.map((item, index) => {
            return {
                ...item,
                reviews: listReviews[index]
            }
        }).map(item => {
            return {
                ...item._doc,
                reviews: item.reviews
            }
        })
        var temp = newGyms;
        if (search) {
            const finals1 = temp.filter(item => {
                if (item.title.toUpperCase().match(search.toUpperCase()) 
                    || item.title.replace(/ /g, '').toUpperCase().match(search.replace(/ /g, '').toUpperCase())) {
                    return true;
                }
                return false;
            })
            const finals2 = temp.filter(item => {
                for (s of item.services) {
                    if (s.name.toUpperCase().match(search.toUpperCase())) {
                        return true;
                    }
                }
                return false;
            })
            temp = finals1.concat(finals2);
            temp = temp.sort((a, b) => a.title.toUpperCase() > b.title.toUpperCase());
            temp = temp.filter((item, index, arr) => {
                if (index > 0) {
                    if (item._id.toString() === arr[index - 1]._id.toString()) {
                        return;
                    }
                }
                return item;
            })
        }
        if (province !== '-1' && district === '-1') {
            temp = temp.filter(item => item.addresses.province.code === province);
        }
        if (district !== '-1') {
            temp = temp.filter(item => item.addresses.district.code === district);
        }
        totalPage = Math.ceil(temp.length / perPage);
        const start = page ? (page - 1) * perPage : 0;
        const end = page ? (page - 1) * perPage + perPage : perPage;
        temp = temp.slice(start, end);
        res.status(200).json({gyms: temp, totalPage: totalPage, currentPage: parseInt(page) || 1, totalGym: findedGyms.length});
    } catch (error) {
        console.log(error)
    }
}