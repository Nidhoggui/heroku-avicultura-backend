
exports.up = function (knex) {
  return knex.schema.createTable('lotes', function (table) {
    table.integer('lote_id').primary();
    table.string('linhagem').notNullable();
    table.integer('idade').notNullable();
    table.string('nutrição');
    table.integer('numero_de_aves');
    table.string('galpao');

    table.string('granja_id').notNullable();
    table.foreign('granja_id').references('id').inTable('granjas');

  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('lotes');
};
