const refreshToken = require('../users-handler/refresh');

const handleReportReview = (knex) => async (req, res) => {
	const { reviewId, user_report, report_count, reportText } = req.body;

	if (!reviewId || !reportText.length){
		return res.status(400).json('incorrect form submission');
	};

    if (req.userId) {
        try {
            await knex('reviews').select('report_text').where('review_id', '=', reviewId)
            .then(data => {
                console.log(data);
                return knex('reviews').where('review_id', '=', reviewId)
                .update({
                    user_report: user_report++,
                    report_count: report_count++,
                    report_text: data[0].report_text + reportText
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