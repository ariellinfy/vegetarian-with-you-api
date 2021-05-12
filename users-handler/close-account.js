const fs = require('fs');
const path = require('path');

const handleCloseAccount = (knex, bcrypt) => async (req, res) => {
	const { email, password } = req.body;

    if (!email || !password) {
		return res.status(400).json({ error: 'Unable to process request, missing input data.' });
	};

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
                    const avatarPath = path.join(__dirname, `../${data[0].avatar}`);
                    fs.unlink(avatarPath, err => {
                        if (err) {
                            console.log(err);
                            return res.status(400).json({ error: 'Fail to delete server stored avatar, app under maintenance.' });
                        }
                    });
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