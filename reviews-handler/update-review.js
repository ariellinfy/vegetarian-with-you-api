const refreshData = require('../restaurants-handler/refresh-data');

const handleUpdateReview = (knex, cloudinary) => async (req, res) => {
	let { reviewId, restaurantId,
        foodRate, serviceRate, valueRate, atmosphereRate, 
        reviewTitle, reviewBody, visitPeriod, visitType, price, recommendDish, photos,
        disclosure, photosToDelete } = req.body;

	if (!reviewId || !restaurantId || !foodRate || !serviceRate || !valueRate || !atmosphereRate || !reviewTitle || !reviewBody || !visitPeriod || !visitType || !price || !disclosure) {
		return res.status(400).json({ error: 'Required input field missing, app under maintenance.' });
	};

    let overallRate = 0;

    if (foodRate >= 0 && serviceRate >= 0 && valueRate >= 0 && atmosphereRate >= 0) {
        overallRate = (foodRate + serviceRate + valueRate + atmosphereRate) / 4;
    } else {
        return res.status(400).json({ error: 'Incorrect rating formats, app under maintenance.' });
    };

    price = parseInt(price);
    recommendDish = (recommendDish && recommendDish !== 'null') ? recommendDish : null;

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
        return res.status(400).json({ error: 'Unable to verify user, app under maintenance.' });
    };

    if (isOwner) {
        try {
            if (photosToDelete.length) {
                photosToDelete.forEach(photo => {
                    return cloudinary.uploader.destroy(photo.public_id, invalidate=true, function(error, result) {
                        if (error) {
                            return res.status(400).json({ error: 'Fail to remove cloudinary photo, app under maintenance.' });
                        };
                        if (result.result === 'not found') {
                            return res.status(400).json({ error: 'Cloudinary photo not found, app under maintenance.' });
                        };
                        if (result.result === 'ok') {
                            return;
                        };
                    })
                })
            };

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
                photos: JSON.stringify(photos),
                disclosure: disclosure,
                last_modified: new Date()
            })
            .returning('*')
            .then(review => {
                refreshData.refreshRestaurantData(knex, restaurantId);
                return res.status(200).json({ review: review[0] });
            })
            .catch(err => res.status(400).json({ error: 'Unable to update data, app under maintenance.' }))
        } catch (e) {
            console.log(e);
            return res.status(400).json({ error: 'Fail to update review, app under maintenance.' });
        }
    } else {
        return res.status(400).json({ error: 'Incorrect authentication, only review owner can update his/her review, app under maintenance.' });
    }
};

module.exports = {
    handleUpdateReview
};