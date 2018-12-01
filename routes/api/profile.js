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
          errors.noprofile = 'There is no profile for this user';
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

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public

router.get('/user/:user_id', (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.params.user_id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err =>
      res.status(404).json({ profile: 'There is no profile for this user' })
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
            
              // Splice out of array
              console.log(profile.favorites);
              
              
              profile.favorites.splice(index, 1);
              console.log(profile.favorites);
              profile.save().then(profile => res.json(profile));
              
          } else {

            // Add favorite to favorites array
           
            profile.favorites.push(req.body.favorites);
            //console.log(profile.favorites);
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
        Profile.findOne({ user: req.body.target }).then(profile => {
            const newReview = {
                title: req.body.title,
                reviewer: req.user.id,
                description: req.body.description,
                rating: req.body.rating,
                date: Date.now(),
            };
            // Add to exp array
           profile.reviews.unshift(newReview);

           profile.save().then(profile => res.json(profile));
        });
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
