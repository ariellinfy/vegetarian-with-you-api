const userAuth = require('./generate-auth-token');
const decodedExp = require('./decode-exp');

const handleRefreshToken = () => async (req, res) => {
    try {
        const payload = { user_id: req.userId };
        const token = userAuth.token(payload);
        const exp = decodedExp.exp(token);
        return res.status(200).json({ token, exp });
    } catch (error) {
        console.log(err);
        return res.status(400).json({ error: 'Fail to refresh token, , please contact admin for further assistance.' });
    }
};

module.exports = {
    handleRefreshToken: handleRefreshToken
};