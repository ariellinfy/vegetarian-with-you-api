const jwt = require('jsonwebtoken');
const userAuth = require('./generate-auth-token');

const refresh = (req, res) => {
    const auth = req.header('Authorization');
    if (auth) {
        const token = auth.replace('Bearer ', '');
    } else {
        return res.status(400).json('auth info not provided');
    }
	jwt.verify(token, 'shh', function(err, decoded) {
        if (err) {
            return res.status(400).json(err.message);
        } else {
            const nowUnixSeconds = Math.round(Number(new Date()) / 1000);
            if (payload.exp - nowUnixSeconds > 30) {
                return token;
            } else {
                const payload = {user_id: decoded.payload.id, public_name: decoded.payload.username};
                token = userAuth.token(payload);
                return token;
            }
        }
    });
}

module.exports = {
    refresh: refresh
};