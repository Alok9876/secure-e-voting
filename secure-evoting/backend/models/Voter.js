const mongoose = require('mongoose');

const VoterSchema = new mongoose.Schema({
  name: {
    type: String, required: true, trim: true,
  },
  email: {
    type: String, required: true, unique: true, lowercase: true, trim: true,
  },
  password: {
    type: String, required: true,
  },
  aadhaarNo: {
    type: String, required: true, unique: true, trim: true,
  },
  dateOfBirth: {
    type: Date, required: true,
  },
  phone: {
    type: String, required: true,
  },
  constituency: {
    type: String, default: 'General',
  },
  role: {
    type: String, enum: ['voter', 'admin'], default: 'voter',
  },
  isVerified: {
    type: Boolean, default: false,   // email OTP verified
  },
  isApproved: {
    type: Boolean, default: false,   // admin-approved
  },
  otp:         { type: String },
  otpExpiry:   { type: Date },
  votedElections: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'Election',
  }],
}, { timestamps: true });

module.exports = mongoose.model('Voter', VoterSchema);
