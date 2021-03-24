const jwt = require('jsonwebtoken');

const token = (payload) => jwt.sign({user: payload}, 'shh');

module.exports = {
	token: token
};