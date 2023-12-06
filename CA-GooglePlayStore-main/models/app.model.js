const { Schema, model } = require('mongoose');

const appSchema = Schema(
    {
        title: {
            type: String,
            required: [true, 'title field is required'],
        },
        type: {
            type: String,
            required: [true, 'type field is required'],
        },
        price: {
            type: Number,
            required: [true, 'price field is required'],
        },
        image_path: {
            type: String
        },
    },
    { timestamps: true }
);

module.exports = model('App', appSchema);