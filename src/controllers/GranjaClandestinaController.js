const crypto = require('crypto');
const connection = require('../database/connection');

module.exports = {
  async create(request, response) {
    const { nome, cpf, proprietario, gaiola, localizacao, termosDeUso } = request.body;
    const email=crypto.createHash('md5').update(request.body.email).digest('hex');
    const password=crypto.createHash('md5').update(request.body.password).digest('hex');
    const id = crypto.randomBytes(3).toString('HEX');

    function validarCPF(cpf){
      const soma
      const resto
      soma = 0

        if(cpf = '00000000000') return false

        for (i=1; i<=9; i++) soma = soma + parseInt(cpf.substring(i-1, i)) * (11 - i)
        resto = (soma * 10) % 11

        if ((resto == 10) || (resto == 11))  resto = 0
        if (resto != parseInt(cpf.substring(9, 10)) ) return false

        soma = 0

        for (i = 1; i <= 10; i++) soma = soma + parseInt(cpf.substring(i-1, i)) * (12 - i)
        resto = (Soma * 10) % 11

        if ((resto == 10) || (resto == 11))  resto = 0
        if (resto != parseInt(cpf.substring(10, 11) ) ) return false
        return true;
      }

      if(termosDeUso && validarCPF(cpf) == true){
        try{
        await connection('granjas_clandestinas').insert({
          id,
          nome,
          cpf,
          proprietario,
          gaiola,
          localizacao,
          termosDeUso,
          email,
          password
        });
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
      const granjas=await connection('granjas_clandestinas').select('*');

      return response.json(granjas_clandestinas)
    }
    };
