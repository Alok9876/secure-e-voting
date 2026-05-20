const mongoose = require('mongoose');

const CandidateSchema = new mongoose.Schema({
  name: {
    type: String, required: true, trim: true,
  },
  party: {
    type: String, required: true, trim: true,
  },
  symbol: {
    type: String, default: '🏳️',
  },
  manifesto: {
    type: String, default: '',
  },
  election: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Election', required: true,
  },
  voteCount: {
    type: Number, default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('Candidate', CandidateSchema);
