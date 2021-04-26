const handleRequestAllRestaurants = (knex) => async (req, res) => {
    let photoSummary = {};

    try {
        await 
        knex('reviews').select('restaurant_id', 'photos')
        .then(data => {
            return data.forEach(item => {
                if (photoSummary[item.restaurant_id]) {
                    return photoSummary[item.restaurant_id] = photoSummary[item.restaurant_id].concat(item.photos);
                } else {
                    return photoSummary[item.restaurant_id] = item.photos;
                }
            });
        })
    } catch (err) {
        console.log(err);
    };

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        try {
            await knex('restaurants').select('restaurant_id', 'restaurant_name', 'address', 'city', 'region', 'country', 'postal_code', 'type', 'cuisine', 'price_range', 'overall_rate', 'review_count')
            .orderBy(parts[0], parts[1])
            .then(data => {
                data = data.map(restaurant => {
                    restaurant['photos'] = photoSummary[restaurant.restaurant_id];
                    return restaurant;
                });
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
                data = data.map(restaurant => {
                    restaurant['photos'] = photoSummary[restaurant.restaurant_id];
                    return restaurant;
                });
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