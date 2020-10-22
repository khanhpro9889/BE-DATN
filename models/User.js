const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
      type: String
  },
  email: {
      type: String,
      lowercase: true,
      default: null
  },
  password: {
      type: String,
      default: null
  },
  isVerified: {
    type: Boolean,
    default: null
  },
  phone: {
    type: String,
    default: null
  },
  isHidden: {
    type: Boolean
  },
  profileImg: {
    type: String,
    default: "images/avatar.npg"
  },
  work: {
    type: String,
    default: null
  },
  about: {
    type: String,
    default: null
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Province'
  },
  reset: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Token',
    default: null
  },
  social: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Social',
    default: null
  },
  createAt: {
    type: Date
  },
  updateAt: {
    type: Date,
    default: null
  }
})

const User = mongoose.model('User', UserSchema)
module.exports = User