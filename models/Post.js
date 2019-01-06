const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const fs = require('fs');
const multer = require('multer');

// Create Schema
const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  profile: {
    type: String,
    required: true
  },
  rent: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  startDate: {
    type: Date,
    default: null
  },
  endDate: {
    type: Date,
    default: null
  },
  avatar: {
    type: String
  },
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  images : [
    {
      type: String,
      required: true
    }
  ],
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      }
    }
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  bookedDates: [
    {
      startDate: {
        type: String,
        required: true
      },
      endDate: {
        type: String,
        required: true
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Post = mongoose.model('post', PostSchema);
