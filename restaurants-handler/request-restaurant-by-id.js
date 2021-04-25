const refreshData = require('./refresh-data');

const handleRequestRestaurantById = (knex) => async (req, res) => {
    let photos = [];

    try {
        await refreshData.refreshRestaurantData(knex, req.params.id);

        await knex('reviews').select('photos')
        .where('restaurant_id', '=', req.params.id)
        .then(data => {
            return photos = data.reduce((acc, item) => {
                return acc.concat(item.photos);
            }, photos);
        });

        await knex.select('*').from('restaurants')
        .where('restaurant_id', '=', req.params.id)
        .then(data => {
            data[0]['photos'] = photos;
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