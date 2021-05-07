const handleReportReview = (knex) => async (req, res) => {
	const { restaurantId, reviewId, reportText } = req.body;

	if (!restaurantId || !reviewId || !reportText.length){
		return res.status(400).json({ error: "Required info missing, app under maintenance." });
	};

    if (req.userId) {
        try {
            await knex('user_feedbacks').select('user_report').where({restaurant_id: restaurantId, review_id: reviewId, user_id: req.userId})
            .then(data => {
                if (!data.length) {
                    return knex('user_feedbacks').insert({
                        user_id: req.userId,
                        review_id: reviewId,
                        restaurant_id: restaurantId,
                        user_report: 1
                    });
                } else {
                    return knex('user_feedbacks').where({restaurant_id: restaurantId, review_id: reviewId, user_id: req.userId})
                    .update({
                        user_report: data[0].user_report+1
                    })
                }
            });

            await knex('users').select('report_total').where({user_id: req.userId})
            .then(data => {
                return knex('users').where({user_id: req.userId})
                .update({
                    report_total: data[0].report_total+1
                })
            });
            
            await knex('reviews').select('report_count', 'report_text').where({restaurant_id: restaurantId, review_id: reviewId})
            .then(data => {
                return knex('reviews').where({restaurant_id: restaurantId, review_id: reviewId})
                .update({
                    report_count: data[0].report_count+1,
                    report_text: data[0].report_text === null ? reportText : data[0].report_text + '. ' + reportText
                })
                .then(() => {
                    return res.status(200).json('Report review success.');
                })
                .catch(err => res.status(400).json({ error: 'Unable to report review, app under maintenance.' }))
            });
        } catch (e) {
            console.log(e);
            return res.status(400).json({ error: 'Fail to report review, app under maintenance.' });
        }
    } else {
        return res.status(400).json({ error: "Auth missing, please sign in to report, app under maintenance." });
    }
};

module.exports = {
    handleReportReview: handleReportReview
};