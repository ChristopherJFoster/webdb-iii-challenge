const db = require('../dbConfig.js');

const router = require('express').Router();

router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).json({
      error: 'Please provide a student name.'
    });
  } else {
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
      res.status(200).json(student);
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

module.exports = router;
