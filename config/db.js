const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { configureMongoDns, getMongoOptions, getMongoUri } = require('./mongo');

const connectDB = async () => {
  try {
    const mongoUri = getMongoUri();

    if (!mongoUri) {
      throw new Error('Missing MongoDB connection string. Set MONGO_URI or Railway\'s MONGO_URL variable.');
    }

    configureMongoDns(mongoUri);
    const conn = await mongoose.connect(mongoUri, getMongoOptions(mongoUri));
    console.log(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    await seedAdmin();
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    throw error;
  }
};

// Seed a default admin on first run.
const seedAdmin = async () => {
  const Voter = require('../models/Voter');
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@evoting.com';
  const existing = await Voter.findOne({ email: adminEmail });

  if (!existing) {
    const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@123', 12);
    await Voter.create({
      name: 'Administrator',
      email: adminEmail,
      password: hashed,
      aadhaarNo: 'ADMIN000000000000',
      dateOfBirth: new Date('1990-01-01'),
      phone: '0000000000',
      role: 'admin',
      isVerified: true,
      isApproved: true,
    });
    console.log(`Default admin seeded -> ${adminEmail}`);
  }
};

module.exports = { connectDB, getMongoUri };
