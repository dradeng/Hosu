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
  date: {
    type: Date,
    default: Date.now
  },
  profilePic: {
    type: String,
    default: null,
  },
  profile: {
    type: Boolean,
    default: false
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
