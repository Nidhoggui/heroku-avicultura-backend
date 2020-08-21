const connection = require('../database/connection');
const crypto= require('crypto');
const jwt =require('../functions/jwt');

module.exports = {
  async create(request, response) {
    const email=crypto.createHash('md5').update(request.body.email).digest('hex');
    const password=crypto.createHash('md5').update(request.body.password).digest('hex');
    var granja = await connection('granjas').where('password', password).where('email', email).select('nomefantasia', 'id','confirmationFlag').first();

    if(granja===undefined){
      granja = await connection('granjas_fisicas').where('password', password).where('email', email).select('nome', 'id','confirmationFlag').first();
    }

    try{
      if(granja.confirmationFlag){
        const responsejwt=jwt.createJWTToken({email,password,id:granja.id});
        return response.json({
          responsejwt
        });
      }else{
        return response.status(400).json({error:"Granja não confirmou email!"});
      }
    }catch(error){
      return response.status(404).json({error:"granja não cadastrada"});
    }
    
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
    const {id,password}=request.body;

    await connection('granja').where('id', id).update(password)
    return response.status(200).send();
  }
}
