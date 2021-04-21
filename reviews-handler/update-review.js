const refreshToken = require('../users-handler/refresh');
const refreshData = require('../restaurants-handler/refresh-data');
const updateContributions = require('../users-handler/contributions');

const handleUpdateReview = (knex) => async (req, res) => {
	let { reviewId, restaurantId,
        foodRate, serviceRate, valueRate, atmosphereRate, 
        reviewTitle, reviewBody, visitPeriod, visitType, price, recommendDish, 
        disclosure } = req.body;

	if (!reviewId || !restaurantId || !foodRate || !serviceRate || !valueRate || !atmosphereRate || !reviewTitle || !reviewBody || !visitPeriod || !visitType || !price || !disclosure){
		return res.status(400).json('incorrect form submission');
	};
    
    let overallRate = 0;

    if (foodRate >= 0 && serviceRate >= 0 && valueRate >= 0 && atmosphereRate >= 0) {
        overallRate = (foodRate + serviceRate + valueRate + atmosphereRate) / 4;
    } else {
        return res.status(400).json('incorrect rating format');
    };

    if (!recommendDish) {
        recommendDish = null;
    }

    let isOwner = false;

    try {
        await knex('reviews').select('review_owner').where('review_id', '=', reviewId).then(data => {
            if (data[0].review_owner === req.userId) {
                return isOwner = true;
            } else {
                return;
            }
        })
    } catch (e) {
        res.status(400).json('error validating owner');
    };

    if (isOwner) {
        try {
            await knex('reviews').where('review_id', '=', reviewId)
            .update({
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
                disclosure: disclosure,
                last_modified: new Date()
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
            .catch(err => res.status(400).json({ error: 'unable to update data' }))
        } catch (err) {
            res.status(400).json(err);
        }
    } else {
        res.status(400).json("incorrect authentication, only review owner can update his/her review");
    }
};

module.exports = {
    handleUpdateReview: handleUpdateReview
};