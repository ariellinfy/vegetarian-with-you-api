const handleRequestRestaurantReviews = (knex) => async (req, res) => {
    if (req.query.restaurantId) {
        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':');
            try {
                await knex.select('*')
                .from('reviews')
                .where('restaurant_id', '=', req.query.restaurantId)
                .orderBy(parts[0], parts[1])
                .then(data => {
                    return res.status(200).json({ data: data });
                })
                .catch(err => res.status(400).json({ error: 'unable to fetch data' }))
            } catch (err) {
                res.status(400).json(err);
            }
        } else {
            try {
                await knex.select('*')
                .from('reviews')
                .where('restaurant_id', '=', req.query.restaurantId)
                .orderBy('create_at', 'desc')
                .then(data => {
                    return res.status(200).json({ data: data });
                })
                .catch(err => res.status(400).json({ error: 'unable to fetch data' }))
            } catch (err) {
                res.status(400).json(err);
            }
        }   
    } else {
        res.status(400).json({ error: 'restaurant id not provided' });
    }
};

module.exports = {
    handleRequestRestaurantReviews: handleRequestRestaurantReviews
};