const handleRequestAllRestaurants = (knex) => async (req, res) => {
    let photos = [];

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        try {
            

            await knex('restaurants').select('restaurant_id', 'restaurant_name', 'address', 'city', 'region', 'country', 'postal_code', 'type', 'cuisine', 'price_range', 'overall_rate', 'review_count')
            .orderBy(parts[0], parts[1])
            .then(data => {
                console.log(data);
                return res.status(200).json({ data: data });
            })
            .catch(err => res.status(400).json({ error: 'unable to fetch data' }))
        } catch (err) {
            res.status(400).json(err);
        }
    } else {
        try {
            await knex('restaurants').select('restaurant_id', 'restaurant_name', 'address', 'city', 'region', 'country', 'postal_code', 'type', 'cuisine', 'price_range', 'overall_rate', 'review_count')
            .orderBy('last_modified', 'desc')
            .then(data => {
                console.log(data);
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