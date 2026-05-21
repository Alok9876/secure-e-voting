const Election  = require('../models/Election');
const Candidate = require('../models/Candidate');
const Voter     = require('../models/Voter');

// @GET /api/elections — all active/upcoming elections
const getElections = async (req, res) => {
  try {
    const now = new Date();
    const elections = await Election.find({
      status: { $in: ['active', 'upcoming'] },
    }).populate('candidates', 'name party symbol').sort({ startDate: 1 });

    // Auto-update status based on dates
    for (const e of elections) {
      if (e.status === 'upcoming' && now >= e.startDate) {
        e.status = 'active'; await e.save();
      } else if (e.status === 'active' && now > e.endDate) {
        e.status = 'closed'; await e.save();
      }
    }

    const voter = req.voter;
    const enriched = elections.map(e => ({
      ...e.toObject(),
      hasVoted: voter.votedElections.some(id => id.toString() === e._id.toString()),
    }));

    res.json({ success: true, count: enriched.length, elections: enriched });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @GET /api/elections/:id — single election details
const getElectionById = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id)
      .populate('candidates', 'name party symbol manifesto');
    if (!election) return res.status(404).json({ success: false, message: 'Election not found.' });

    const hasVoted = req.voter.votedElections.some(
      id => id.toString() === election._id.toString()
    );
    res.json({ success: true, election: { ...election.toObject(), hasVoted } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { getElections, getElectionById };
