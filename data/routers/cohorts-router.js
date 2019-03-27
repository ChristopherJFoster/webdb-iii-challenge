const db = require('../dbConfig.js');

const router = require('express').Router();

router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).json({
      error: 'Please provide a cohort name.'
    });
  } else {
    try {
      const addedCohort = await db('cohorts').insert(req.body);
      console.log(addedCohort);
      try {
        const newCohort = await db('cohorts')
          .where('id', addedCohort[0])
          .first();
        console.log(newCohort);
        res.status(201).json(newCohort);
      } catch (err) {
        res.status(500).json({
          error: `There was an error while retrieving the added cohort data. ${err}`
        });
      }
    } catch (err) {
      res.status(500).json({
        error: `There was an error while adding the cohort data. ${err}`
      });
    }
  }
});

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
