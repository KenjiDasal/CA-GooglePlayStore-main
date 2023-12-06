const express = require('express');
const router = express.Router();

const imageUpload = require('../config/imageUpload');

const { 
    readData, 
    readOne,
    createData,
    updateData,
    deleteData 
} = require('../controllers/app.controller');

router
    .get('/', readData)
    .get('/:id', readOne)
    .post('/', imageUpload.single('image'), createData)
    .put('/:id', imageUpload.single('image'), updateData)
    .delete('/:id', deleteData);

module.exports = router;