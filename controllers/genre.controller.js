const express = require('express');
const Genre = require('../models/genre.model');

const readData = (req, res) => {
  Genre.find({})
    .then((data) => {
      console.log(data);
      if (data.length > 0) {
        res.status(200).json(data);
      } else {
        res.status(404).json(`Non Found`);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
};

const readOne = (req, res) => {
  let id = req.params.id;

  Genre.findById(id)
    .then((data) => {
      if (!data) {
        res.status(404).json({ msg: `Genre with id${id}, not found` });
      } else {
        res.status(200).json(data);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).json({ msg: `Genre with id${id}, not found` });
      } else {
        console.log(err);
        res.status(500).json(err);
      }
    });
};

const createData = (req, res) => {
  console.log(req.body);
  let inputData = req.body;
  //Track.find({customer_id: req.user.id})
  Genre.create(inputData)
    .then((data) => {
      console.log(`New Genre created`, data);
      res.status(201).json(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(422).json(err);
      } else {
        console.log(err);
        res.status(500).json(err);
      }
    });
};

const updateData = (req, res) => {
  let data = req.body;
  let id = req.params.id;
  Genre.findByIdAndUpdate(id, data, {
    //After find a Genre by Id. This option will give us the new data.
    new: true,
  })
  .then(newData => {
    res.status(201).json(newData);
})
.catch(err => {
    if(err.name === 'ValidationError'){
        res.status(422).json(err);
    }
    else if(err.name === 'CastError'){
        res.status(404).json({ msg: `Festival ${id} not found!`});
    }
    else {
        console.error(err);
        res.status(500).json(err);
    }
});
};

const deleteData = (req, res) => {
  //Update database
  //Check if Genre exists
  //delete Genre
  let id = req.params.id;
  Genre.findByIdAndDelete(id)
    .then((newData) => {
      if (!newData) {
        res.status(404).json({ msg: `Genre with id${id}, not found` });
      } else {
        res.status(200).json({
          msg: `Genre with id${id} deleted.`,
        });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).json({ msg: `Genre with id${id}, not found` });
      } else {
        console.log(err);
        res.status(500).json(err);
      }
    });
};

module.exports = {
  readData,
  readOne,
  createData,
  updateData,
  deleteData,
};
