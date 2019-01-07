const express = require('express');
const request = require('request');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const SendGridApiKey = require('../../config/keys').SendGridApiKey;
const RecaptchaSiteKey = require('../../config/keys').RecaptchaSiteKey;
const RecaptchaSecretKey = require('../../config/keys').RecaptchaSecretKey;
const passport = require('passport');

// Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

//Sendgrid info
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(SendGridApiKey)

// Load User model
const User = require('../../models/User');

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));


// @route   POST api/users/updateUser
// @desc    Update user info
// @access  Public
router.post('/updateUser',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
  User.findById(req.user.id).then(user => {
    user.profile = true;
    user.save()
      .then(user => res.json(user))
        .catch(console.log('unable to send res.json(user)'));
  }).catch(console.log("no user found"));
});




// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = 'Email already exists';
      return res.status(400).json(errors);
    } else {

      console.log('we inside the req');

      if(req.body.profilePic.length < 1) {
        req.body.profilePic = "https://s3.us-east-2.amazonaws.com/aveneu/UserIcon.png";
      }

      // g-recaptcha-response is the key that browser will generate upon form submit.
      // if its blank or null means user has not selected the captcha, so return the error.
      if(req.body.recaptchaValue === undefined || req.body.recaptchaValue === '' || req.body.recaptchaValue === null) {
        console.log('we did not select the captcha');
        return res.json({"responseCode" : 1,"responseDesc" : "Please select captcha"});
      }
      // Put your secret key here.
      var secretKey = RecaptchaSecretKey;
      // req.connection.remoteAddress will provide IP address of connected user.
      var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body.recaptchaValue + "&remoteip=" + req.connection.remoteAddress;
      // Hitting GET request to the URL, Google will respond with success or error scenario.

      console.log('we right before request');


      request(verificationUrl,function(error,response,body) {
        body = JSON.parse(body);
        // Success will be true or false depending upon captcha validation.
        if(body.success !== undefined && !body.success) {
          console.log('we failed');
          return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
        }
        //res.json({"responseCode" : 0,"responseDesc" : "Sucess"});

        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          profilePic: req.body.profilePic,
          password: req.body.password,
        });

        const authenticationURL = 'google.com';

        sgMail.send({
          to:       req.body.email,
          from:     'Support@Aveneu.com',
          subject:  'Confirm your email with Aveneu!',
          html:     '<a target=_blank href=\"' + authenticationURL + '\">Confirm your email</a>'
          }, function(err, json) {
              if (err) { return console.error(err); }
          console.log(json);
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          });
        });
      });
    }
  });
});

// @route   GET api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check for user
    if (!user) {
      errors.email = 'User not found';
      return res.status(404).json(errors);
    }

    // Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User Matched
        const payload = { id: user.id, name: user.name, avatar: user.avatar, profilePic: user.profilePic, profile: user.profile }; // Create JWT Payload

        // Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token
            });
          }
        );
      } else {
        errors.password = 'Password incorrect';
        return res.status(400).json(errors);
      }
    });
  });
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    });
  }
);

module.exports = router;
