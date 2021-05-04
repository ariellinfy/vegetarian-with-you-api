const handleCheckUserSession = (knex) => async (req, res) => {
	if (!req.userId) {
		return res.status(400).json({ error: 'Missing userId, please clear your disk cach/cookies and try again.' });
	};

    try {
        await knex('users').select('*').where({ user_id: req.userId })
        .then(user => {
            return res.status(200).json({ user: user[0] });
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