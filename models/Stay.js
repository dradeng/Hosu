const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const StaySchema = new Schema({
  post: {
    type: String,
    default: null
  },
  startDate: {
    type: Date,
    default: null,
  },
  endDate: {
    type: Date,
    default: null
  },
  landLord: {
    type: String,
    default: null
  },
  subtenant: {
    type: String,
    default: null
  },
  approved: {
    type: Boolean,
    default: false
  }
});

module.exports = Stay = mongoose.model('stays', StaySchema);