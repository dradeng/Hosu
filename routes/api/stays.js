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
    subtenant: req.user.id,
    landlord: req.body.landlord,
    approved: false,
    decided: false,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    landlordName: req.body.landlordName,
    landlordImage: req.body.landlordImage,
    landlordProfile: req.body.landlordProfile,
    subtenantName: req.user.name,
    subtenantImage: req.user.profilePic,
    subtenantProfile: req.body.subtenantProfile,
    blockedDates: [],
    bookedDates: []
  });

  User.findById(req.body.landlord)
    .then(landlord => {

      const requestURL = LocalOrHeroku;

      var tmpS = new Date(req.body.startDate);
      var tmpE = new Date(req.body.endDate);

      var startDate = tmpS.toDateString(); 
      var endDate = tmpE.toDateString(); 

      sgMail.send({
        to:       landlord.email,
        from:     'Support@Aveneu.com',
        subject:  'Request for subletting your property!',
        templateId: 'd-161d54d76797440d9ce713e2797334f5',
          substitutionWrappers: ['{{', '}}'], 
          dynamic_template_data: {
            startDate: startDate,
            endDate: endDate,
            address: req.body.address,
            imgSrc: req.body.imgSrc,
          },
        }, function(err, json) {
            if (err) { return console.error(err); }
      });
    }).catch(err => {
      console.log('No landlord found');
    });

  //ADD TRIP TO SUBTENTANT
  User.findById(req.user.id)
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
   
    var startDate = new Date(req.body.startDate);
    var endDate = new Date(req.body.endDate);
    var approvedTest = 'true';

    if(req.body.approved) {
      //sees if date is still available
      //just because its avail on the frontend when the user booked it
      //doesnt mean four hours later its still available when the landlord logs in
      //regardless of if he/she approves it
      Post.findById(req.body.post).then( post => {
   
        for(var i = 0; i < post.blockedDates.length; i++)
        {
          var blockedDate = new Date(post.blockedDates[i]);
         
          if(startDate <= blockedDate && blockedDate <= endDate ){
            approvedTest = false;
            return res.status(400).json('blocked date error in stay');
          }
        }
        
        for(var i = 0; i < post.bookedDates.length; i++)
        {

          var to = new Date(post.bookedDates[i].to);
          var from = new Date(post.bookedDates[i].from);

          //check if request overlaps end date
          if(startDate <= to && to <= endDate ){
            approvedTest = false;
            return res.status(400).json('booked date error in stay1');
          }
          //check if request overlaps any start date
          if(startDate <= from && from <= endDate ){
            approvedTest = false;
            return res.status(400).json('booked date error in stay2');
          }
          //check if request is within a single booked date
          if(to <= startDate && from <= endDate){
            approvedTest = false;
            return res.status(400).json('booked date error in stay3');
          }
        }

      });
    }

    User.findById(req.body.subtenant)
    .then(subtenant => {
      const requestURL = LocalOrHeroku;
      var approved;
      var subjectContent

      if(req.body.approved && approvedTest) {
        approved = 'Your sublet request has been approved!';
        subjectContent = 'Sublet Request Approved';

        console.log('we insdie the approved part 2');

        var bookedDate = {
          from: req.body.startDate,
          to: req.body.endDate
        };
        Post.findById(req.body.post).then( post => {
          post.bookedDates.push(bookedDate);
          post.disabledDates.push(bookedDate);
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


    var updatedInfo = {
      decided: true,
      approved: approvedTest
    };

    if(req.body.approved && approvedTest) {
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
    } else {

      Stay.findById(req.body.id).then( stay => {
        //remove from landlords list of stays
        User.findById(stay.landlord).then( landlord => {
          var stays = landlord.stays;
          var index = stays.indexOf(stay._id);
          if(index > -1) {
            stays = stays.splice(index, 1);
            landlord.stays = stays;
            landlord.save();
          }
        });
        //remove from subtenants list of stays
        User.findById(stay.subtenant).then( subtenant => {
          var stays = subtenant.stays;
          var index = stays.indexOf(stay._id);
          if(index > -1) {
            stays = stays.splice(index, 1);
            subtenant.stays = stays;
            subtenant.save();
          }
        });

        stay.remove().then(() => {
          Stay.find().then(stays => {
            res.json(stays);
          })
        });
      });
      
    }
});



module.exports = router;