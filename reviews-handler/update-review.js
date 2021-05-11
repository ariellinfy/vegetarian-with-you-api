const refreshData = require('../restaurants-handler/refresh-data');
const fs = require('fs');
const path = require('path');

const handleUpdateReview = (knex) => async (req, res) => {
    req.body.photoOld = JSON.parse(req.body.photoOld);

	let { reviewId, restaurantId,
        foodRate, serviceRate, valueRate, atmosphereRate, 
        reviewTitle, reviewBody, visitPeriod, visitType, price, recommendDish, photoOld,
        disclosure } = req.body;

	if (!reviewId || !restaurantId || !foodRate || !serviceRate || !valueRate || !atmosphereRate || !reviewTitle || !reviewBody || !visitPeriod || !visitType || !price || !disclosure) {
		return res.status(400).json({ error: 'Required input field missing, app under maintenance.' });
	};
    
    const photoList = req.files.length ? photoOld.concat(req.files.map((photo) => {
        return {
            originalname: photo.originalname,
            filename: photo.filename,
            path: photo.path,
        }
    })) : (photoOld.length ? photoOld : []);

    let overallRate = 0;
    foodRate = parseInt(foodRate);
    serviceRate = parseInt(serviceRate);
    valueRate = parseInt(valueRate);
    atmosphereRate = parseInt(atmosphereRate);

    if (foodRate >= 0 && serviceRate >= 0 && valueRate >= 0 && atmosphereRate >= 0) {
        overallRate = (foodRate + serviceRate + valueRate + atmosphereRate) / 4;
    } else {
        return res.status(400).json({ error: 'Incorrect rating formats, app under maintenance.' });
    };

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
            await knex('reviews').select('photos').where('review_id', '=', reviewId)
            .then(data => {
                if (data[0].photos.length) {
                    const photoToDelete = [
                        ...photoOld.filter(item1 => !data[0].photos.some(item2 => item1.path === item2.path)),
                        ...data[0].photos.filter(item1 => !photoOld.some(item2 => item1.path === item2.path))
                    ];
                    return photoToDelete.forEach(photo => {
                    fs.unlink(path.join(__dirname, `../${photo.path}`), err => {
                            if (err) {
                                console.error(err);
                                return;
                            }
                        });
                    })
                }
            })
            .catch(err => res.status(400).json({ error: 'Error refreshing server stored review photos, app under maintenance.' }));

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
                photos: JSON.stringify(photoList),
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
    handleUpdateReview: handleUpdateReview
};