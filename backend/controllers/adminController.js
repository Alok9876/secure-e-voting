const Election  = require('../models/Election');
const Candidate = require('../models/Candidate');
const Voter     = require('../models/Voter');
const Vote      = require('../models/Vote');

// @POST /api/admin/elections — create election
const createElection = async (req, res) => {
  try {
    const { title, description, constituency, startDate, endDate } = req.body;
    if (!title || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'Title, start date and end date are required.' });
    }
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ success: false, message: 'End date must be after start date.' });
    }
    const election = await Election.create({
      title, description, constituency: constituency || 'General',
      startDate, endDate, createdBy: req.voter._id,
      status: new Date(startDate) <= new Date() ? 'active' : 'upcoming',
    });
    res.status(201).json({ success: true, message: 'Election created.', election });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @PUT /api/admin/elections/:id/status — manually change status
const updateElectionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['upcoming', 'active', 'closed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }
    const election = await Election.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!election) return res.status(404).json({ success: false, message: 'Election not found.' });
    res.json({ success: true, message: `Election marked as ${status}.`, election });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @DELETE /api/admin/elections/:id
const deleteElection = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    if (!election) return res.status(404).json({ success: false, message: 'Election not found.' });
    if (election.status === 'active') {
      return res.status(400).json({ success: false, message: 'Cannot delete an active election.' });
    }
    await Candidate.deleteMany({ election: election._id });
    await Vote.deleteMany({ election: election._id });
    await Election.findByIdAndDelete(election._id);
    res.json({ success: true, message: 'Election deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @POST /api/admin/candidates — add candidate to election
const addCandidate = async (req, res) => {
  try {
    const { name, party, symbol, manifesto, electionId } = req.body;
    if (!name || !party || !electionId) {
      return res.status(400).json({ success: false, message: 'Name, party and electionId are required.' });
    }
    const election = await Election.findById(electionId);
    if (!election) return res.status(404).json({ success: false, message: 'Election not found.' });

    const candidate = await Candidate.create({ name, party, symbol, manifesto, election: electionId });
    await Election.findByIdAndUpdate(electionId, { $push: { candidates: candidate._id } });

    res.status(201).json({ success: true, message: 'Candidate added.', candidate });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @DELETE /api/admin/candidates/:id
const deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!candidate) return res.status(404).json({ success: false, message: 'Candidate not found.' });
    await Election.findByIdAndUpdate(candidate.election, { $pull: { candidates: candidate._id } });
    res.json({ success: true, message: 'Candidate removed.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @GET /api/admin/voters — list all voters
const getAllVoters = async (req, res) => {
  try {
    const voters = await Voter.find({ role: 'voter' })
      .select('-password -otp -otpExpiry')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: voters.length, voters });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @PUT /api/admin/voters/:id/approve
const approveVoter = async (req, res) => {
  try {
    const voter = await Voter.findByIdAndUpdate(
      req.params.id, { isApproved: true }, { new: true }
    ).select('-password');
    if (!voter) return res.status(404).json({ success: false, message: 'Voter not found.' });
    res.json({ success: true, message: 'Voter approved.', voter });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @GET /api/admin/stats — dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const [totalVoters, totalElections, activeElections, totalVotes, pendingApproval] =
      await Promise.all([
        Voter.countDocuments({ role: 'voter' }),
        Election.countDocuments(),
        Election.countDocuments({ status: 'active' }),
        Vote.countDocuments(),
        Voter.countDocuments({ role: 'voter', isApproved: false }),
      ]);
    res.json({
      success: true,
      stats: { totalVoters, totalElections, activeElections, totalVotes, pendingApproval },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @GET /api/admin/elections — all elections for admin
const getAllElections = async (req, res) => {
  try {
    const elections = await Election.find()
      .populate('candidates', 'name party voteCount')
      .sort({ createdAt: -1 });
    res.json({ success: true, elections });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = {
  createElection, updateElectionStatus, deleteElection,
  addCandidate, deleteCandidate,
  getAllVoters, approveVoter,
  getDashboardStats, getAllElections,
};
