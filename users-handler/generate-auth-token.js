const jwt = require('jsonwebtoken');

const token = (payload) => jwt.sign({id: payload.user_id}, 'process.env.JWT_SECRET', { expiresIn: '1h' });

module.exports = {
    token: token
};