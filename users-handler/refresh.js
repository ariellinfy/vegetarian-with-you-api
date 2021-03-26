const userAuth = require('./generate-auth-token');

const refresh = (exp, userId, token) => {
    const nowUnixSeconds = Math.round(Number(new Date()) / 1000);
    if (0 < exp - nowUnixSeconds < 60) {
        const payload = {user_id: userId};
        token = userAuth.token(payload);
        return token;
    } else if (exp - nowUnixSeconds > 60) {
        return token;
    } else {
        return null;
    }
}

module.exports = {
    refresh: refresh
};