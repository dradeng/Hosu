const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  latitude: {
    type: Number,
    default: 34.05,
  },
  longitude: {
    type: Number,
    default: -118.644,
  },
  date: {
    type: Date,
    default: Date.now
  },
  profilePic: {
    type: String,
    default: null,
  },
  profile: {
    type: Schema.Types.ObjectId,
    ref: 'profile',
    default: null
  },
  chats: [
    {
      chat: {
        type: Schema.Types.ObjectId,
        ref: 'chats'
      },
      
    }
  ]
});

module.exports = User = mongoose.model('users', UserSchema);
