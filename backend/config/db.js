const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser:    true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    await seedAdmin();
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    throw error;
  }
};

// Seed a default admin on first run
const seedAdmin = async () => {
  const Voter = require('../models/Voter');
  const existing = await Voter.findOne({ email: process.env.ADMIN_EMAIL });
  if (!existing) {
    const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123', 12);
    await Voter.create({
      name:        'Administrator',
      email:       process.env.ADMIN_EMAIL || 'admin@evoting.com',
      password:    hashed,
      aadhaarNo:   'ADMIN000000000000',
      dateOfBirth: new Date('1990-01-01'),
      phone:       '0000000000',
      role:        'admin',
      isVerified:  true,
      isApproved:  true,
    });
    console.log('👤 Default admin seeded → admin@evoting.com / Admin@123');
  }
};

module.exports = { connectDB };
