const refreshToken = require('../users-handler/refresh');

const handleReviewHelpful = (knex) => async (req, res) => {
	const { reviewId, userHelpful, helpfulCount } = req.body;

	if (!reviewId){
		return res.status(400).json('incorrect form submission');
	};

    if (req.userId) {
        try {
            await knex('reviews').where('review_id', '=', reviewId)
            .update({
                user_helpful: userHelpful,
                helpful_count: helpfulCount
            })
            .then(() => {
                const token = refreshToken.refresh(req.exp, req.userId, req.token);
                if (!token) {
                    res.status(400).json('token expired');
                }
                return res.status(200).json(token);
            })
            .catch(err => res.status(400).json({ error: 'unable to update data' }))
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