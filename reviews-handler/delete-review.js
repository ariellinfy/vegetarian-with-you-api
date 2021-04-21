const refreshToken = require('../users-handler/refresh');

const handleDeleteReview = (bcrypt, knex) => async (req, res) => {
	const { reviewId, email, password } = req.body;

	if (!reviewId || !email || !password){
		return res.status(400).json('incorrect form submission');
	};

    let isAuth = false;

    try {
        isAuth = await knex.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            return bcrypt.compare(password, data[0].hash);
        });
    } catch (e) {
        res.status(400).json('unable to verify password');
    };

    if (isAuth) {
        try {
            await knex('users').select('contributions')
            .where('user_id', '=', req.userId)
            .then(data => {
                return knex('users').where('user_id', '=', req.userId)
                .update({
                    contributions: data[0].contributions-1
                })
            })

            await knex.select('*').from('reviews')
            .where({ review_id: reviewId })
            .del()
			.then(() => {
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
        res.status(400).json('incorrect password');
    }
};

module.exports = {
    handleDeleteReview: handleDeleteReview
};