const fs = require('fs');
const App = require('../models/app.model');


const deleteImage = async (filename) => {
    
    if(process.env.STORAGE_ENGINE === 'S3'){

        const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');
        const s3 = new S3Client({

            region: process.env.MY_AWS_REGION,
            credentials: {
    
                accessKeyId: process.env.MY_AWS_KEY_ID,
                secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY
            }
    
        });

        try{

            const data = await s3.send(new DeleteObjectCommand({Bucket: process.env.MY_AWS_BUCKET, Key: filename}));
            console.log("Successfully. deleted.", data);

        }
        catch{

            console.error(err);

        }

    }else {

        let path = `public/uploads/${filename}`;

        fs.access(path, fs.constants.F_OK, (err) => {
            if(err) {
                console.error(err);
                return;
            }

            fs.unlink(path, (err) => {
                if(err) throw err;
                console.log(`${filename} was deleted!`);
            });
        });

    }

};


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
            res.status(500).json(err);
        });
};

const readOne = (req, res) => {

    let id = req.params.id;

    App.findById(id)
        .then((data) => {

            if(data){
                    // let img = `${process.env.STATIC_FIES_URL}${data.image_path}`;
                    // data.image_path = img;
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

    if(req.file){
        appData.image_path = process.env.STORAGE_ENGINE === 'S3' ? req.file.key : req.file.filename;
    }
    // include the following else if image is required
    else {
        return res.status(422).json({
            msg: "Image not uploaded!!"
        });
    }

    App.create(appData)
        .then((data) => {
            console.log('New App Created!', data);
            res.status(201).json(data);
        })
        .catch((err) => {
            if(err.name === 'ValidationError'){
                console.error('Validation Error!!', err);
                res.status(422).json({
                    "msg": "Validation Error",
                    "error" : err.message 
                });
            }
            else {
                console.error(err);
                res.status(500).json(err);
            }
        });

};

const updateData = (req, res) => {

    let id = req.params.id;
    let body = req.body;

    if(req.file){
        body.image_path = req.file.filename
    }
    // include the following else if image is required
    // else {
    //     return res.status(422).json({
    //         msg: "Image not uploaded!!"
    //     });
    // }

    App.findByIdAndUpdate(id, body, {
        new: false
    })
        .then((data) => {

            console.log(data);

            if(data){

                deleteImage(data.image_path);
                res.status(201).json(data);
            }
            else {
                deleteImage(body.image_path);
                res.status(404).json({
                    "message": `App with id: ${id} not found`
                });
            }
            
        })
        .catch((err) => {
            if(err.name === 'ValidationError'){
                console.error('Validation Error!!', err);
                res.status(422).json({
                    "msg": "Validation Error",
                    "error" : err.message 
                });
            }
            else if(err.name === 'CastError') {
                res.status(400).json({
                    "message": `Bad request, ${id} is not a valid id`
                });
            }
            else {
                console.error(err);
                res.status(500).json(err);
            }
        });


};

const deleteData = (req, res) => {

    let id = req.params.id;
    let imagePath = '';

    App.findById(id)
        .then((data) => {

            console.log('data', data);

            if(data){
                imagePath = data.image_path;
                return data.deleteOne();
            }
            else {
                res.status(404).json({
                    "message": `App with id: ${id} not found`
                });
            }
        })
        .then(() => {
            deleteImage(imagePath);

            res.status(200).json({
                "message": `App with id: ${id} deleted successfully`
            });
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

module.exports = {
    readData,
    readOne,
    createData,
    updateData,
    deleteData
};


