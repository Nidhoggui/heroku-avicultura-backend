const crypto=require('crypto');
var jwt = require('jsonwebtoken');

const secret="uml1tr0d3l4gr1m4s";

module.exports={
    createJWTToken(payload){
        var token = jwt.sign(payload, secret);
        return token;
    },
    decodeJWTToken(token){
        var decoded = jwt.decode(token);
        return decoded;
    }
}