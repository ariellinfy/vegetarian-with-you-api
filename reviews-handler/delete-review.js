const refreshData = require('../restaurants-handler/refresh-data');
const cloudinary = require('cloudinary').v2;

const handleDeleteReview = (knex) => async (req, res) => {
	const { reviewId, restaurantId, confirmDelete } = req.body;

	if (!reviewId || !restaurantId || !confirmDelete){
		return res.status(400).json({ error: "Required info missing, app under maintenance." });
	};

    cloudinary.config({ 
        cloud_name: 'alinfy', 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

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
                        cloudinary.uploader.destroy(photo.public_id, invalidate=true, function(error, result) {
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
                    }
                )}
            })
            .catch(err => res.status(400).json({ error: 'Error removing stored photos, app under maintenance.' }))

            await knex.select('*').from('reviews')
            .where({ review_id: reviewId })
            .del()
			.then(() => {
                refreshData.refreshRestaurantData(knex, restaurantId);
				return res.status(200).json({ status: 'Delete review success.' });
			})
			.catch(err => res.status(400).json({ error: 'Unable to delete review, app under maintenance.' }))
        } catch (e) {
            console.log(e);
            return res.status(400).json({ error: 'Fail to delete review, app under maintenance.' });
        }
    } else {
        return res.status(400).json({ error: "Confirmation missing, please confirm delete to proceed, app under maintenance." });
    }
};

module.exports = {
    handleDeleteReview
};