const App = require('../models/app.model');
const fs = require('fs');

const readData = (req, res) => {
  App.find()
      .then((data) => {
          console.log(data);
          if(data.length > 0){
              res.status(200).json(data);
          }
          else{
              res.status(404).json("None found");
          }
      })
      .catch((err) => {
          console.log(err);
          // res.status(500).json(err);
      });
};

const readOne = (req, res) => {

  let id = req.params.id;

  App.findById(id)
      .then((data) => {

          if(data){
              res.status(200).json(data);
          }
          else {
              res.status(404).json({
                  "message": `App with id: ${id} not found`
              });
          }
          
      })
      .catch((err) => {
          console.error(err);
          if(err.name === 'CastError') {
              res.status(400).json({
                  "message": `Bad request, ${id} is not a valid id`
              });
          }
          else {
              res.status(500).json(err)
          }
          
      });

};

const createData = (req, res) => {
  console.log(req.file);
  let appData = req.body;
  if (req.file) {
    appData.image_path = req.file.filename;
    //include the following else if image is required
  } else {
    return res.status(422).json({
      mgs: 'Image not uploaded',
    });
  }
  App.create(req.body)
    .then((data) => {
      console.log('New App Created!', data);
      res.status(201).json(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        console.error('Validation Error!!', err);
        res.status(422).json({
          msg: 'Validation Error',
          error: err.message,
        });
      } else {
        console.error(err);
        res.status(500).json(err);
      }
    });
};

const updateData = (req, res) => {
  let id = req.params.id;
  let body = req.body;

  if (req.file) {
    body.image_path = req.file.filename;
  }
  //else {
  //   return res.status(422).json({
  //     mgs: 'Image not uploaded',
  //   });
  // }
  App.findByIdAndUpdate(id, body, {
    new: false,
  })
    .then((data) => {
      deleteImg(data.image_path);
      if (data) {
        res.status(201).json(data);
      } else {
        deleteImg(body.data.image_path);
        res.status(404).json({
          message: `App with id: ${id} not found`,
        });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        console.error('Validation Error!!', err);
        res.status(422).json({
          msg: 'Validation Error',
          error: err.message,
        });
      } else if (err.name === 'CastError') {
        res.status(400).json({
          message: `Bad request, ${id} is not a valid id`,
        });
      } else {
        console.error(err);
        res.status(500).json(err);
      }
    });
};

const deleteImg = (filename) => {
  let path = `/public/uploads/${filename}`;

  fs.access(path, fs.constants.F_OK, (err) => {
    if (err) {
      console.log(err);
      return;
    }
    fs.unlink(path, (err) => {
      if (err) throw err;
      console.log(`${filename} was deleted`);
    });
  });
};

const deleteData = (req, res) => {
  let id = req.params.id;
  let imgPath = '';

  App.findById({ _id: id })
    .then((data) => {
      console.log('data', data);
      if (data) {
        imgPath = data.image_path;
        return data.deleteOne();
      } else {
        res.status(404).json({
          msg: 'Could not find App',
        });
      }
    })
    .then(() => {
      deleteImg(imgPath);
      res.status(200).json({
        msg: 'App was deleted',
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === 'CastError') {
        res.status(400).json({
          message: `Bad request, ${id} is not a valid id`,
        });
      } else {
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
