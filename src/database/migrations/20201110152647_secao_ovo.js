let rawCreateSection = "CREATE TABLE secao_ovo(id VARCHAR PRIMARY KEY,created_at TIMESTAMP DEFAULT (datetime('now','localtime')),egg_qt INTEGER,lote VARCHAR NOT NULL,insection_way NOT NULL, granja_id VARCHAR NOT NULL,FOREIGN KEY(granja_id) REFERENCES granjas(id))"

exports.up = function (knex) {
    return knex.schema.raw(rawCreateSection);
    // return knex.schema.createTable('secao_ovo', function (table) {
    //     table.string('id').primary();
    //     table.timestamp('created_at').defaultTo(knex.fn.now());
    //     table.integer('egg_qt');
    //     table.string('lote').notNullable();
    //     table.string('insection_way').notNullable();

    //     table.string('granja_id').notNullable();
    //     table.foreign('granja_id').references('id').inTable('granjas');
    // });
};

exports.down = function (knex) {
    return knex.schema.dropTable('secao_ovo');
};
