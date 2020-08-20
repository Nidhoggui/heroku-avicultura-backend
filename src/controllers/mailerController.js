const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport')
const connection = require('../database/connection')
const crypto= require('crypto');
const pug = require('pug');

module.exports = {
  async sendConfirmationEmail(email,id){
    const transport = nodemailer.createTransport(smtpTransport({
      service: 'Gmail',
      host: 'smtp.gmail.com',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      }
    }));
    const send = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Confirmação de Usuário',
      html: pug.renderFile(__dirname+"\\files\\"+'confirm.pug',{
        Header: 'Olá,seja bem vindo a Avicultura!',
        Content: 'Se você está aqui,você está a um passo do sistema.<br/>Clique no botão abaixo para confirmar seu email',
        Url:`${process.env.APP_FRONTEND_URL}/register/confirm/${id}`
        })
    }
    transport.sendMail(send, (error) => {
      if(error) {
        return console.log(error)
      }else{
        return console.log('Enviado com sucesso!')
    }
    });
 },

 async resetpassword(request, response){
    const email = request.body.email;
    const cryptedEmail = crypto.createHash('md5').update(request.body.email).digest('hex');

    var granja=await connection('granjas_fisicas').where('email',cryptedEmail).select('nome','id').first();

    if(granja===undefined){
      granja=await connection('granjas').where('email',cryptedEmail).select({nome:'nomeFantasia'},'id').first();
    }

    const transporter = nodemailer.createTransport(smtpTransport({
       service: 'Gmail',
       host: 'smtp.gmail.com',
       auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
       }
     }));
     const mailOptions = {
       from: process.env.EMAIL_USER,
       to: email,
       subject: 'Redefinir Senha',
       html: pug.renderFile(__dirname+"\\files\\"+'confirm.pug',{
        Header: `Olá ${granja.nome}, a quanto tempo!`,
        Content: 'Você está recebendo esse email pois recebemos um pedido seu para mudar a senha de sua conta. Caso você ache que isso seja um engano, ignore este email. Caso não, clique no botão abaixo para prosseguirmos:',
        Url: `${process.env.APP_FRONTEND_URL}/forgotpassword/change/${granja.id}`
      })
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
