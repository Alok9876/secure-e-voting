// elections.js
const express = require('express');
const router  = express.Router();
const { protect, requireApproved } = require('../middleware/auth');
const { getElections, getElectionById } = require('../controllers/electionController');

router.get('/',    protect, requireApproved, getElections);
router.get('/:id', protect, requireApproved, getElectionById);

module.exports = router;
