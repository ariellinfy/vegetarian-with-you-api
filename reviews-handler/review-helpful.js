const refreshToken = require('../users-handler/refresh');

const handleReviewHelpful = (knex) => async (req, res) => {
	const { restaurantId, review_id, userHelpful } = req.body;

    if (!restaurantId || !review_id || userHelpful){
		return res.status(400).json('incorrect form submission');
	};

    if (req.userId) {
        try {
            await knex('user_feedbacks').insert({
                user_id: req.userId,
                review_id: review_id,
                restaurant_id: restaurantId,
                user_helpful: true
            });

            await knex('reviews').select('helpful_count').where({restaurant_id: restaurantId, review_id: review_id})
            .then(data => {
                knex('reviews').where({restaurant_id: restaurantId, review_id: review_id})
                .update({
                    helpful_count: data[0].helpful_count+1
                })
                .then(() => {
                    const token = refreshToken.refresh(req.exp, req.userId, req.token);
                    if (!token) {
                        res.status(400).json('token expired');
                    }
                    return res.status(200).json(token);
                })
                .catch(err => res.status(400).json({ error: 'unable to update data' }))
            })
        } catch (err) {
            res.status(400).json(err);
        }
    } else {
        res.status(400).json("incorrect authentication, please sign in to vote");
    }
};

module.exports = {
    handleReviewHelpful: handleReviewHelpful
};