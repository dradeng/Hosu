const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const fetch = require("node-fetch");

// Stay model
const Stay = require('../../models/Stay');
// Profile model
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// Validation
//const validatePostInput = require('../../validation/post');

/*######################################################*/


// @route   GET api/stays
// @desc    add a stay
// @access  Public
router.post('/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

  //need some validaiton

  const stay = new Stay({
    post: req.body.post,
    subtenant: req.body.subtenant,
    landlord: req.body.landlord,
    approved: false,
    startDate: req.body.startDate,
    endDate: req.body.endDate
  });


  //ADD TRIP TO SUBTENTANT
  Profile.findById(req.body.subtenant)
    .then(subtenant => {
      subtenant.stays.push(stay);
      subtenant.save();
    })
    .catch(err => 
      res.status(404).json({ nosubtenantfound: 'No subtenant found with that profile id'})
    );

  //Add trip to landlords profile
  Profile.findById(req.body.landlord)
    .then(landlord => {
      landlord.stays.push(stay);
      landlord.save();
    })
    .catch(err => 
      res.status(404).json({ nolandlordfound: 'No landlord found with that profile id'})
    );

  stay.save().then(stay => res.json(stay))
    .catch(err => {
      res.status(404).json({ savingstay: 'Unable to save stay or error'})
    });
  
});


module.exports = router;