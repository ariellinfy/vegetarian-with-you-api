const updateContributions = require('../users-handler/contributions');

const handleUpdateRestaurant = (knex) => async (req, res) => {
	const { restaurantId, restaurantName, 
        restaurantAddress, restaurantCity, restaurantRegion, restaurantCountry, restaurantPostalCode, 
        restaurantPhone, restaurantWebsite, restaurantType, restaurantCuisine,
        breakfast, brunch, lunch, dinner,
        restaurantWifi, restaurantTakeout, restaurantDelivery, restaurantPungent } = req.body;

	if (!restaurantId || !restaurantName || !restaurantAddress || !restaurantRegion || !restaurantCountry || !restaurantPhone) {
		return res.status(400).json({ error: 'Required input field missing.' });
	};
    
    try {
        await knex.select('user_id').from('users')
        .where('user_id', '=', req.userId)
        .then(data => {
            return knex('restaurants').where('restaurant_id', '=', restaurantId)
            .update({
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
                last_modified: new Date(),
                last_modified_by: data[0].user_id
            })
            .returning('*')
            .then(restaurant => {
                updateContributions.addContribution(knex, req.userId);
                return res.status(200).json({ restaurant: restaurant[0] });
            })
            .catch(err => res.status(400).json({ error: 'Something wrong with updating restaurant data, app under maintenance.' }))
        })
    } catch (e) {
        console.log(e);
        res.status(400).json({ error: 'Fail to update restaurant, app under maintenance.' });
    }
};

module.exports = {
    handleUpdateRestaurant
};