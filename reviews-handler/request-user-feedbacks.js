const refreshToken = require('../users-handler/refresh');

const handleRequestUserFeedbacks = (knex) => async (req, res) => {
    console.log(req.query);

	if (!req.query.restaurantId){
		return res.status(400).json('incorrect form submission');
	};

    try {
        await knex.select('*')
        .from('user_feedbacks')
        .where({ restaurant_id: req.query.restaurantId, user_id: req.userId })
        .then(data => {
            console.log(data);
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
    handleRequestUserFeedbacks: handleRequestUserFeedbacks
};