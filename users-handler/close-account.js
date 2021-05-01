const fs = require('fs');
const path = require('path');

const handleCloseAccount = (knex, bcrypt) => async (req, res) => {
	const { email, password } = req.body;

    if (!email || !password) {
		return res.status(400).json('unable to process request, missing input data');
	};

    let isValid = false;

    try {
        isValid = await knex.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            return bcrypt.compare(password, data[0].hash);
        });
    } catch (e) {
        res.status(400).json('unable to verify password');
    };

    if (isValid) {
        try {
            await knex('users').select('avatar').where({ user_id: req.userId })
            .then(data => {
                if (data[0]) {
                    const avatarPath = path.join(__dirname, `../${data[0].avatar}`);
                    fs.unlink(avatarPath, err => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                    });
                }
            });

            await knex.select('*').from('login')
            .where({ email: email })
            .del()
            .then(() => {
				return res.status(200).json('successfully close account, user account deleted');
			})
			.catch(err => res.status(400).json('unable to delete account'))
        } catch (err) {
            res.status(400).json(err);
        }
    } else {
        res.status(400).json('incorrect password');
    }
};

module.exports = {
    handleCloseAccount: handleCloseAccount
};