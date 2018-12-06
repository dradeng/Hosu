const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ProfileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    location: {
        type: String
    },
    bio: {
        type: String
    },
    profilePic: {
        type: String,
        default: null,
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
            title: {
                type: String,
                required: true
            },
            reviewer: {
                type: String,
                required: true
            },
            description: {
                type: String
            },
            target: {
                type: String
            },
            rating: {
                type: Number,
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            },
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
