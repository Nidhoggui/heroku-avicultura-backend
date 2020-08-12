const crypto=require('crypto');

const header=JSON.stringify({
    'alg': 'HS256',
    'typ': 'JWT'
});
const base64Header = Buffer.from(header).toString('base64').replace(/=/g, '');
const secret="uml1tr0d3l4gr1m4s";

const jwt=function(email,password){
    const payload = JSON.stringify({
        email,
        password
    });
    const base64Payload = Buffer.from(payload).toString('base64').replace(/=/g, '');
    const data = base64Header + '.' + base64Payload;
    const signature = crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest('base64');

    return signature.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}
module.exports=jwt; 