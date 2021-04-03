const refreshToken = require('../users-handler/refresh');

const handleUpdateRestaurant = (knex) => async (req, res) => {
	const { restaurantId, restaurantName, 
        restaurantAddress, restaurantCity, restaurantRegion, restaurantCountry, restaurantPostalCode, 
        restaurantPhone, restaurantWebsite, restaurantType, restaurantCuisine,
        breakfast, brunch, lunch, dinner,
        restaurantWifi, restaurantTakeaway, restaurantDelivery, restaurantPungent } = req.body;

	if (!restaurantId || !restaurantName || !restaurantAddress || !restaurantRegion || !restaurantCountry || !restaurantPhone) {
		return res.status(400).json('incorrect form submission');
	};
    
    try {
        await knex.select('user_id').from('users')
        .where('user_id', '=', req.userId)
        .then(data => {
            return knex('restaurants').where('restaurant_id', '=', restaurantId).update({
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
                takeaway: restaurantTakeaway,
                delivery: restaurantDelivery,
                exclude_pungent: restaurantPungent,
                last_modified: new Date(),
                last_modified_by: data[0].user_id
            })
            .returning('*')
            .then(restaurant => {
                const token = refreshToken.refresh(req.exp, req.userId, req.token);
                    if (!token) {
                        res.status(400).json('token expired');
                    }
                    return res.status(200).json({ data: restaurant[0], token });
            })
            .catch(err => res.status(400).json({ error: 'unable to insert new data' }))
        })
    } catch (err) {
        res.status(400).json(err);
    }
};

module.exports = {
    handleUpdateRestaurant: handleUpdateRestaurant
};