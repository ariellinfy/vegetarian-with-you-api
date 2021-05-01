const refreshToken = require('./refresh');

const handleCheckUserSession = (knex) => async (req, res) => {
	if (!req.userId) {
		return res.status(400).json({ error: 'Missing userId, please clear your disk cach/cookies and try again.' });
	};

    try {
        await knex('users').select('*').where({ user_id: req.userId })
        .then(user => {
            const token = refreshToken.refresh(req.exp, req.userId, req.token);
            if (!token) {
                res.status(400).json({ error: 'Token expired, please sign in again' });
            };
            return res.status(200).json({ user: user[0], token });
        })
        .catch(err => res.status(400).json({ error: 'Something wrong with data fetching / token refreshing.' }))
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: 'Fail to request user data, please contact admin for further assistance.' });
    }
};

module.exports = {
    handleCheckUserSession: handleCheckUserSession
};