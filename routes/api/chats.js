const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const fetch = require("node-fetch");

// Post model
const Chat = require('../../models/Chat');
// Profile model
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// Validation
//const validatePostInput = require('../../validation/post');

/*######################################################*/


// @route   GET api/chats
// @desc    Get chats
// @access  Public
router.get('/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

  Chat.find()
    .sort({ date: 1 })
    .then(chats => {
      var newChats = chats.filter(chat => chat.user1 == req.user.id || req.user.id == chat.user2 );

      res.json(newChats);
    })
    .catch(err => res.status(404).json({ nochatsfound: 'No Chats found' }));
});


// @route   POST api/chat
// @desc    Create chat
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  
  (req, res) => {

    //will validate later maybe lol
    isValid = true
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json('bad chat');
    }

    req.user.chats.forEach(function(chat) {

      if(chat.user1 === req.user.id && chat.user2 === req.body.user2 || chat.user2 === req.user.id && chat.user1 === req.body.user2) {
        //set it to res.json(chat already...) so push.history happes in chat actions
        //there is no error, this just make sures the user doesn't already have
        //a chat open with the other user
        res.json();
      } else {
        const newChat = new Chat({
          user1: req.user.id,
          user2: req.body.user2,
          user1ProfilePic: req.body.user1ProfilePic,
          user2ProfilePic: req.body.user2ProfilePic,
          user1Name: req.body.user1Name,
          user2Name: req.body.user2Name,
          messages: []

          //No need to add date
        });

        const userChat = {
          chat: newChat._id,
          user1: req.user.id,
          user2: req.body.user2
        };

        //Add the chat info to each user respectively
        User.findById(req.user.id).then( user => {
          user.chats.push(userChat);
          user.save();
        });
        User.findById(req.body.user2).then( user => {
          user.chats.push(userChat);
          user.save();
        });

        newChat.save().then(chat => res.json(chat));
          }
        });
  }
);


// @route   POST api/chats/:id
// @desc    Add message to chat
// @access  Private
router.post(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {


    //probably dont need this will come back to
    var socket = req.app.get('socket');

    var reciever; 

    //seeing if the sender is equal to user1
    if(req.user.id == req.body.user1) {
      reciever = req.body.user2;
    } else {
      reciever = req.body.user1;
    }

    User.findById(reciever).then( user => {
      user.unreadMessages += 1;
      user.save();
    }).catch(err => res.status(404).json({ noUserFound: 'No User found' }));


    Chat.findById(req.params.id)
      .then(chat => {
        const newMessage = {
          content: req.body.content,
          sender: req.user.id,
        };
        chat.messages.push(newMessage);

        // Save
        chat.save().then(chat => res.json(chat));
      })
      .catch(err => res.status(404).json({ chatnotfound: 'No chat found' }));
  }
);

// @route   GET api/chats/:id
// @desc    Get chat by id
// @access  Public
router.get('/:id', (req, res) => {
  Chat.findById(req.params.id)
    .then(chat => {
      res.json(chat);
    })
    .catch(err =>
      res.status(404).json({ nochatfound: 'No chat found with that ID' })
    );
});


module.exports = router;