const db = require('../dbConfig.js');

const router = require('express').Router();

router.post('/', async (req, res) => {
  const { name, cohort_id } = req.body;
  if (!name) {
    return res.status(400).json({
      error: 'Please provide a student name.'
    });
  } else if (cohort_id) {
    try {
      const cohort = await db('cohorts')
        .where({ id: cohort_id })
        .first();
      if (!cohort) {
        return res.status(400).json({
          error: 'There is no cohort with the specified ID.'
        });
      }
    } catch (err) {
      return res.status(500).json({
        error: `There was an error while checking the cohort data. ${err}`
      });
    }
  }

  try {
    const addedStudent = await db('students').insert(req.body);
    try {
      const addedRecord = await db('students')
        .where('id', addedStudent[0])
        .first();
      res.status(201).json(addedRecord);
    } catch (err) {
      res.status(500).json({
        error: `There was an error while retrieving the added student data. ${err}`
      });
    }
  } catch (err) {
    res.status(500).json({
      error: `There was an error while adding the student data. ${err}`
    });
  }
});

router.get('/', async (req, res) => {
  try {
    const students = await db('students');
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({
      error: `There was an error while retrieving the students. ${err}`
    });
  }
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const student = await db('students')
      .where({ id })
      .first();
    if (student) {
      try {
        const studentWithCohort = await db('students')
          .join('cohorts', 'cohorts.id', 'students.cohort_id')
          .select('students.id', 'students.name', 'cohorts.name as cohort')
          .where({ 'students.id': id });
        res.status(200).json(studentWithCohort);
      } catch (err) {
        res.status(500).json({
          error: `There was an error while retrieving the student's cohort data. ${err}`
        });
      }
    } else {
      res.status(404).json({
        error: 'There is no student with the specified ID.'
      });
    }
  } catch (err) {
    res.status(500).json({
      error: `There was an error while retrieving the student data. ${err}`
    });
  }
});

router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { name, cohort_id } = req.body;
  if (!name && !cohort_id) {
    return res.status(400).json({
      error: 'Please provide the student changes you intend to make.'
    });
  } else if (cohort_id) {
    try {
      const cohort = await db('cohorts')
        .where({ id: cohort_id })
        .first();
      if (!cohort) {
        return res.status(400).json({
          error: 'There is no cohort with the specified ID.'
        });
      }
    } catch (err) {
      return res.status(500).json({
        error: `There was an error while checking the cohort data. ${err}`
      });
    }
  }

  try {
    const updatedStudent = await db('students')
      .where({ id })
      .update(req.body);
    if (updatedStudent) {
      try {
        const updatedRecord = await db('students')
          .where({ id })
          .first();
        res.status(200).json(updatedRecord);
      } catch (err) {
        res.status(500).json({
          error: `There was an error while retrieving the updated student data. ${err}`
        });
      }
    } else {
      res.status(404).json({
        message: 'There is no student with the specified ID.'
      });
    }
  } catch (err) {
    res.status(500).json({
      error: `There was an error while updating the student data. ${err}`
    });
  }
});

module.exports = router;
