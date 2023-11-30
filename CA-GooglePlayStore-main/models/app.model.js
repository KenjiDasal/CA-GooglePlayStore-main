const { Schema, model } = require('mongoose');

const appSchema = Schema(
    {
        title: {
            type: String,
            required: [true, 'make field is required'],
        },
        type: {
            type: String,
            required: [true, 'model field is required'],
        },
        price: {
            type: Number,
            required: [true, 'year field is required'],
        },
        
        image_path: {
            type: String
        },
    },
    { timestamps: true }
);

module.exports = model('App', appSchema);