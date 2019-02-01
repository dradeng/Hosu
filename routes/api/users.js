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
const LocalOrHeroku = require('../../config/keys').LocalOrHeroku;
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
        .catch(console.log('unable to send res.json(user)')); //this always logs for some reason
        //wll come back to later
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

      request(verificationUrl,function(error,response,body) {
        body = JSON.parse(body);
        // Success will be true or false depending upon captcha validation.
        if(body.success !== undefined && !body.success) {
          console.log('we failed');
          return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
        }
        //res.json({"responseCode" : 0,"responseDesc" : "Sucess"});

        var lowerCaseEmail = req.body.email.toLowerCase();

        const newUser = new User({
          name: req.body.name,
          email: lowerCaseEmail,
          profilePic: req.body.profilePic,
          password: req.body.password,
          emailAuthenticated: false
        });

        const authenticationURL = LocalOrHeroku+"/verify-email/"+newUser._id;

        sgMail.send({
          to:       req.body.email,
          from:     'Support@Aveneu.co',
          subject:  'Confirm your email with Aveneu!',
          html:     '<a target=_blank href=\"' + authenticationURL + '\">Confirm your email</a>'
          }, function(err, json) {
              if (err) { return console.error(err); }

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

// @route   GET api/users/verify-email
// @desc    Verify user's email confirmation
// @access  Public
router.get('/verify-email/:id', (req, res) => {


  User.findById(req.params.id)
    .then(user => {


      if (!user) {
        return res.status(404).json('User is not found');
      }

      user.emailAuthenticated = true;
      user.save(function (err) {
        if (err) {
          return console.error(err);
        }

        res.send(user);
      });

      sgMail.send({
        to:       user.email,
        from:     'Support@Aveneu.co',
        subject:  'Email confirmed!',
        html:     'Awesome! We can now send you kick-ass emails'
        }, function(err, json) {
            if (err) { return console.error(err); }
        console.log(json);
      });
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

  const email = req.body.email.toLowerCase();
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check for user
    if (!user) {
      errors.email = 'User not found';
      return res.status(404).json(errors);
    }
    if(!user.emailAuthenticated) {
      errors.email = 'Email needs to confirmed';
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
