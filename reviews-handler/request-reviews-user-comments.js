const refreshToken = require('../users-handler/refresh');

const handleRequestReviewsUserComments = (knex) => async (req, res) => {
    const { restaurantId } = req.body;

	if (!restaurantId){
		return res.status(400).json('incorrect form submission');
	};

    try {
        await knex.select('*')
        .from('user_comments')
        .where({restaurant_id: restaurantId, user_id: req.userId})
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
    };
};

module.exports = {
    handleRequestReviewsUserComments: handleRequestReviewsUserComments
};