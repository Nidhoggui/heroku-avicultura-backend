const crypto = require('crypto');
const connection = require('../database/connection');

module.exports = {
  async create(request, response) {
    const { nomeFantasia, razaoSocial, cnpj, proprietario, gaiola, localizacao, termosDeUso } = request.body;
    const email=crypto.createHash('md5').update(request.body.email).digest('hex');
    const password=crypto.createHash('md5').update(request.body.password).digest('hex');
    const id = crypto.randomBytes(3).toString('HEX');

    function validarCNPJ(cnpj){
      cnpj = cnpj.replace(/[^\d]+/g,'')

      if(cnpj == '') return false

      if(cnpj == '00000000000000' ||
         cnpj == '11111111111111' ||
         cnpj == '22222222222222' ||
         cnpj == '33333333333333' ||
         cnpj == '44444444444444' ||
         cnpj == '55555555555555' ||
         cnpj == '66666666666666' ||
         cnpj == '77777777777777' ||
         cnpj == '88888888888888' ||
         cnpj == '99999999999999'
         )
         return false

      var tamanho = cnpj.length - 2
      var numeros = cnpj.substring(0,tamanho)
      var digitos = cnpj.substring(tamanho)
      var soma = 0;
      var pos = tamanho - 7;

      for (i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2)
            pos = 9
      }

      const resultado = soma % 11 < 2 ? 0 : 11 - soma % 11
        if (resultado != digitos.charAt(1))
          return false;

    return true;
  }

    if(termosDeUso && validarCNPJ(cnpj) == true){
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
    const granjas=await connection('granjas').select('*');

    return response.json(granjas)
  }
};
