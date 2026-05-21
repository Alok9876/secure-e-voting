const express = require('express');
const router  = express.Router();
const { protect, requireApproved } = require('../middleware/auth');
const { castVote, verifyVote, myVoteHistory } = require('../controllers/voteController');

router.post('/cast',             protect, requireApproved, castVote);
router.get('/verify/:receiptHash', protect, verifyVote);
router.get('/my-history',        protect, myVoteHistory);

module.exports = router;
