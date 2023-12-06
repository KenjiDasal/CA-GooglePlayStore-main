const express = require('express');
const { JsonWebTokenError } = require('jsonwebtoken');
const app = express();
const port = 3200;
const cors = require('cors');
require('dotenv').config();
require('./config/db.js')();
const jwt = require('jsonwebtoken');

app.use(cors());

app.use(express.json());
app.set('view engine', 'html');
//Will make it excessable for clients
app.use(express.static(__dirname + '/views/'));

//Custom middleware
app.use((req, res, next) => {
  console.log(req.headers);
  let token = null;
  if (req.headers.authorization) {
    token = req.headers.authorization.split(' ');
  }
  console.log(token);
  if (token && token[0] === 'Bearer') {
    // verify token is valid
    jwt.verify(token[1], process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        req.user = undefined;
      }
      req.user = decoded;
      next();
    });
  } else {
    console.log('No token');
    req.user = undefined; //<------ this line
  }
  next(); //<------ this line
});

app.use((req, res, user, next) => {
  console.log(req, user);
  next();
});

app.use(express.static(__dirname + '/public/'));

app.use('/api/users', require('./routes/users.js'));
app.use('/api/genres', require('./routes/genres.js'));
app.use('/api/apps', require('./routes/apps.js'));

app.listen(port, () => {
  console.log(`Example App, listening on port: ${port}`);
});



