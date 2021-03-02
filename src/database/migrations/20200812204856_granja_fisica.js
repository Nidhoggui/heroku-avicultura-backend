exports.up = function (knex) {
  return knex.schema.createTable('granjas_fisicas', function (table) {
    table.string('id').primary();
    table.string('nome').notNullable();
    table.string('cpf').notNullable();
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
    table.string('proprietario').notNullable();
    table.boolean('gaiola').notNullable();
    table.string('localizacao').notNullable();
    table.boolean('termosDeUso');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('granjas_fisicas');
};
