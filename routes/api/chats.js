const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');


// Post model
const Chat = require('../../models/Chat');
// Profile model
const Profile = require('../../models/Profile');

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

    isValid = true
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json('bad chat');
    }

    const newChat = new Chat({
    	user1: req.user.id,
    	user2: req.body.user2,
      user1Name: req.body.user1Name,
      user2Name: req.body.user2Name,
    	messages: []

      //No need to add date
    });

    newChat.save().then(chat => res.json(chat));
  }
);


// @route   POST api/chats/:id
// @desc    Add message to chat
// @access  Private
router.post(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {


    var socket = req.app.get('socket');


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