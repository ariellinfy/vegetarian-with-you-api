const refreshRestaurantData = async (knex, restaurantId) => {
    try {
        await knex('reviews')
        .avg({ food_rate: 'food_rate' })
        .avg({ service_rate: 'service_rate' })
        .avg({ value_rate: 'value_rate' })
        .avg({ atmosphere_rate: 'atmosphere_rate' })
        .avg({ overall_rate: 'overall_rate' })
        .avg({ price_range: 'price_range' })
        .count({ review_count: 'restaurant_id' })
        .where('restaurant_id', '=', restaurantId)
        .then(data => {
            return knex('restaurants').where('restaurant_id', '=', restaurantId)
            .update({
                food_rate: data[0].food_rate,
                service_rate: data[0].service_rate,
                value_rate: data[0].value_rate,
                atmosphere_rate: data[0].atmosphere_rate,
                overall_rate: data[0].overall_rate,
                price_range: data[0].price_range,
                review_count: data[0].review_count
            })
        })
        .catch(err => console.log(err, 'error updating data'))
    } catch (err) {
        console.log(err);
    }
};

module.exports = {
    refreshRestaurantData: refreshRestaurantData
};