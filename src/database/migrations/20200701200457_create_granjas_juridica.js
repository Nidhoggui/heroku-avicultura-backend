exports.up = function (knex) {
  return knex.schema.createTable('granjas', function (table) {
    table.string('id').primary();
    table.string('nomeFantasia').notNullable();
    table.string('razaoSocial').notNullable();
    table.string('cnpj').notNullable();
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
    table.string('proprietario').notNullable();
    table.boolean('gaiola').notNullable();
    table.string('localizacao').notNullable();
    table.boolean('termosDeUso');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('granjas');
};
