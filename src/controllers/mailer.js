const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport')
const connection = require('../database/connection')

module.exports = {

async mail(request, response){
  const transport = nodemailer.createTransport(smtpTransport({
    service: 'Gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: 'sysaviculturaUFAPE@gmail.com',
      pass: '11real_password_for_above_account'
    }
  }));
  const email = request.body
  const send = {
    from: 'sysaviculturaUFAPE@gmail.com',
    to: email,
    subject: 'Confirmação de Usuário',
    text: 'Clique abaixo para confirmar a criação do usuario no sistema'
  }
  transport.sendMail(send, (error) => {
    if(error) {
      return console.log(error)
    }else{
    console.log('Enviado com sucesso!')
  }
  });
},

  async resetpassword(request, response){
    const transporter = nodemailer.createTransport(smtpTransport({
      service: 'Gmail',
      host: 'smtp.gmail.com',
      auth: {
        user: 'sysaviculturaUFAPE@gmail.com',
        pass: '11real_password_for_above_account'
      }
    }));
    const email = request.body
    const mailOptions = {
      from: 'sysaviculturaUFAPE@gmail.com',
      to: email,
      subject: 'Redefinir Senha',
      text: 'Clique abaixo para definir uma nova senha'
    }
    transporter.sendMail(mailOptions, (error) => {
      if(error) {
        return console.log(error)
      }else{
      console.log('Enviado com sucesso!')
    }
    });
  }
}
