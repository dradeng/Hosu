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
  avatar: {
    type: String
  },
  profilePic: {
    type: String,
    default: null, //NEED TO CHANGE TO EMPTY AVATAR
  },
  date: {
    type: Date,
    default: Date.now
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
