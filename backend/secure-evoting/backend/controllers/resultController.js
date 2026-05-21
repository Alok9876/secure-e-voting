const Election  = require('../models/Election');
const Candidate = require('../models/Candidate');
const Vote      = require('../models/Vote');

// @GET /api/results/:electionId — public results (only after election closes)
const getResults = async (req, res) => {
  try {
    const election = await Election.findById(req.params.electionId)
      .populate('candidates', 'name party symbol voteCount');
    if (!election) return res.status(404).json({ success: false, message: 'Election not found.' });
    if (election.status !== 'closed') {
      return res.status(403).json({ success: false, message: 'Results are published only after the election closes.' });
    }

    const candidates = election.candidates.sort((a, b) => b.voteCount - a.voteCount);
    const winner     = candidates[0];
    const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0);

    const results = candidates.map(c => ({
      candidateId:  c._id,
      name:         c.name,
      party:        c.party,
      symbol:       c.symbol,
      votes:        c.voteCount,
      percentage:   totalVotes > 0 ? ((c.voteCount / totalVotes) * 100).toFixed(2) : '0.00',
    }));

    res.json({
      success: true,
      election: {
        _id:           election._id,
        title:         election.title,
        constituency:  election.constituency,
        startDate:     election.startDate,
        endDate:       election.endDate,
        totalVotesCast: totalVotes,
        status:        election.status,
      },
      winner: {
        name:    winner.name,
        party:   winner.party,
        symbol:  winner.symbol,
        votes:   winner.voteCount,
        percentage: totalVotes > 0 ? ((winner.voteCount / totalVotes) * 100).toFixed(2) : '0',
      },
      results,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @GET /api/results — list all closed elections
const getAllResults = async (req, res) => {
  try {
    const elections = await Election.find({ status: 'closed' })
      .populate('candidates', 'name party voteCount')
      .sort({ endDate: -1 });
    res.json({ success: true, elections });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { getResults, getAllResults };
