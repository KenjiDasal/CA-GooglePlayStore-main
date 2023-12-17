const express = require('express');
const router = express.Router();
const {
  profile,
  register,
  login,
} = require('../controllers/user.controller.js');

//The same as the other routes. Just the users can only have port requests
router.post('/', profile).post('/register', register).post('/login', login);

module.exports = router;