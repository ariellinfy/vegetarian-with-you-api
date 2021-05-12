const handleRequestUserReviews = (knex) => async (req, res) => {
    if (req.userId) {
        try {
            await knex('reviews').select('reviews.review_id', 'reviews.review_title', 'reviews.overall_rate', 'reviews.create_at', 'reviews.last_modified', 'restaurants.restaurant_name')
            .leftJoin('restaurants', 'reviews.restaurant_id', 'restaurants.restaurant_id')
            .where('review_owner', '=', req.userId)
            .orderBy('last_modified', 'desc')
            .then(data => {
                return res.status(200).json({ reviews: data });
            })
            .catch(err => res.status(400).json({ error: 'Unable to fetch user reviews, app under maintenance.' }))
        } catch (e) {
            console.log(e);
            return res.status(400).json({ error: 'Fail to request user reviews, app under maintenance.' });
        }
    } else {
        return res.status(400).json({ error: 'Missing user id, app under maintenance.' });
    }
};

module.exports = {
    handleRequestUserReviews
};