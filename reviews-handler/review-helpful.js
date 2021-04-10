const refreshToken = require('../users-handler/refresh');

const handleReviewHelpful = (knex) => async (req, res) => {
	const { review_id, userHelpful, helpfulCount } = req.body;

	if (!review_id || userHelpful){
		return res.status(400).json('incorrect form submission');
	};

    if (req.userId) {
        try {
            await knex('user_comments').where({review_id: review_id, user_id: req.userId})
            .update({
                user_helpful: true
            })

            await knex('reviews').where('review_id', '=', review_id)
            .update({
                helpful_count: helpfulCount+1
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