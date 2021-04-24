const refreshToken = require('../users-handler/refresh');
const refreshData = require('../restaurants-handler/refresh-data');
const updateContributions = require('../users-handler/contributions');

const handleCreateReview = (knex) => async (req, res) => {
    const photoList = req.files.map((photo) => {
        return {
            originalname: photo.originalname,
            filename: photo.filename,
            path: photo.path,
        }
    });

	let { restaurantId,
        foodRate, serviceRate, valueRate, atmosphereRate, 
        reviewTitle, reviewBody, visitPeriod, visitType, price, recommendDish, 
        disclosure } = req.body;

	if (!restaurantId || !foodRate || !serviceRate || !valueRate || !atmosphereRate || !reviewTitle || !reviewBody || !visitPeriod || !visitType || !price || !disclosure){
		return res.status(400).json('incorrect form submission');
	};
    
    let overallRate = 0;
    foodRate = parseInt(foodRate);
    serviceRate = parseInt(serviceRate);
    valueRate = parseInt(valueRate);
    atmosphereRate = parseInt(atmosphereRate);

    if (foodRate >= 0 && serviceRate >= 0 && valueRate >= 0 && atmosphereRate >= 0) {
        overallRate = (foodRate + serviceRate + valueRate + atmosphereRate) / 4;
    } else {
        return res.status(400).json('incorrect rating format');
    };

    recommendDish = recommendDish.length ? recommendDish : null;

    try {
        await knex.select('user_id').from('users')
        .where('user_id', '=', req.userId)
        .then(data => {
            return knex('reviews').insert({
                restaurant_id: restaurantId,
                review_title: reviewTitle,
                review_body: reviewBody,
                food_rate: foodRate,
                service_rate: serviceRate,
                value_rate: valueRate,
                atmosphere_rate: atmosphereRate,
                overall_rate: overallRate,
                visit_period: visitPeriod,
                type_of_visit: visitType,
                price_range: price,
                recommended_dishes: recommendDish,
                photos: JSON.stringify(photoList),
                disclosure: disclosure,
                create_at: new Date(),
                review_owner: data[0].user_id,
            })
            .returning('*')
            .then(review => {
                updateContributions.addContribution(knex, req.userId);
                refreshData.refreshRestaurantData(knex, restaurantId);
                const token = refreshToken.refresh(req.exp, req.userId, req.token);
                if (!token) {
                    res.status(400).json('token expired');
                }
                return res.status(200).json({ data: review[0], token });
            })
            .catch(err => res.status(400).json({ error: 'unable to insert new data' }))
        });
    } catch (err) {
        res.status(400).json(err);
    }
};

module.exports = {
    handleCreateReview: handleCreateReview
};