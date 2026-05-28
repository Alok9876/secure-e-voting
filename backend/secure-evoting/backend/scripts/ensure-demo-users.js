require('dotenv').config();

const mongoose = require('mongoose');
const { connectDB } = require('../config/db');

connectDB()
  .then(() => {
    console.log('Demo login users are ready.');
  })
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
