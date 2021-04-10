const refreshToken = require('../users-handler/refresh');

const handleRequestUserReviews = (knex) => async (req, res) => {
    if (req.userId) {
        try {
            await knex.select('*')
            .from('reviews')
            .where('review_owner', '=', req.userId)
            .orderBy('last_modified', 'desc')
            .then(data => {
                const token = refreshToken.refresh(req.exp, req.userId, req.token);
                if (!token) {
                    res.status(400).json('token expired');
                }
                return res.status(200).json({ data: data, token });
            })
            .catch(err => res.status(400).json({ error: 'unable to fetch data' }))
        } catch (err) {
            res.status(400).json(err);
        }
    } else {
        res.status(400).json({ error: 'authentication error' });
    }
};

module.exports = {
    handleRequestUserReviews: handleRequestUserReviews
};