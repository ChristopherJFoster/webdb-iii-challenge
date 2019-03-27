const db = require('../dbConfig.js');

const router = require('express').Router();

router.get('/', async (req, res) => {
  try {
    const cohorts = await db('cohorts');
    res.status(200).json(cohorts);
  } catch (err) {
    res.status(500).json({
      error: `There was an error while retrieving the cohorts. ${err}`
    });
  }
});

module.exports = router;
