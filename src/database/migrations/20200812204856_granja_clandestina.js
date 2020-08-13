
exports.up = function(knex) {
  return knex.schema.createTable('granjas_clandestinas', function(table){
    table.string('id').primary();
    table.string('nome').notNullable();
    table.string('cpf').notNullable();
    table.string('proprietario').notNullable();
    table.boolean('gaiola');
    table.string('localizacao');
    table.boolean('termosDeUso');
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('granjas_clandestinas');
};
