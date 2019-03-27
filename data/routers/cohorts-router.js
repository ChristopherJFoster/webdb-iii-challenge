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

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const cohort = await db('cohorts')
      .where('id', id)
      .first();
    if (cohort) {
      res.status(200).json(cohort);
    } else {
      res.status(404).json({
        error: 'There is no cohort with the specified ID.'
      });
    }
  } catch (err) {
    res.status(500).json({
      error: `There was an error while retrieving the cohort. ${err}`
    });
  }
});

router.get('/:id/students', async (req, res) => {
  const id = req.params.id;
  const cohort = await db('cohorts')
    .where('id', id)
    .first();
  if (cohort) {
    try {
      const cohortStudents = await db('cohorts')
        .join('students', 'cohorts.id', 'students.cohort_id')
        .select('cohorts.name as Cohort', 'students.name as Student Name')
        .where('cohort_id', id);
      res.status(200).json(cohortStudents);
    } catch (err) {
      res.status(500).json({
        error: `There was an error while retrieving the cohort's students. ${err}`
      });
    }
  } else {
    res.status(404).json({
      error: 'There is no cohort with the specified ID.'
    });
  }
});

module.exports = router;
