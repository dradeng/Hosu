const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ProfileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    name: {
        type: String,
        required: true
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
        default: 38.037173,
    },
    longitude: {
        type: Number,
        default: -78.497807,
    },
    bio: {
        type: String
    },
    backgroundPic: {
        type: String,
        default: "https://s3.us-east-2.amazonaws.com/aveneu/DefaultBackgroundPicture.jpg",
    },
    posts: [String],
    favorites: [String],
    social: {
        youtube: {
            type: String,
            default: null
        },
        twitter: {
            type: String,
            default: null
        },
        facebook: {
            type: String,
            default: null
        },
        linkedin: {
            type: String,
            default: null
        },
        instagram: {
            type: String,
            default: null
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
    university: {
        type: String,
    },
    age: {
        type: Number
    },
    interests: {
        type: String
    },
    study: {
        type: String
    },
    job: {
        type: String
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
    latLongError: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
