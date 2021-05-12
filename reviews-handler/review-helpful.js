const handleReviewHelpful = (knex) => async (req, res) => {
	const { restaurantId, reviewId, userHelpful } = req.body;

    if (!restaurantId || !reviewId || userHelpful) {
		return res.status(400).json({ error: "Required info missing, app under maintenance." });
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
                    return res.status(200).json('Helpful vote success.');
                })
                .catch(err => res.status(400).json({ error: 'Unable to update helpful vote, app under maintenance.' }))
            })
        } catch (e) {
            console.log(e);
            return res.status(400).json({ error: 'Fail to update review vote, app under maintenance.' });
        }
    } else {
        return res.status(400).json({ error: "Auth missing, please sign in to vote, app under maintenance." });
    }
};

module.exports = {
    handleReviewHelpful
};