exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('cohorts')
    .truncate()
    .then(function() {
      // Inserts seed entries
      return knex('cohorts').insert([
        { id: 1, name: 'Web17' },
        { id: 2, name: 'Web18' },
        { id: 3, name: 'Web19' }
      ]);
    });
};
