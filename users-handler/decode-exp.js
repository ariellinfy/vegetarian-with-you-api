const jwt = require('jsonwebtoken');

const exp = token => jwt.decode(token).exp;

module.exports = {
    exp: exp
};