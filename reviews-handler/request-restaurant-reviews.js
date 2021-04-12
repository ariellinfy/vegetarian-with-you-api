const handleRequestRestaurantReviews = (knex) => async (req, res) => {
    const parts = req.query.sortBy.split(':');

    if (req.query.restaurantId) {
        try {
            await knex('reviews').select('reviews.*', 'user_feedbacks.user_helpful')
            .leftJoin('user_feedbacks', function() {
                this.on('user_feedbacks.review_id', '=', 'reviews.review_id').andOn('user_feedbacks.user_report', knex.raw('?', ['-1']))
            })
            .orderBy(parts[0], parts[1])
            .then(data => {
                return res.status(200).json({ data: data });
            })
            .catch(err => res.status(400).json({ error: 'no user, unable to fetch data' }))
        } catch (err) {
            res.status(400).json(err);
        }
    } else {
        res.status(400).json({ error: 'please specify restaurant id' });
    }
};

module.exports = {
    handleRequestRestaurantReviews: handleRequestRestaurantReviews
};