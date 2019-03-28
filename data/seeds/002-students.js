exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('students')
    .truncate()
    .then(function() {
      // Inserts seed entries
      return knex('students').insert([
        { id: 1, name: 'Christopher Foster', cohort_id: 1 },
        { id: 2, name: 'John Maus', cohort_id: 1 },
        { id: 3, name: 'Sharon Street', cohort_id: 2 },
        { id: 4, name: 'Friedrich Nietzsche', cohort_id: 3 }
      ]);
    });
};
