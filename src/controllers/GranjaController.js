const crypto = require('crypto');
const connection = require('../database/connection');

module.exports = {
  async create(request, response) {
    const { nomeFantasia, razaoSocial, cnpj, proprietario, gaiola, localizacao, termosDeUso } = request.body;
    const email=crypto.createHash('md5').update(request.body.email).digest('hex');
    const password=crypto.createHash('md5').update(request.body.password).digest('hex');
    const id = crypto.randomBytes(3).toString('HEX');
    if(termosDeUso){
      await connection('granjas').insert({
        id, 
        nomeFantasia,
        razaoSocial,
        cnpj,
        proprietario,
        gaiola,
        localizacao,
        termosDeUso,
        email,
        password
      });
      return response.json({
        id,
      });
    }else{
      return response.status(428).json({error:'Termos de uso não asssinalado'});
    }
  },
  async index(request,response){
    const granjas=await connection('granjas').select('*');

    return response.json(granjas)
  }
};
