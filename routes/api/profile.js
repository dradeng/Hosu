const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');


// Load Validation
const validateProfileInput = require('../../validation/profile');
const validateReviewInput = require('../../validation/review');

// Load Profile Model
const Profile = require('../../models/Profile');
// Load User Model
const User = require('../../models/User');

// @route   GET api/profile
// @desc    Get current users profile
// @access  Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      .populate('user', ['name', 'avatar'])
      .then(profile => {
        if (!profile) {
          errors.noprofile = 'There is no profile for this user getmethod';
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   GET api/profile/all
// @desc    Get all profiles
// @access  Public
// Not ever used
router.get('/all', (req, res) => {
  const errors = {};

  Profile.find()
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = 'There are no profiles';
        return res.status(404).json(errors);
      }

      res.json(profiles);
    })
    .catch(err => res.status(404).json({ profile: 'There are no profiles' }));
});

// @route   GET api/profile/:user_id
// @desc    Get profile by user ID
// @access  Public

router.get('/:id', (req, res) => {
  const errors = {};
  console.log(req.params.id);
  Profile.findById(req.params.id)
    .then(profile => {
      console.log(profile);
      res.json(profile);
    })
    .catch(err =>
      res.status(404).json({ noprofilefound: 'No profile found with that ID' })
    );
});

// @route   POST api/profile
// @desc    Create or edit user profile
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);
    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }
   
    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.avatar) profileFields.avatar = req.body.avatar;
    if (req.body.backgroundPic) profileFields.backgroundPic = req.body.backgroundPic;  
    // Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        // Update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        // Create
          // Save Profile
        new Profile(profileFields).save().then(profile => res.json(profile));
      }
    });
  }
);



// @route   POST api/profile/updateSearch
// @desc    updating location search
// @access  Private
router.post(
  '/updateSearch',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);
    // Check Validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        // Update

        var address = {
          latitude: req.body.latitude,
          longitude: req.body.longitude
        };


        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: address },
          { new: true }
        ).then(profile => res.json(profile));
    
      } else {
        console.log('NO USER FOUND FOR UPDATING SEARCH');
      }
    });
  }
);



// @route   POST api/profile/favorites/:userID
// @desc    Add favorite to profile or if already favorited removes it
// @access  Private
router.post(
    '/favorites/:userID',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
    
        Profile.findOne({ user: req.user.id }).then(profile => {
         
          const index = profile.favorites.indexOf(req.body.favorites);
          if (index >= 0) {
            
              profile.favorites.splice(index, 1);
            
              profile.save().then(profile => res.json(profile));
              
          } else {

            // Add favorite to favorites array
           
            profile.favorites.push(req.body.favorites);

            profile.save().then(profile => res.json(profile));
          }
      })
      .catch(err => res.status(404).json({ favoritenotfound: 'No favorite found' }));

    }
);

// @route   POST api/profile/reviews
// @desc    Add review to profile
// @access  Private
router.post(
    '/reviews',
    passport.authenticate('jwt', { session: false }),
    (req, res) => {
        const { errors, isValid } = validateReviewInput(req.body);
        // Check Validation
        if (!isValid) {
            // Return any errors with 400 status
            return res.status(400).json(errors);
        }
        Profile.findOne({ user: req.user.id }).then(profile => {
       
        
          const newReview = {
              profilePic: req.body.profilePic,
              userName: req.body.userName,
              description: req.body.description,
              rating: req.body.rating,
          };
          //add to reviews
          profile.numReviews += 1;
          profile.reviewSum += req.body.rating;
          profile.reviews.unshift(newReview);
     
          

           console.log('we meafe it');
           profile.save().then(profile => res.json(profile));
        })
        .catch(err => res.status(404).json(err));
    }
);

// @route   DELETE api/profile
// @desc    Delete user and profile
// @access  Private
router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() =>
        res.json({ success: true })
      );
    });
  }
);

module.exports = router;
