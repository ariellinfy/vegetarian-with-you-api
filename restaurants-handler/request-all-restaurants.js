const handleRequestAllRestaurants = (knex) => async (req, res) => {
    let parts = [];
    let photoSummary = {};

    if (req.query.sortBy) {
        parts = req.query.sortBy.split(':');
    } else {
        parts = ['last_modified', 'desc']
    };

    try {
        await knex('reviews').select('restaurant_id', 'photos')
        .then(data => {
            return data.forEach(item => {
                if (photoSummary[item.restaurant_id]) {
                    return photoSummary[item.restaurant_id] = photoSummary[item.restaurant_id].concat(item.photos);
                } else {
                    return photoSummary[item.restaurant_id] = item.photos;
                }
            });
        })
        .catch(err => res.status(400).json({ error: 'Something wrong with mapping restaurants photos, app under maintenance.' }))

        await knex('restaurants')
        .select('restaurant_id', 'restaurant_name', 'address', 'city', 'region', 'country', 'postal_code', 'type', 'cuisine', 'price_range', 'overall_rate', 'review_count')
        .orderBy(parts[0], parts[1])
        .then(data => {
            if (Object.keys(photoSummary).length) {
                data = data.map(restaurant => {
                    if (photoSummary[restaurant.restaurant_id]) {
                        restaurant['photos'] = photoSummary[restaurant.restaurant_id];
                    };            
                    return restaurant;
                });
            };
            return res.status(200).json({ restaurants: data });
        })
        .catch(err => res.status(400).json({ error: 'Something wrong with fetching/mapping restaurants, app under maintenance.' }))
    } catch (e) {
        console.log(e);
        return res.status(400).json({ error: 'Fail to request restaurants, app under maintenance.' });
    }
};

module.exports = {
    handleRequestAllRestaurants
};