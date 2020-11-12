
exports.up = function(knex) {
  return knex.schema.createTable('gemas', function(table){
    table.increments('id_gema');

  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('gemas');
};
