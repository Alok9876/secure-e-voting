const crypto    = require('crypto');
const Vote      = require('../models/Vote');
const Election  = require('../models/Election');
const Candidate = require('../models/Candidate');
const Voter     = require('../models/Voter');

// @POST /api/votes/cast
const castVote = async (req, res) => {
  try {
    const { electionId, candidateId } = req.body;
    const voterId = req.voter._id;

    if (!electionId || !candidateId) {
      return res.status(400).json({ success: false, message: 'Election ID and Candidate ID are required.' });
    }

    // 1. Verify election exists and is active
    const election = await Election.findById(electionId);
    if (!election) return res.status(404).json({ success: false, message: 'Election not found.' });
    if (election.status !== 'active') {
      return res.status(400).json({ success: false, message: `Election is ${election.status}, not active.` });
    }
    const now = new Date();
    if (now < election.startDate || now > election.endDate) {
      return res.status(400).json({ success: false, message: 'Voting is outside the election window.' });
    }

    // 2. Verify candidate belongs to this election
    const candidate = await Candidate.findOne({ _id: candidateId, election: electionId });
    if (!candidate) return res.status(404).json({ success: false, message: 'Candidate not found in this election.' });

    // 3. Check double-vote (DB-level + voter record)
    const alreadyVoted = await Vote.findOne({ voter: voterId, election: electionId });
    if (alreadyVoted) {
      return res.status(409).json({ success: false, message: 'You have already voted in this election.' });
    }

    // 4. Encrypt the vote (candidate ID hashed with voter secret + salt)
    const salt            = crypto.randomBytes(16).toString('hex');
    const encryptedVote   = crypto
      .createHash('sha256')
      .update(`${candidateId}-${voterId}-${salt}`)
      .digest('hex');

    // 5. Generate public receipt
    const receiptHash = Vote.generateReceipt(voterId, electionId, Date.now());

    // 6. Persist vote
    await Vote.create({
      voter:              voterId,
      election:           electionId,
      encryptedCandidate: encryptedVote,
      receiptHash,
    });

    // 7. Increment candidate vote count
    await Candidate.findByIdAndUpdate(candidateId, { $inc: { voteCount: 1 } });

    // 8. Increment election total
    await Election.findByIdAndUpdate(electionId, { $inc: { totalVotesCast: 1 } });

    // 9. Record in voter's voted list
    await Voter.findByIdAndUpdate(voterId, { $push: { votedElections: electionId } });

    res.status(201).json({
      success: true,
      message: 'Vote cast successfully! Your vote is secure.',
      receipt: {
        receiptHash,
        electionTitle: election.title,
        timestamp:     new Date().toISOString(),
        message:       'Keep this receipt to verify your vote was counted.',
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'You have already voted in this election.' });
    }
    console.error('CastVote Error:', error);
    res.status(500).json({ success: false, message: 'Server error while casting vote.' });
  }
};

// @GET /api/votes/verify/:receiptHash
const verifyVote = async (req, res) => {
  try {
    const vote = await Vote.findOne({ receiptHash: req.params.receiptHash })
      .populate('election', 'title status')
      .select('-encryptedCandidate -voter'); // don't reveal voter identity

    if (!vote) return res.status(404).json({ success: false, message: 'Receipt not found. Vote may not exist.' });

    res.json({
      success: true,
      message: 'Vote verified successfully!',
      vote: {
        receiptHash:   vote.receiptHash,
        electionTitle: vote.election.title,
        electionStatus:vote.election.status,
        timestamp:     vote.timestamp,
        verifiedAt:    new Date().toISOString(),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @GET /api/votes/my-history
const myVoteHistory = async (req, res) => {
  try {
    const votes = await Vote.find({ voter: req.voter._id })
      .populate('election', 'title status startDate endDate')
      .select('-encryptedCandidate');
    res.json({ success: true, votes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { castVote, verifyVote, myVoteHistory };
