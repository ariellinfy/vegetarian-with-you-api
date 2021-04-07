const refreshRestaurantData = async (knex, restaurantId) => {
    try {
        await knex('reviews').avg({ food_rate: 'food_rate' })
        .avg({ service_rate: 'service_rate' })
        .avg({ value_rate: 'value_rate' })
        .avg({ atmosphere_rate: 'atmosphere_rate' })
        .avg({ overall_rate: 'overall_rate' })
        .avg({ price_range: 'price_range' })
        .count({ review_count: 'restaurant_id' })
        .where('restaurant_id', '=', restaurantId)
        .then(data => {
            console.log(data);
            console.log(round(data[0].food_rate, 2));
            console.log(round(data[0].price_range, 0));
            console.log(convert(int, data[0].review_count));

            return knex('restaurants').where('restaurant_id', '=', restaurantId)
            .update({
                food_rate: round(data[0].food_rate, 2),
                service_rate: round(data[0].service_rate, 2),
                value_rate: round(data[0].value_rate),
                atmosphere_rate: round(data[0].atmosphere_rate, 2),
                overall_rate: round(data[0].overall_rate, 2),
                price_range: round(data[0].price_range, 0),
                review_count: data[0].review_count
            })
        })
        .catch(err => res.status(400).json({ error: 'error updating data' }))
    } catch {

    }
};

module.exports = {
    refreshRestaurantData: refreshRestaurantData
};