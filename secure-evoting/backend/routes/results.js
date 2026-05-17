const express = require('express');
const router  = express.Router();
const { getResults, getAllResults } = require('../controllers/resultController');

router.get('/',          getAllResults);
router.get('/:electionId', getResults);

module.exports = router;
