const connection = require('../database/connection');
const crypto= require('crypto');
const jwt =require('./jwt');

module.exports = {
  async create(request, response) {
    const email=crypto.createHash('md5').update(request.body.email).digest('hex');
    const password=crypto.createHash('md5').update(request.body.password).digest('hex');

    const granja = await connection('granjas').where('password', password).where('email', email).select('nomefantasia', 'id').first();

    if(!granja){
      return response.status(400).json({ error: 'Granja não cadastrada, por favor cadastre uma granja para acessar o sistema' });
    }
    const responsejwt=jwt(email,password);
    return response.json({
      granja,
      responsejwt
    });
  },
  async emailcheck(request, response){
  const email = request.body
  const granja = await connection('granjas').where('password', password).where('email', email).select('email').first();

  if(!granja){
    return response.status(400).json({ error: 'Granja não cadastrada, por favor cadastre uma granja para acessar o sistema' });
  }
    return response,json(email);
  },
  async updatepassword(request, response){
    const email = request.body
    const passoword = request.body
    await connection('granja').update( password ).where('email', email)
    return response.send();
  }
}
