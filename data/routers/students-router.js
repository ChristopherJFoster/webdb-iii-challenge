const db = require('../dbConfig.js');

const router = require('express').Router();

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
