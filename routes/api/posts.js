const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Post model
const Post = require('../../models/Post');
// Profile model
const Profile = require('../../models/Profile');

// Validation
const validatePostInput = require('../../validation/post');


/*######################################################
THIS IS FOR SETTING UP AMAZON S3
/*######################################################*/


//Adding a photo
const uuidv4 = require('uuid/v4');
const multer = require('multer');
const stream = require('stream');
const storage = multer.memoryStorage()
const upload = multer({storage: storage});
const fs = require('fs');
const parser = require('xml2json');

//controllers
const awsUploader = require('../../controllers/awsUpload.js');
const awsDeleter = require('../../controllers/awsDelete.js');
const googleMapsApi = require('../../controllers/googleMapsApi.js');


router.post('/uploads', upload.any(), awsUploader.doUpload);
router.post('/delete/uploads', awsDeleter.doDelete);
/*######################################################*/


// @route   GET api/posts
// @desc    Get posts
// @access  Public
router.get('/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ nopostsfound: 'No posts found' }));
});

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Public
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({ nopostfound: 'No post found with that ID' })
    );
});

// @route   POST api/posts
// @desc    Create post or update
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    //adding post
    const { errors, isValid } = validatePostInput(req.body);

     console.log('we here');
    console.log('images'+JSON.stringify(req.body.images));
    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id }).then(profile => {
  
    
      Post.findById(req.body.id).then(post => {
        if(post) {
          //post updatinf

          googleMapsApi.locationSearch(req.body.address, function(latlng) {
            const latitude = latlng.latitude;
            const longitude = latlng.longitude;

            var removedDisabledDates = [];
            var updatedDisabledDates = post.disabledDates;

            //find all the removed block dates from the post update
            for(var i = 0; i < post.blockedDates.length; i++) {

              if(!req.body.blockedDates.includes(post.blockedDates[i])){
                var tmp = {
                  to: post.blockedDates[i],
                  from: post.blockedDates[i],
                };
                removedDisabledDates.push(tmp);
              }
            }

            //add new blocked dates to disabledates of the post
            for(var i = 0; i < req.body.blockedDates.length; i++) {

              if(!post.disabledDates.includes(req.body.blockedDates[i])){
                var tmp = {
                  to: req.body.blockedDates[i],
                  from: req.body.blockedDates[i],
                };
                updatedDisabledDates.push(tmp);
              }
            }

            //remove any removed blocked dates with post updated, need 
            //to remove them from post disabled posts
            for(var i = 0; i < removedDisabledDates.length; i++) {
              for(var j = 0; j < post.disabledDates.length; j++) {
                if(updatedDisabledDates[j].to == removedDisabledDates[i].to && updatedDisabledDates[j].from == removedDisabledDates[i].from) {
                  updatedDisabledDates.splice(index, 1);
                }
              }
            }
   
            const updatePost = {};
           
            updatePost.title = req.body.title;
            updatePost.address = req.body.address;
            updatePost.text = req.body.text;
            updatePost.name = req.body.name;
            updatePost.rent = req.body.rent;
            updatePost.avatar = req.body.avatar;
            updatePost.user = req.user.id;
            updatePost.longitude = longitude;
            updatePost.latitude = latitude;
            updatePost.startDate = req.body.startDate;
            updatePost.endDate = req.body.endDate;
            updatePost.minimumStay = req.body.minimumStay;
            updatePost.bookedDates = req.body.bookedDates;
            updatePost.blockedDates = req.body.blockedDates;
            updatePost.disabledDates = updatedDisabledDates;


            var existingImages = req.body.images;

            if(req.body.deleteExistingImages) {
              for( var i = 0; i < req.body.deleteExistingImages.length; i++) {
                var url = req.body.deleteExistingImages[i];
                if(existingImages.includes(url))
                {
                  var index = existingImages.indexOf(url);
                  if(index > -1) {
                    existingImages.splice(index, 1);
                  }
                }
              }
            }

            updatePost.images = existingImages;

            Post.findOneAndUpdate(
              { _id: req.body.id },
              { $set: updatePost },
              { new: true }
            ).then(post => res.json(post));
          });
        } else {
          //creating a new post

          googleMapsApi.locationSearch(req.body.address, function(latlng) {
            const latitude = latlng.latitude;
            const longitude = latlng.longitude;

            if(latitude === null || longitude === null) {
              const errors = {};
              errors.address = "Needs to be a valid address";
              return res.status(400).json(errors);
            }

            var disable = [];
            for(var i = 0; i < req.body.blockedDates.length; i++) {

              var tmp = {
                to: req.body.blockedDates[i],
                from: req.body.blockedDates[i],
              };
              disable.push(tmp);
            }
           

            const newPost = new Post({
              title: req.body.title,
              address: req.body.address,
              text: req.body.text,
              name: req.body.name,
              rent: req.body.rent,
              avatar: req.body.avatar,
              profile: req.body.profile,
              user: req.user.id,
              latitude: latitude,
              longitude: longitude,
              images: req.body.images,
              startDate: req.body.startDate,
              endDate: req.body.endDate,
              minimumStay: req.body.minimumStay,
              bookedDates: req.body.bookedDates,
              blockedDates: req.body.blockedDates,
              disabledDates: disable
            });
        
            profile.posts.push(newPost._id);
          
            profile.save();
            newPost.save().then(post => {
              res.json(post);
             
            });
          });
        }
      })
    });
  }
);

// @route   DELETE api/posts/:id
// @desc    Delete post
// @access  Private
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // Check for post owner
          if (post.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: 'User not authorized' });
          }

          // Delete
          post.remove().then(() => res.json({ success: true }));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
    });
  }
);

// @route   POST api/posts/comment/:id
// @desc    Add comment to post
// @access  Private
router.post(
  '/comment/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    //const { errors, isValid } = validatePostInput(req.body);

    // Check Validation
    //if (!isValid) {
      // If any errors, send 400 with errors object
    //  return res.status(400).json(errors);
    //}

    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };

        // Add to comments array
        post.comments.unshift(newComment);

        // Save
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
  }
);


// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Remove comment from post
// @access  Private
router.delete(
  '/comment/:id/:comment_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        // Check to see if comment exists
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexists: 'Comment does not exist' });
        }

        // Get remove index
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);

        // Splice comment out of array
        post.comments.splice(removeIndex, 1);

        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
  }
);
module.exports = router;
