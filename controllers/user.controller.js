const User = require('../models/user.model.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = (req, res) => {
  let newUser = new User(req.body);
  newUser.password = bcrypt.hashSync(req.body.password, 10);

  let err = newUser.validateSync();

  if (err) {
    console.log(err);
    return res.status(400).json({});
  }

  newUser
    .save()
    .then((user) => {
      newUser.password = undefined;
      return res.status(201).json({
        msg: 'Hello',
      });
    })
    .catch((err) => {
      return res.status(400).json({
        msg: err,
      });
    });
};

const login = (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      //Check if passwords match
      console.log('Found'.user);
      if (!user || !user.comparePassword(req.body.password))
        return res.status(401).json({
          msg: 'Authentication failed. Invalid user or password',
        });
      let token = jwt.sign(//You can store the Role in the token
        { email: user.email, full_name: user.full_name, _id: user._id },
        `process.env.JWT_SECRET`
      );
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

const isAdmin = (req, res, next) => {
  if (req.admin) {
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
