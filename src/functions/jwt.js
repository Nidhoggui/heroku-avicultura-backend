const crypto = require('crypto');
var jwt = require('jsonwebtoken');

const secret = "process.env.JWT_SECRET";

module.exports = {
    createJWTToken(payload) {
        var token = jwt.sign(payload, secret);
        return token;
    },
    decodeJWTToken(token) {
        var decoded = jwt.decode(token);
        return decoded;
    }
}