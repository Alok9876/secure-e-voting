const mongoose = require('mongoose');
const crypto   = require('crypto');

const VoteSchema = new mongoose.Schema({
  voter: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Voter', required: true,
  },
  election: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Election', required: true,
  },
  encryptedCandidate: {
    type: String, required: true,   // SHA-256 hash of candidateId + voterSecret
  },
  receiptHash: {
    type: String, required: true, unique: true,  // Public receipt for voter audit
  },
  timestamp: {
    type: Date, default: Date.now,
  },
}, { timestamps: true });

// Compound unique index: one vote per voter per election
VoteSchema.index({ voter: 1, election: 1 }, { unique: true });

// Static method to generate receipt hash
VoteSchema.statics.generateReceipt = function (voterId, electionId, timestamp) {
  return crypto
    .createHash('sha256')
    .update(`${voterId}-${electionId}-${timestamp}-${Math.random()}`)
    .digest('hex');
};

module.exports = mongoose.model('Vote', VoteSchema);
