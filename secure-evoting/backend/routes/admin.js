const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');
const {
  createElection, updateElectionStatus, deleteElection,
  addCandidate, deleteCandidate,
  getAllVoters, approveVoter,
  getDashboardStats, getAllElections,
} = require('../controllers/adminController');

// All admin routes require JWT + admin role
router.use(protect, adminOnly);

// Dashboard
router.get('/stats',                    getDashboardStats);

// Elections
router.get('/elections',                getAllElections);
router.post('/elections',               createElection);
router.put('/elections/:id/status',     updateElectionStatus);
router.delete('/elections/:id',         deleteElection);

// Candidates
router.post('/candidates',              addCandidate);
router.delete('/candidates/:id',        deleteCandidate);

// Voters
router.get('/voters',                   getAllVoters);
router.put('/voters/:id/approve',       approveVoter);

module.exports = router;
