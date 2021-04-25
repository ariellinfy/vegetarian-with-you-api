const refreshToken = require('../users-handler/refresh');
const refreshData = require('../restaurants-handler/refresh-data');
const fs = require('fs');
const path = require('path');

const handleDeleteReview = (knex) => async (req, res) => {
	const { reviewId, restaurantId, confirmDelete } = req.body;

	if (!reviewId || !restaurantId || !confirmDelete){
		return res.status(400).json('incorrect submission form');
	};

    if (confirmDelete) {
        try {
            await knex('users').select('contributions')
            .where('user_id', '=', req.userId)
            .then(data => {
                return knex('users').where('user_id', '=', req.userId)
                .update({
                    contributions: data[0].contributions-1
                })
            });

            await knex('reviews').select('photos').where('review_id', '=', reviewId)
            .then(data => {
                if (data[0].photos.length) {
                    return data[0].photos.forEach(photo => {
                    fs.unlink(path.join(__dirname, `../${photo.path}`), err => {
                            if (err) {
                                console.error(err);
                                return;
                            }
                        });
                    })
                }
            });

            await knex.select('*').from('reviews')
            .where({ review_id: reviewId })
            .del()
			.then(() => {
                refreshData.refreshRestaurantData(knex, restaurantId);
                const token = refreshToken.refresh(req.exp, req.userId, req.token);
                if (!token) {
                    res.status(400).json('token expired');
                }
				return res.status(200).json(token);
			})
			.catch(err => res.status(400).json('unable to delete review'))
        } catch (err) {
            res.status(400).json(err);
        }
    } else {
        res.status(400).json('delete not confirm');
    }
};

module.exports = {
    handleDeleteReview: handleDeleteReview
};