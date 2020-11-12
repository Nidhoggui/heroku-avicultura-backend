exports.up = function(knex) {
    return knex.schema.createTable('secao_ovo', function(table){
        table.string('id').primary();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.integer('egg_qt');
        table.string('lote').notNullable();
        table.string('insection_way').notNullable();

        table.string('granja_id').notNullable();
        table.foreign('granja_id').references('id').inTable('granjas');
      });
};

exports.down = function(knex) {
    return knex.schema.dropTable('secao_ovo');
};
