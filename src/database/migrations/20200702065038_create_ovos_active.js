
exports.up = function(knex) {
  return knex.schema.createTable('ovos', function(table){
    table.integer('id')
    table.string('lote').notNullable();
    table.decimal('pesoOvo')

    table.decimal('pesoCasca')
    table.integer('corCasca')
    table.integer('espessuraP1')
    table.integer('espessuraP2')
    table.integer('espessuraP3')
    
    table.integer('alturaAlbumen')
    table.integer('diametroAlbumen')

    table.decimal('pesoGema')
    table.integer('alturaGema')
    table.integer('diametroGema')
    table.integer('corGema')

    table.string('secao_id')
    table.foreign('secao_id').references('id').inTable('secao_ovo');

    table.string('granja_id').notNullable();
    table.foreign('granja_id').references('id').inTable('granjas');

    table.primary(['id','secao_id'])
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('ovos');
};
