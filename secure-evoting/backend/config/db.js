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
    await seedDefaultUsers();
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    throw error;
  }
};

const upsertDefaultUser = async (user) => {
  const Voter = require('../models/Voter');
  const email = user.email.toLowerCase();
  const existing = await Voter.findOne({ email });
  const password = await bcrypt.hash(user.password, 12);

  if (existing) {
    await Voter.updateOne({ _id: existing._id }, {
      $set: {
        password,
        role: user.role,
        isVerified: true,
        isApproved: true,
      },
    });
    return;
  }

  await Voter.create({
    ...user,
    email,
    password,
    isVerified: true,
    isApproved: true,
  });
  console.log(`Default ${user.role} seeded -> ${email}`);
};

const seedDefaultUsers = async () => {
  await upsertDefaultUser({
    name: 'Administrator',
    email: process.env.ADMIN_EMAIL || 'admin@evoting.com',
    password: process.env.ADMIN_PASSWORD || 'Admin@123',
    aadhaarNo: 'ADMIN000000000000',
    dateOfBirth: new Date('1990-01-01'),
    phone: '0000000000',
    role: 'admin',
    constituency: 'Admin',
  });

  await upsertDefaultUser({
    name: 'Rahul Kumar Verma',
    email: process.env.DEMO_VOTER_EMAIL || 'rahul@example.com',
    password: process.env.DEMO_VOTER_PASSWORD || 'Voter@123',
    aadhaarNo: '1234-5678-9001',
    dateOfBirth: new Date('2000-03-12'),
    phone: '9811000001',
    role: 'voter',
    constituency: 'North Delhi',
  });
};

module.exports = { connectDB, getMongoUri };
