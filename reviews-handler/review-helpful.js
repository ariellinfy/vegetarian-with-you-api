// const refreshToken = require('../users-handler/refresh');

const handleReviewHelpful = (knex) => async (req, res) => {
	const { restaurantId, reviewId, userHelpful } = req.body;

    if (!restaurantId || !reviewId || userHelpful){
		return res.status(400).json('incorrect form submission');
	};

    if (req.userId) {
        try {
            await knex('user_feedbacks').select('user_helpful').where({restaurant_id: restaurantId, review_id: reviewId, user_id: req.userId})
            .then(data => {
                if (!data.length) {
                    return knex('user_feedbacks').insert({
                        user_id: req.userId,
                        review_id: reviewId,
                        restaurant_id: restaurantId,
                        user_helpful: true
                    });
                } else {
                    return knex('user_feedbacks').where({restaurant_id: restaurantId, review_id: reviewId, user_id: req.userId})
                    .update({
                        user_helpful: true
                    })
                }
            });

            await knex('users').select('helpful_votes').where({user_id: req.userId})
            .then(data => {
                return knex('users').where({user_id: req.userId})
                .update({
                    helpful_votes: data[0].helpful_votes+1
                })
            });

            await knex('reviews').select('helpful_count').where({restaurant_id: restaurantId, review_id: reviewId})
            .then(data => {
                return knex('reviews').where({restaurant_id: restaurantId, review_id: reviewId})
                .update({
                    helpful_count: data[0].helpful_count+1
                })
                .then(() => {
                    // const token = refreshToken.refresh(req.exp, req.userId, req.token);
                    // if (!token) {
                    //     res.status(400).json('token expired');
                    // }
                    return res.status(200).json();
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