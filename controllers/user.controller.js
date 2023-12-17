const User = require('../models/user.model.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = (req, res) => {
  //Create new user
  let newUser = new User(req.body);
  //hash password
  newUser.password = bcrypt.hashSync(req.body.password, 10);
  //validate user
  let err = newUser.validateSync();
  //If error though 400 response
  if (err) {
    console.log(err);
    return res.status(400).json({
      msg: 'Missing field',
    });
  }

  newUser
    .save()
    .then((user) => {
      newUser.password = undefined;
      return res.status(201).json({
        msg: 'You have been added as a user',
      });
    })
    .catch((err) => {
      return res.status(400).json({
        msg: err,
      });
    });
};

const login = (req, res) => {
  //Find a matching email in DB
  User.findOne({ email: req.body.email })
    .then((user) => {
      //print user info
      console.log('Found', user);
      //Checks if password matches
      if (!user || !user.comparePassword(req.body.password))
        return res.status(401).json({
          msg: 'Authentication failed. Invalid user or password',
        });
      let token = jwt.sign(
        { email: user.email, full_name: user.full_name, _id: user._id },
        process.env.JWT_SECRET
      );
      console.log('Generated Token:', token);

      return res.status(200).json({ token });
    })
    .catch((err) => {
      return res.status(400).json({
        msg: err,
      });
    });
};

const loginRequired = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    return res.status(401).json({
      msg: 'Unauthorized user',
    });
  }
};
const profile = (req, res) => {};
module.exports = {
  register,
  login,
  profile,
  loginRequired,
};