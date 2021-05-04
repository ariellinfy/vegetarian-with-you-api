// const refreshToken = require('../users-handler/refresh');

const handleRequestRestaurantReviewsWithAuth = (knex) => async (req, res) => {
    const parts = req.query.sortBy.split(':');

    if (req.query.restaurantId && req.userId) {
        try {
            await knex('reviews').select('reviews.*', 'user_feedbacks.user_helpful', 'users.public_name', 'users.avatar', 'users.contributions', 'users.helpful_votes')
            .leftJoin('user_feedbacks', function() {
                this.on('user_feedbacks.review_id', '=', 'reviews.review_id').andOn('user_feedbacks.user_id', knex.raw('?', [req.userId]))
            })
            .leftJoin('users', 'reviews.review_owner', 'users.user_id')
            .where('reviews.restaurant_id', '=', req.query.restaurantId)
            .orderBy(parts[0], parts[1])
            .then(data => {
                // const token = refreshToken.refresh(req.exp, req.userId, req.token);
                // if (!token) {
                //     res.status(400).json('token expired');
                // }
                return res.status(200).json({ data: data });
            })
            .catch(err => res.status(400).json({ error: 'with user, unable to fetch data' }))
        } catch (err) {
            res.status(400).json(err);
        }
    } else {
        res.status(400).json({ error: 'please specify restaurant id and error with user token' });
    }
};

module.exports = {
    handleRequestRestaurantReviewsWithAuth: handleRequestRestaurantReviewsWithAuth
};