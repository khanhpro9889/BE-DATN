const User = require('../models/User');
const Social = require('../models/Social');
const Token = require('../models/Token');

const randomToken = require('random-token');
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const mail = require('../configs/mail');
const { request } = require('express');

const mailOptions = (to, content) => {
  return {
    from: 'giakhanh9890@gmail.com',
    to: to,
    subject: 'Verify account',
    text: content
  }
}

exports.ResendEmail = async (req, res, next) => {
  const { id } = req.body;
  try {
    const user = await User.findById(id);
    const newToken = randomToken(12);
    await Token.updateOne({uid: id, type: 'register'}, {token: newToken, createAt: new Date()});
    //send mail confirm
    const content = `Please click link: http://localhost:3000/verify?id=${user._id}&token=${newToken}&type=create}} to verify account
      In 15 minutes.
    `;
    const mailOtp = mailOptions(user.email, content);
  
    mail.sendMail(mailOtp, (err, info) => {
      if(err) {
        console.log(err)
        res.status(500).json(err);
      } else {
        return res.status(200).json({
          info: info,
          uid: id,
          message: "Waiting verify",
        });
      }
    });
  } catch (err) {
    console.log(err)
    return res.status(500).json(err);
  }
}

exports.signUp = async (req, res, next) => {
  const user = await User.find({ email: req.body.email });
  if (user.length >= 1) {
    return res.status(201).json({
      message: "Email exists",
    });
  } else {
    bcrypt.hash(req.body.password, 10, async (err, hash) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      } else {
        var userid = new mongoose.Types.ObjectId();
        const newUser = new User({
          _id: userid,
          name: req.body.name,
          password: hash,
          email: req.body.email,
          isVerified: false,
          createAt: new Date(),
          updateAt: null,
        });
        await newUser.save()
        const token = randomToken(12);
        const newToken = new Token({
          _id: new mongoose.Types.ObjectId(),
          token: token,
          uid: newUser._id,
          type: 'register',
          createAt: new Date()
        })
        await newToken.save();

        //send mail confirm
        const content = `Please click link: http://localhost:3000/verify?id=${newUser._id}&token=${newToken.token}&type=create}} to verify account
          In 15 minutes.
        `;
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
      }
    });
  }
};

exports.login = async (req, res, next) => {
  const user = await User.find({ email: req.body.email });
  if(user.length > 0) {
    bcrypt.compare(
      req.body.password,
      user[0].password,
      (err, result) => {
        if (err) {       
          return res.status(201).json({
            message: "Sai tên đăng nhập hoặc mật khẩu",
          });
        }
        if (result) {
          if (user[0].isVerified) {
            const token = jwt.sign(
              {
                userId: user[0]._id,
              },
              process.env.JWT_KEY || "Secrect",
              {
                expiresIn: "24h",
              }
            );
            return res.status(200).json({
              message: "Auth successful",
              token: token,
            });
          } else {
            return res.status(201).json({
              uid: user[0]._id,
              message: "Tài khoản chưa được xác nhận",
            });
          }
        } else {
          return res.status(201).json({
            message: "Sai tên đăng nhập hoặc mật khẩu",
          });
        }
    })
  } else {
    return res.status(201).json({
      success: false,
      message: "Sai tên đăng nhập hoặc mật khẩu",
    });
  }
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes*60000);
}

exports.verifyEmail = async (req, res, next) => {
  const { type, id, token } = req.body;
  try {
    if (type === 'create' && !!id && !!token) {
      const findedToken = await Token.find({token: token, uid: id, type: 'register'});
      if (findedToken) {
        const now = new Date();
        const newCreateAt = addMinutes(findedToken[0].createAt, 15);
        if (now.getTime() <= newCreateAt.getTime()) {
            await User.updateOne(
              { _id: findedToken[0].uid },
              { isVerified: true }
            )
            return res.status(200).json({message: "verify successfully"});
        } else {
          return res.status(500).json({message: "time's up", uid: findedToken[0].uid});
        }
      } else {
        return res.status(500).json({message: "No id"});
      }
    }
    return res.status(500).json({message: "No id"});
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}

exports.SocialLogin = async (req, res, next) => {
  var requestData = req.body;
  let socialType = requestData.socialType;
  try {
    var social = await Social.findOne({
      provider_uid: requestData.id,
      provider_name: socialType
    })
    if (!social) {
      const user = await User.find({email: requestData.email});
      if (user.length > 0) {
        return res.status(200).json({message: 'Email exists'});
      }
      // This social email account is not associate with any emails yet.
      const newUser = new User();
      newUser._id = new mongoose.Types.ObjectId();
      newUser.name = requestData.name;
      newUser.email = requestData.email || null;
      newUser.profileImg = requestData.profileImg;
      newUser.isVerified = true;
      newUser.createAt = new Date();
      await newUser.save();
      const newSocial = new Social({
        _id: new mongoose.Types.ObjectId(),
        provider_uid: requestData.id,
        provider_name: socialType,
        createAt: new Date()
      });
      await newSocial.save();
      await User.updateOne(
        { _id: newUser._id },
        { social: newSocial._id }
      )
      const token = jwt.sign(
        {
          userId: newUser._id,
        },
        process.env.JWT_KEY || "Secrect",
        {
          expiresIn: '24h',
        }
      );
      return res.status(200).json({
        message: "Auth successful",
        token: token,
      });
    } else {
      const user = await User.findOne({social: social._id});
      const token = jwt.sign(
        {
          userId: user._id,
        },
        process.env.JWT_KEY || "Secrect",
        {
          expiresIn: '24h',
        }
      );
      
      return res.status(200).json({
        message: "Auth successful",
        token: token,
      });
    }
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
}

exports.reset = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.find({ email: email});
    const filtered = user.filter(u => u.password !== null);
    const token = randomToken(12);
    const findedToken = await Token.find({uid: filtered[0]._id, type: 'reset'});
    if (findedToken[0]) {
      await Token.updateOne({_id: findedToken[0]._id}, {token: token, createAt: new Date()});
    } else {
      const newToken = new Token({
        _id: new mongoose.Types.ObjectId(),
        token: token,
        uid: filtered[0]._id,
        type: 'reset',
        createAt: new Date()
      })
      await newToken.save();
    }
    const content = `Please click link: http://localhost:3000/reset-2nd?token=${token}&uid=${filtered[0]._id}}} to start reset password in 15 minutes`;
    const mailOtp = mailOptions(email, content);
    mail.sendMail(mailOtp, (err, info) => {
      if(err) {
        console.log(err)
        res.status(500).json(err);
      } else {
        return res.status(200).json({
          info: info,
          uid: filtered[0]._id,
          message: "Waiting verify",
        });
      }
    });
  } catch (err) {
    console.log(err)
    return res.status(500).send(err)
  }
}

exports.reset2nd = async (req, res, next) => {
  const {id, password, token} = req.body;
  const findedToken = await Token.find({token: token, uid: id, type: 'reset'});
  const now = new Date();
  if (findedToken[0]) {
    if(now.getTime() < addMinutes(findedToken[0].createAt, 15)) {
      bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: err,
          });
        } else {
          await User.updateOne(
            { _id: findedToken[0].uid },
            { password: hash, updateAt: new Date() }
          )
          return res.status(200).json({message: 'Reset passwords successfuly'});
        }
      });
    } else {
      return res.status(201).json({message: 'Expired'});
    }
  } else {
    return res.status(201).json({message: 'Fail'});
  }
}