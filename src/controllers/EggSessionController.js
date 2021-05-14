const connection = require('../database/connection');
const crypto = require('crypto');
const jwt = require('../functions/jwt');

module.exports = {
  async index(request, response) {
    const sessions = await connection('secao_ovo').select('*');
    response.json(sessions);
  },
  async create(request, response) {
    const { egg_qt, lote, insection_way } = request.body;

    const jwtToken = jwt.decodeJWTToken(request.headers.authorization);

    const id = crypto.randomBytes(4).toString('HEX');

    await connection('secao_ovo').insert({
      id,
      egg_qt,
      lote,
      insection_way,
      granja_id: jwtToken.id
    });

    return response.json({
      id
    });
  },
  async getGranjaSessions(request, response) {
    const { page = 1 } = request.query;
    const { id } = jwt.decodeJWTToken(request.headers.authorization);

    const sessionData = await connection('secao_ovo').select('*').where('granja_id', id).limit(5)
      .offset((page - 1) * 5).select('*');
    const countSessions = await connection('secao_ovo').count('id').where('granja_id', id).first();

    const pages = countSessions['count(`id`)'] / 5;

    return response.json({ sessionData, pages });
  },
  async getSessionData(request, response) {
    const { sessionId } = request.params;
    const jwtToken = jwt.decodeJWTToken(request.headers.authorization);

    const sessionData = await connection('secao_ovo').select('*').where('id', sessionId).andWhere('granja_id', jwtToken.id).first();

    return response.json({
      sessionData
    });
  },
  async listEggsBySession(request, response) {
    const { sessionid, page } = request.query;

    const jwtToken = jwt.decodeJWTToken(request.headers.authorization);

    const eggs = await connection('ovos').count('id').where('secao_id', sessionid).first();
    const eggData = await connection('ovos').select('*').where('secao_id', sessionid).andWhere("granja_id", jwtToken.id).limit(5).offset(5 * (page - 1));

    const pages = Math.ceil(eggs['count(`id`)'] / 5);

    return response.json({
      pages,
      eggData
    });
  },
}
