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
// Post model
const Post = require('../../models/Post');
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

  //given post id, find the post of the landlords, then find the profile,
  //from there, we can get the landlords reviews and review sum
  //probably will change this later but oh well, its shitty
  Post.findById(req.body.post).then(post => {
    Profile.findById(post.profile).then(profile => {
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
        landlordReviewSum: profile.reviewSum,
        landlordNumReviews: profile.numReviews,
        subtenantName: req.user.name,
        subtenantImage: req.user.profilePic,
        subtenantProfile: req.body.subtenantProfile,
        subtenantReviewSum: req.body.subtenantReviewSum,
        subtenantNumReviews: req.body.subtenantNumReviews,
        blockedDates: [],
        bookedDates: []
      });

      User.findById(req.body.landlord).then(landlord => {

        const requestURL = LocalOrHeroku;

        var tmpS = new Date(req.body.startDate);
        var tmpE = new Date(req.body.endDate);

        var startDate = tmpS.toDateString(); 
        var endDate = tmpE.toDateString(); 

        sgMail.send({
          to:       landlord.email,
          from:     'Support@Aveneu.com',
          templateId: 'd-161d54d76797440d9ce713e2797334f5',
            substitutionWrappers: ['{{', '}}'], 
            dynamic_template_data: {
              subject:  'Request for subletting your property!',
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
        /*for(var i = 0; i < stays.length; i++) {
          if(stays[i].landlord === req.user.id || stay[s].subtenant === req.user.id)
          {
            filteredStays.push(stays[i]);
          }
        }*/
        var filteredStays = stays.filter(stay => stay.landlord === req.user.id || stay.subtenant === req.user.id);
        res.json(filteredStays);
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
    var approvedTest = true;

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
            console.log('backend failed1');
            approvedTest = false;
          
          }
        }
        
        for(var i = 0; i < post.bookedDates.length; i++)
        {

          var to = new Date(post.bookedDates[i].to);
          var from = new Date(post.bookedDates[i].from);

          //check if request overlaps end date
          if(startDate <= to && to <= endDate ){
            
            approvedTest = false;
          }
          //check if request overlaps start date
          if(startDate <= from && from <= endDate ){
            
            approvedTest = false;
         
          }
          //check if request is within a single booked date
          if(from <= startDate && endDate <= to){
            
            approvedTest = false;

           
          }
        }
        User.findById(req.body.subtenant).then(subtenant => {
          const requestURL = LocalOrHeroku;
          var approved;

          var tmpS = new Date(req.body.startDate);
          var tmpE = new Date(req.body.endDate);

          var startDate = tmpS.toDateString(); 
          var endDate = tmpE.toDateString(); 
          if(req.body.approved && approvedTest) {
          
            var bookedDate = {
              from: req.body.startDate,
              to: req.body.endDate
            };
            Post.findById(req.body.post).then( post => {
              post.bookedDates.push(bookedDate);
              post.disabledDates.push(bookedDate);
              post.save();
              //send approved email
              sgMail.send({
                to:       subtenant.email,
                from:     'Support@Aveneu.co',
                templateId: 'd-8f4fe275a8dc4db4af642ed1e1f055e9',
                dynamic_template_data: {
                  startDate: startDate,
                  endDate: endDate,
                  title: post.title,
                  imgSrc: post.images[0],
                  address: post.address,
                },
                }, function(err, json) {
                  if (err) { return console.error(err); }
              });
            });

          } else {
            Post.findById(req.body.post).then( post => {
            
              //send denied email
              sgMail.send({
                to:       subtenant.email,
                from:     'Support@Aveneu.co',
                templateId: 'd-4fa53b414d9d4848ac00a90914c72c36',
                dynamic_template_data: {
                  startDate: startDate,
                  endDate: endDate,
                  title: post.title,
                  imgSrc: post.images[0],
                },
                }, function(err, json) {
                  if (err) { console.error(err); }
              });
            });
          }
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
          //if landlord tries to approve request
        } else {
          var errors = {};
          errors.stay = 'Request was conflicted with another approved request. Please decline this request';
          errors.id = req.body.id;
          return res.status(400).json(errors);
        }
      });
    } else if(!req.body.approved){
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
        console.log('remove');
        stay.remove().then(stay => {
          Stay.find().then(stays => {
            res.json(stays)
          })
        })
      }); 
    } 
});


module.exports = router;