const refreshToken = require('../users-handler/refresh');
const refreshData = require('../restaurants-handler/refresh-data');

const handleUpdateReviewComment = (knex) => async (req, res) => {
	const { reviewId } = req.body;

	if (!reviewId){
		return res.status(400).json('incorrect form submission');
	};

    if (req.userId) {
        try {
            await knex('reviews').where('review_id', '=', reviewId)
            .update({
                helpful_user: helpful_user,
                helpful_record: helpful_record,
                report_user: report_user,
                report_record: report_record,
                report_text: report_text
            })
            .returning('*')
            .then(review => {
                refreshData.refreshRestaurantData(knex, restaurantId);
                const token = refreshToken.refresh(req.exp, req.userId, req.token);
                if (!token) {
                    res.status(400).json('token expired');
                }
                return res.status(200).json({ data: review[0], token });
            })
            .catch(err => res.status(400).json({ error: 'unable to update data' }))
        } catch (err) {
            res.status(400).json(err);
        }
    } else {
        res.status(400).json("incorrect authentication, please sign in to vote / report");
    }
};

module.exports = {
    handleUpdateReviewComment: handleUpdateReviewComment
};