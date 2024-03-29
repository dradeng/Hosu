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
  emailAuthenticated : {
    type: Boolean,
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
    default: "https://aveneudev.s3.us-east-2.amazonaws.com/UserIcon.png",
  },
  unreadMessages: {
    type: Number,
    default: 0
  },
  stays: [String],
  chats: [
    {
      //chat containes the chat id, the _id in user chats does not matter or have significance
      chat: {
        type: Schema.Types.ObjectId,
        ref: 'chats'
      },
      user1: {
        type: String,
        required: true
      },
      user2: {
        type: String,
        required: true
      }
    }
  ]
});

module.exports = User = mongoose.model('users', UserSchema);
