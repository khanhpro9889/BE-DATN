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
  profileImg: {
    type: String,
    default: null
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
  role: {
    type: String,
    default: 'user'
  },
  social: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Social',
    default: null
  },
  createAt: {
    type: Date,
    default: new Date()
  },
  updateAt: {
    type: Date,
    default: null
  }
})

const User = mongoose.model('User', UserSchema)
module.exports = User