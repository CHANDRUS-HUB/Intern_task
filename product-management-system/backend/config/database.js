const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  let attempts = 0;
  const maxRetries = 5;

  const connectWithRetry = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log(" MongoDB connected successfully!");
    } catch (error) {
      attempts++;
      console.error(` MongoDB connection attempt ${attempts} failed:`, error.message);

      if (attempts < maxRetries) {
        console.log("Retrying in 5 seconds...");
        setTimeout(connectWithRetry, 5000);
      } else {
        console.error(" Max connection attempts reached. Exiting...");
        process.exit(1);
      }
    }
  };

  connectWithRetry();
};

module.exports = connectDB;
