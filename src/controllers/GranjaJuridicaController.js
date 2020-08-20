const crypto = require('crypto');
const connection = require('../database/connection');
const validarCNPJ=require('../functions/validaCNPJ');
const mailerController= require('./mailerController');

module.exports = {
  async create(request, response) {
    const { nomeFantasia, razaoSocial, cnpj, proprietario, gaiola, localizacao, termosDeUso, email } = request.body;
    const cryptedEmail=crypto.createHash('md5').update(request.body.email).digest('hex');
    const password=crypto.createHash('md5').update(request.body.password).digest('hex');
    const id = crypto.randomBytes(3).toString('HEX');

    if(termosDeUso && validarCNPJ(cnpj)){
      try{
        await connection('granjas').insert({
          id,
          nomeFantasia,
          razaoSocial,
          cnpj,
          proprietario,
          gaiola,
          localizacao,
          termosDeUso,
          email:cryptedEmail,
          password,
          confirmationFlag:false
        });
        mailerController.sendConfirmationEmail(email,id);
      }catch(error){
        return console.log('Email já cadastrado, tente um novo email ou faça o login com sua conta antiga')
      }
      return response.json({
        id,
      });
    }else{
      return response.status(428).json({error:'Termos de uso não asssinalado ou CNPJ invalido'});
    }
  },
  async index(request,response){
    const granjas=await connection('granjas').select('*');

    return response.json(granjas)
  },
  async confirmAccount(request,response){
    const id = request.body.id;

    await connection('granjas').where('id',id).update('confirmationFlag',true)
    return response.status(200).send();
  }
};
