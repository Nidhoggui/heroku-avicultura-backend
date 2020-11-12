
exports.up = function(knex) {
  return knex.schema.createTable('albumen', function(table){
    table.increments('id_albumen');

  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('albumen');
};
