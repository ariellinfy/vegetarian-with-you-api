const updateContributions = require('../users-handler/contributions');

const handleCreateRestaurant = (knex) => async (req, res) => {
	const { restaurantName, restaurantAddress, restaurantCity, restaurantRegion, restaurantCountry, restaurantPostalCode, 
        restaurantPhone, restaurantWebsite, restaurantType, restaurantCuisine,
        breakfast, brunch, lunch, dinner,
        restaurantWifi, restaurantTakeout, restaurantDelivery, restaurantPungent } = req.body;

	if (!restaurantName || !restaurantAddress || !restaurantRegion || !restaurantCountry || !restaurantPhone){
		return res.status(400).json({ error: 'Required input field missing.' });
	};
    
    try {
        await knex('users').select('user_id')
        .where('user_id', '=', req.userId)
        .then(data => {
            return knex('restaurants').insert({
                restaurant_name: restaurantName,
                address: restaurantAddress,
                city: restaurantCity,
                region: restaurantRegion,
                country: restaurantCountry,
                postal_code: restaurantPostalCode,
                phone: restaurantPhone,
                website: restaurantWebsite,
                type: restaurantType,
                cuisine: restaurantCuisine,
                breakfast: breakfast,
                brunch: brunch,
                lunch: lunch,
                dinner: dinner,
                free_wifi: restaurantWifi,
                takeout: restaurantTakeout,
                delivery: restaurantDelivery,
                exclude_pungent: restaurantPungent,
                overall_rate: 0,
                food_rate: 0,
                service_rate: 0,
                value_rate: 0,
                atmosphere_rate: 0,
                price_range: 0,
                review_count: 0,
                create_at: new Date(),
                create_by: data[0].user_id,
                last_modified_by: data[0].user_id
            })
            .returning('*')
            .then(restaurant => {
                updateContributions.addContribution(knex, req.userId);
                return res.status(200).json({ restaurant: restaurant[0] });
            })
            .catch(err => {
                if (err.code === '23505') {
                    return res.status(400).json({ error: 'This restaurant already existed, visit explore page to find detail.' })
                }
                return res.status(400).json({ error: 'Something wrong with creating new restaurant data, app under maintenance.'} )})
        });
    } catch (e) {
        console.log(e);
        res.status(400).json({ error: 'Fail to create restaurant, app under maintenance.' });
    }
};

module.exports = {
    handleCreateRestaurant: handleCreateRestaurant
};