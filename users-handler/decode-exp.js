const jwt = require('jsonwebtoken');

const exp = (token) => {
    return jwt.decode(token).exp;
};

module.exports = {
    exp: exp
};