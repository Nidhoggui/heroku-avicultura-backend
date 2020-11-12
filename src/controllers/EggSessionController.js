const connection = require('../database/connection');
const crypto= require('crypto');
const jwt =require('../functions/jwt');

module.exports = {
  async index(request, response){
    const gemas=await connection('secao_ovo').select('*');
    response.json(gemas);
  },
  async create(request, response){
    const { egg_qt, lote, insection_way} = request.body;

    const jwtToken = jwt.decodeJWTToken(request.headers.authorization);

    const id=crypto.randomBytes(4).toString('HEX');

    await connection('secao_ovo').insert({
        id,
        egg_qt,
        lote,
        insection_way,
        granja_id:jwtToken.id
    });
    
    return response.json({
      id
    });
  },
  async getSessionData(request, response){
    const {sessionId}=request.params;
    const jwtToken = jwt.decodeJWTToken(request.headers.authorization);

    const sessionData=await connection('secao_ovo').select('*').where('id',sessionId).andWhere('granja_id',jwtToken.id).first();
    
    return response.json({
      sessionData
    });
  },
  async listEggsBySession(request, response){
    const {sessionid,page}=request.query;

    const jwtToken = jwt.decodeJWTToken(request.headers.authorization);

    const eggs=await connection('ovos').count('id').first();
    const eggData=await connection('ovos').select('*').where('secao_id',sessionid).andWhere("granja_id",jwtToken.id).limit(5).offset(5*(page-1));
    
    const pages=eggs['count(`id`)']/5;

    return response.json({
      pages,
      eggData
    });
  },
}
