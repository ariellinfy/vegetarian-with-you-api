const refreshRestaurantData = async (knex, restaurantId) => {
    try {
        await knex.select('food_rate').from('reviews')
        .where('restaurant_id', '=', restaurantId)
        .then(data => {
            console.log(data)
            return knex('restaurants').update({
                // food_rate: avg(data[0].food_rate),
            })
        })
        .catch()

        // await knex.select('food_rate', 'service_rate', 'value_rate', 'atmosphere_rate', 'overall_rate').from('reviews')
        // .where('restaurant_id', '=', restaurantId)
        // .then(data => {
        //     console.log(data)
        //     return knex('restaurants').update({
        //         // food_rate: avg(data[0].food_rate),
        //         // service_rate: avg(data[0].service_rate),
        //         // value_rate: avg(data[0].value_rate),
        //         // atmosphere_rate: avg(data[0].atmosphere_rate),
        //         // overall_rate: avg(data[0].overall_rate),
        //     })
        // })
        // .catch()
    } catch {

    }
};

module.exports = {
    refreshRestaurantData: refreshRestaurantData
};