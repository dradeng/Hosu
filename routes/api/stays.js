const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const fetch = require("node-fetch");


//Sendgrid info
const SendGridApiKey = require('../../config/keys').SendGridApiKey;
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(SendGridApiKey);
const LocalOrHeroku = require('../../config/keys').LocalOrHeroku;


// Stay model
const Stay = require('../../models/Stay');
// Profile model
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// Validation
//const validatePostInput = require('../../validation/post');

/*######################################################*/


// @route   POST api/stays
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
    decided: false,
    startDate: req.body.startDate,
    endDate: req.body.endDate
  });

  User.findById(req.body.landlord)
    .then(landlord => {

      const requestURL = LocalOrHeroku;

      var htmlContent = (
       '<div>Someone has request to sublet your property! Log in to view the request <a target=_blank href=\"' + requestURL + '\">here</a>!</div>'
      );
      sgMail.send({
        to:       landlord.email,
        from:     'Support@Aveneu.com',
        subject:  'Request for subletting your property!',
        html:     htmlContent
        }, function(err, json) {
            if (err) { return console.error(err); }
      });
    });

  //ADD TRIP TO SUBTENTANT
  User.findById(req.body.subtenant)
    .then(subtenant => {
      subtenant.stays.push(stay._id);
      subtenant.save();
    })
    .catch(err => 
      res.status(404).json({ nosubtenantfound: 'No subtenant found with that profile id'})
    );

  //Add trip to landlords profile
  User.findById(req.body.landlord)
    .then(landlord => {
      landlord.stays.push(stay._id);
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


// @route   GET api/stays
// @desc    GET all stays pertaining to a user
// @access  Public
router.get('/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    Stay.find()
      .then(stays => {
        //var response = stays.filter(filteredStays => req.user.stays.includes(filteredStays._id));
       
        res.json(stays);
      });
});


// @route   POST api/stays/update
// @desc    POST update the stay info, mainly for approving
// @access  Public
router.post('/update',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    
    var updatedInfo = {
      decided: true,
      approved: req.body.approved
    };

    User.findById(req.body.subtenant)
    .then(subtenant => {
      const requestURL = LocalOrHeroku;
      var approved;
      var subjectContent

      if(req.body.approved) {
        approved = 'Your sublet request has been approved!';
        subjectContent = 'Sublet Request Approved';

        var bookedDate = {
          startDate: req.body.startDate,
          endDate: req.body.endDate
        };
        Post.findById(req.body.post).then( post => {
          post.bookedDates.push(bookedDate);
          post.save();
        });

      } else {
        approved = 'Your sublet request has been denied. Keep on looking!';
        subjectContent = 'Sublet Request Denied';
      }

      var htmlContent = (
       '<div>' + approved + '</div>'
      );
      sgMail.send({
        to:       subtenant.email,
        from:     'Support@Aveneu.com',
        subject:  subjectContent,
        html:     htmlContent
        }, function(err, json) {
            if (err) { return console.error(err); }
      });
    });


    Stay.findOneAndUpdate(
      { _id: req.body.id },
      { $set: updatedInfo },
      { new: true }
    ).then(stay => {
      Stay.find().then(stays => {
        res.json(stays)
      })
    })
    .catch(err => console.log(err));
});



module.exports = router;