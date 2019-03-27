const express = require('express');

const server = express();

const cohortsRouter = require('./data/routers/cohorts-router.js');
const studentsRouter = require('./data/routers/students-router.js');

server.use(express.json());

server.use('/api/cohorts', cohortsRouter);
server.use('/api/students', studentsRouter);

server.get('/', (req, res) => {
  res.send('Server running...');
});

module.exports = server;
