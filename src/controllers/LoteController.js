const connection = require('../database/connection');
const jwt = require('../functions/jwt');

module.exports = {
  async create(request, response) {
    const { lote_id, linhagem, idade, nutrição, numero_de_aves, galpao } = request.body;
    const jwtToken = jwt.decodeJWTToken(request.headers.authorization);

    try {
      await connection('lotes').insert({
        lote_id,
        linhagem,
        idade,
        nutrição,
        numero_de_aves,
        galpao,
        granja_id: jwtToken.id,
      });

      return response.status(200).send();
    } catch (e) {
      return response.status(400).send();
    }

  },
  async index(request, response) {
    const { id } = jwt.decodeJWTToken(request.headers.authorization);

    const lotes = await connection('lotes').where('granja_id', id);

    return response.json(lotes);
  },
  async listLotes(request, response) {
    const { page = 1 } = request.query;

    const { id } = jwt.decodeJWTToken(request.headers.authorization);
    const countlLotes = await connection('lotes').count('lote_id').where('granja_id', id).first();
    const lotes = await connection('lotes').where('granja_id', id).limit(5)
      .offset((page - 1) * 5).select('*');

    const pages = countlLotes['count(`lote_id`)'] / 5;

    return response.json({
      lotes,
      pages
    });
  },
  async delete(request, response) {
    const { id } = request.params;
    const granja_id = request.headers.authorization;
    const lotes = await connection('lotes').where('id', id).select('granja_id').first();

    if (lotes.granja_id !== granja_id) {
      return response.status(401).json({ error: 'Impossivel deletar o lote, verifique as dependencias' });
    }

    await connection('lotes').where('id', id).delete();
    return response.status(204).send();
  },
  async update(request, response, next) {
    try {
      const { id } = request.params;
      const data = request.body;
      const granjaId = jwt.decodeJWTToken(request.headers.authorization).id;

      await connection('lotes').update(data).where('lote_id', id).andWhere('granja_id', granjaId);

      return response.status(200).send();
    } catch (error) {
      return response.status(400).json(error);
    }
  },
  async getLote(request, response) {
    try {
      const { lote, granja } = request.query;

      const sector = await connection('lotes').where('lote_id', lote).andWhere('granja_id', granja).select('*').first();
      return response.json(sector);
    } catch (error) {
      return response.json(error);
    }
  },
};
