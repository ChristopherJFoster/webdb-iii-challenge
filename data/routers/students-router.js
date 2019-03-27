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

module.exports = router;
