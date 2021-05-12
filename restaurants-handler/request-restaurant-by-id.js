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
        })
        .catch(err => res.status(400).json({ error: 'Something wrong with mapping restaurant photos from reviews, app under maintenance.' }))

        await knex.select('*').from('restaurants')
        .where('restaurant_id', '=', req.params.id)
        .then(data => {
            data[0]['photos'] = photos;
            return res.status(200).json({ restaurant: data[0] });
        })
        .catch(err => res.status(400).json({ error: 'Something wrong with fetching/mapping restaurant photos, app under maintenance.' }))
    } catch (e) {
        console.log(e);
        return res.status(400).json({ error: 'Fail to request single restaurant by id, app under maintenance.' });
    }
};

module.exports = {
    handleRequestRestaurantById
};