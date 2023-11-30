// Importing required modules
const { default: mongoose } = require('mongoose'); // Importing mongoose as default
const Mongoose = require('mongoose'); // Importing mongoose as Mongoose

// Function to initialize MongoDB connection
const init = () => {
  // Setting mongoose to log queries in debug mode
  mongoose.set('debug', true);

  // Connecting to the MongoDB database using environment variable DB_ATLAS_URL
  mongoose
    .connect(
      process.env.DB_ATLAS_URL, // MongoDB Atlas URL
      {
        useNewUrlParser: true, // Using new URL string parser
      }
    )
    .catch((err) => {
      // Handling connection errors
      console.log(`Error:${err.stack}`);
      process.exit(1);
    });

  // Event listener when the MongoDB connection is open
  mongoose.connection.on('open', () => {
    console.log(`Connected to Database`);
  });
};

// Exporting the initialization function
module.exports = init;
