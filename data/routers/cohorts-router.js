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
      try {
        const addedRecord = await db('cohorts')
          .where('id', addedCohort[0])
          .first();
        res.status(201).json(addedRecord);
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
      error: `There was an error while retrieving the cohorts data. ${err}`
    });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const cohort = await db('cohorts')
      .where({ id })
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
      error: `There was an error while retrieving the cohort data. ${err}`
    });
  }
});

router.get('/:id/students', async (req, res) => {
  const id = req.params.id;
  const cohort = await db('cohorts')
    .where({ id })
    .first();
  if (cohort) {
    try {
      const cohortStudents = await db('cohorts')
        .join('students', 'cohorts.id', 'students.cohort_id')
        .select('cohorts.name as Cohort', 'students.name as Student Name')
        .where({ cohort_id: id });
      res.status(200).json(cohortStudents);
    } catch (err) {
      res.status(500).json({
        error: `There was an error while retrieving the cohort's students data. ${err}`
      });
    }
  } else {
    res.status(404).json({
      error: 'There is no cohort with the specified ID.'
    });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) {
    res.status(400).json({
      error: 'Please provide the cohort changes you intend to make.'
    });
  } else {
    try {
      const updatedCohort = await db('cohorts')
        .where({ id })
        .update(req.body);
      if (updatedCohort) {
        try {
          const updatedRecord = await db('cohorts')
            .where({ id })
            .first();
          res.status(200).json(updatedRecord);
        } catch (err) {
          res.status(500).json({
            error: `There was an error while retrieving the updated cohort data. ${err}`
          });
        }
      } else {
        res.status(404).json({
          message: 'There is no cohort with the specified ID.'
        });
      }
    } catch (err) {
      res.status(500).json({
        error: `There was an error while updating the cohort data. ${err}`
      });
    }
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const cohort = await db('cohorts')
      .where({ id })
      .first();
    if (cohort) {
      try {
        const cohortStudents = await db('cohorts')
          .join('students', 'cohorts.id', 'students.cohort_id')
          .select('students.id')
          .where({ cohort_id: id });
        if (cohortStudents.length > 0) {
          res.status(400).json({
            error:
              'You may not delete a cohort which still has students assigned to it.'
          });
        } else {
          try {
            const numOfDeletedCohorts = await db('cohorts')
              .where({ id })
              .del();
            if (numOfDeletedCohorts) {
              res.status(200).json({
                message: `Number of cohorts deleted: ${numOfDeletedCohorts}.`
              });
            }
          } catch (err) {
            res.status(500).json({
              error: `There was an error while deleting the cohort. ${err}`
            });
          }
        }
      } catch (err) {
        res.status(500).json({
          error: `There was an error while checking whether the cohort has any students assigned to it. ${err}`
        });
      }
    } else {
      res.status(404).json({
        error: 'There is no cohort with the specified ID.'
      });
    }
  } catch (err) {
    res.status(500).json({
      error: `There was an error while checking the cohort ID. ${err}`
    });
  }
});

module.exports = router;
