// const refreshToken = require('./refresh');

const handleResetPassword = (knex, bcrypt) => async (req, res) => {
	const { email, oldPassword, newPassword } = req.body;

    if (!email || !oldPassword || !newPassword){
		return res.status(400).json('unable to process request, missing input data');
	};

    if (oldPassword === newPassword) {
        return res.status(400).json('error, new password needs to be different than old password');
    };

    let isValid = false;

    try {
        isValid = await knex.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            return bcrypt.compare(oldPassword, data[0].hash);
        });
    } catch (e) {
        res.status(400).json('unable to verify password');
    };
    
    try {
        if (isValid){
            const hash = await bcrypt.hash(newPassword, 9);
            await knex.select('*').from('login')
            .where('email', '=', email)
            .update({
                hash: hash,
                last_modified: new Date()
            })
            .catch(err => res.status(400).json('unable to update password'))

            await knex.select('*').from('users')
            .where('email', '=', email)
			.then(user => {
                // const token = refreshToken.refresh(req.exp, req.userId, req.token);
                // if (!token) {
                //     res.status(400).json('token expired');
                // }
				return res.status(200).json({ user: user[0] });
			})
			.catch(err => res.status(400).json('unable to get user'))

        } else {
            res.status(400).json('wrong credential');
        }
    } catch (err) {
        res.status(400).json(err);
    };
};

module.exports = {
    handleResetPassword: handleResetPassword
};