const express = require('express');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require('../models/user');

const router = express.Router();

// Routes for signup and login should not be protected. Any user should be able to reach them
router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user
      .save()
      .then(result => {
        res.status(201).json({
          message: "User created!",
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  });
});

router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({
      email: req.body.email
    })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed"
        })
      }
      // User is valid in this then but not in the next one. Its required to store it
      fetchedUser = user;
      // Password is hashed in the database
      return bcrypt.compare(req.body.password, user.password)
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      const token = jwt.sign({
          email: fetchedUser,
          userId: fetchedUser
        },
        // works like a password, and can be defined as you want
        'secret_this_should_be_longer',
        // Configer token
        {
          // Allows to define the length. To check more information -> implementing SPA Authentication
          expiresIn: '1h',
        });
      res.status(200).json({
        token: token,
        expiresIn: 3600
      })
    }).catch(err => {
      return res.status(401).json({
        message: "Auth failed"
      });
    });
});

module.exports = router;
