const handleCheckUserSession = (knex) => async (req, res) => {
    try {
        if (req.exp - Math.floor(Date.now() / 1000) <= 0) {
            return res.status(400).json({ error: 'Token timeout, please sign in again.' });
        };

        await knex('users').select('*').where({ user_id: req.userId })
        .then(user => {
            return res.status(200).json({ user: user[0] });
        })
        .catch(err => res.status(400).json({ error: 'Something wrong with data fetching / token refreshing, app under maintenance.' }))
    } catch (e) {
        console.log(e);
        return res.status(400).json({ error: 'Fail to request user data, app under maintenance.' });
    }
};

module.exports = {
    handleCheckUserSession
};