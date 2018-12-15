const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ProfileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    avatar: {
        type: String,
        default: null,
    },
    location: {
        type: String
    },
    latitude: {
        type: Number,
        default: 34.05,
    },
    longitude: {
        type: Number,
        default: -118.644,
    },
    bio: {
        type: String
    },
    backgroundPic: {
        type: String,
        default: null,
    },
    posts: [String],
    favorites: [String],
    social: {
        youtube: {
            type: String
        },
        twitter: {
            type: String
        },
        facebook: {
            type: String
        },
        linkedin: {
            type: String
        },
        instagram: {
            type: String
        }
    },
    reviewSum: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            userName: {
                type: String,
                default: null
            },
            profilePic: {
                type: String,
                default: null
            },
            description: {
                type: String,
                default: null
            },
            rating: {
                type: Number,
                default: 5
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
