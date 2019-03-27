exports.up = function(knex) {
  return knex.schema.createTable('students', function(tbl) {
    tbl.increments();
    tbl.string('name').notNullable();
    tbl
      .integer('cohort_id')
      .unsigned()
      .references('id')
      .inTable('cohorts')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('students');
};
