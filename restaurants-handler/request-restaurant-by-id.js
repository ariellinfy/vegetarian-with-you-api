const handleRequestRestaurantById = (knex) => async (req, res) => {
    console.log(req.params.id);

    try {
        await knex.select('*').from('restaurants')
        .where('restaurant_id', '=', req.params.id)
        .then(data => {
            console.log(data);
            return res.status(200).json({ data: data[0] });
        })
        .catch(err => res.status(400).json({ error: 'unable to fetch data' }))
    } catch (err) {
        res.status(400).json(err);
    }
};

module.exports = {
    handleRequestRestaurantById: handleRequestRestaurantById
};