const cloudinary = require('cloudinary').v2;

const handleCloseAccount = (knex, bcrypt) => async (req, res) => {
	const { email, password } = req.body;

    if (!email || !password) {
		return res.status(400).json({ error: 'Unable to process request, missing input data.' });
	};
    
    cloudinary.config({ 
        cloud_name: 'alinfy', 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    let isValid = false;

    try {
        isValid = await knex.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            return bcrypt.compare(password, data[0].hash);
        });
    } catch (e) {
        return res.status(400).json({ error: 'Unable to verify password, app under maintenance.' });
    };

    if (isValid) {
        try {
            await knex('users').select('avatar').where({ user_id: req.userId })
            .then(data => {
                if (data[0].avatar) {
                    cloudinary.uploader.destroy(data[0].avatar.public_id, invalidate=true, function(error, result) {
                        if (error) {
                            return res.status(400).json({ error: 'Fail to remove cloudinary avatar, app under maintenance.' });
                        };
                        if (result.result === 'not found') {
                            return res.status(400).json({ error: 'Cloudinary avatar not found, app under maintenance.' });
                        };
                        if (result.result === 'ok') {
                            return;
                        };
                    })
                }
            });

            await knex.select('*').from('login')
            .where({ email: email })
            .del()
            .then(() => {
				return res.status(200).json('Successfully closed / deleted user account.');
			})
			.catch(err => res.status(400).json({ error: 'Unable to delete account, app under maintenance' }))
        } catch (e) {
            console.log(e);
            return res.status(400).json({ error: 'Fail to close account, app under maintenance.' });
        }
    } else {
        return res.status(400).json({ error: 'Wrong credential, please try again.' });
    }
};

module.exports = {
    handleCloseAccount
};