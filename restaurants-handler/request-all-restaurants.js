const handleRequestAllRestaurants = (knex) => async (req, res) => {
    console.log(req.query);

    try {
        await knex.select('restaurant_id', 'restaurant_name', 'address', 'city', 'region', 'country', 'postal_code', 'type', 'cuisine', 'price_range', 'overall_rate').from('restaurants')
        .then(data => {
            return res.status(200).json({ data: data });
        })
        .catch(err => res.status(400).json({ error: 'unable to fetch data' }))
    } catch (err) {
        res.status(400).json(err);
    }
};

module.exports = {
    handleRequestAllRestaurants: handleRequestAllRestaurants
};