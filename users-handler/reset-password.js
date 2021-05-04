const handleResetPassword = (knex, bcrypt) => async (req, res) => {
	const { email, oldPassword, newPassword } = req.body;

    if (!email || !oldPassword || !newPassword){
		return res.status(400).json({ error: 'Please enter a valid password.' });
	};

    if (oldPassword === newPassword) {
        return res.status(400).json({ error: 'New password needs to be different than the old password.' });
    };

    let isValid = false;

    try {
        isValid = await knex.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            return bcrypt.compare(oldPassword, data[0].hash);
        });
    } catch (e) {
        res.status(400).json({ error: 'Unable to verify password, app under maintenance.' });
    }
    
    if (isValid) {
        try {
            const hash = await bcrypt.hash(newPassword, 9);
            await knex.select('*').from('login')
            .where('email', '=', email)
            .update({
                hash: hash,
                last_modified: new Date()
            })
            .catch(err => res.status(400).json({ error: 'Unable to update password, app under maintenance.' }))
        } catch (e) {
            console.log(e);
            return res.status(400).json({ error: 'Fail to reset password, app under maintenance.' });
        }
    } else {
        return res.status(400).json({ error: 'Wrong credential, please try again.' });
    }
};

module.exports = {
    handleResetPassword: handleResetPassword
};