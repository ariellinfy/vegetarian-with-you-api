const refreshToken = require('../users-handler/refresh');

const handleReportReview = (knex) => async (req, res) => {
	const { reviewId, reportText } = req.body;

	if (!reviewId || !reportText.length){
		return res.status(400).json('incorrect form submission');
	};

    if (req.userId) {
        try {
            await knex('user_comments').select('user_report').where({review_id: review_id, user_id: req.userId})
            .then(data => {
                return knex('user_comments').where({review_id: review_id, user_id: req.userId})
                .update({
                    user_report: data[0].user_report+1
                })
            })
            
            await knex('reviews').select('report_count', 'report_text').where('review_id', '=', reviewId)
            .then(data => {
                return knex('reviews').where('review_id', '=', reviewId)
                .update({
                    report_count: data[0].report_count+1,
                    report_text: data[0].report_text === null ? reportText : data[0].report_text + '. ' + reportText
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
        res.status(400).json("incorrect authentication, please sign in to report");
    }
};

module.exports = {
    handleReportReview: handleReportReview
};