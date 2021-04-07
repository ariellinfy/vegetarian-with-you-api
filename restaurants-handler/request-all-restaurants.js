const handleRequestAllRestaurants = (knex) => async (req, res) => {
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        try {
            await knex.select('restaurant_id', 'restaurant_name', 'address', 'city', 'region', 'country', 'postal_code', 'type', 'cuisine', 'price_range', 'overall_rate', 'review_count')
            .from('restaurants')
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
            await knex.select('restaurant_id', 'restaurant_name', 'address', 'city', 'region', 'country', 'postal_code', 'type', 'cuisine', 'price_range', 'overall_rate', 'review_count')
            .from('restaurants')
            .orderBy('last_modified', 'desc')
            .then(data => {
                return res.status(200).json({ data: data });
            })
            .catch(err => res.status(400).json({ error: 'unable to fetch data' }))
        } catch (err) {
            res.status(400).json(err);
        }
    }   
};

module.exports = {
    handleRequestAllRestaurants: handleRequestAllRestaurants
};