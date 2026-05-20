const mongoose = require('mongoose');

const ElectionSchema = new mongoose.Schema({
  title: {
    type: String, required: true, trim: true,
  },
  description: {
    type: String, default: '',
  },
  constituency: {
    type: String, default: 'General',
  },
  startDate: {
    type: Date, required: true,
  },
  endDate: {
    type: Date, required: true,
  },
  status: {
    type: String,
    enum: ['upcoming', 'active', 'closed'],
    default: 'upcoming',
  },
  candidates: [{
    type: mongoose.Schema.Types.ObjectId, ref: 'Candidate',
  }],
  totalVotesCast: {
    type: Number, default: 0,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Voter',
  },
}, { timestamps: true });

module.exports = mongoose.model('Election', ElectionSchema);
