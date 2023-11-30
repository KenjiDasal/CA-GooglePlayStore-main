const express = require('express');
const router = express.Router();

const imgUpload = require('../config/imgUpload.js');

const {
  readData,
  readOne,
  createData,
  updateData,
  deleteData,
} = require('../controllers/app.controller.js');

router
  .get('/', readData)
  .get('/:id', readOne)
  .post('/', imgUpload.single('img'), createData)
  .put('/:id', imgUpload.single('img'), updateData)
  .delete('/:id', deleteData);

module.exports = router;
