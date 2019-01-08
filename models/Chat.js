const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ChatSchema = new Schema({
  user1: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  user2: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  user1ProfilePic: {
    type: String,
  },
  user2ProfilePic: {
    type: String,
  },
  user1Name: {
    type: String,
    required: true
  },
  user2Name: {
    type: String,
    required: true
  },
  messages: [
    {
      content: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        default: Date.now
      },
      sender: {
        type: String,
        required: true
      },
      //read by the reciever only
      read: {
        type: Boolean,
        default: false
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Message = mongoose.model('chats', ChatSchema);
