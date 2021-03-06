const handleUpdateEmail = (knex) => async (req, res) => {
	const { oldEmail, newEmail } = req.body;

    if (!oldEmail || !newEmail){
		return res.status(400).json({ error:　'Please enter a valid email.' });
	};

    try {
        await knex.transaction(trx => {
            trx.update({
                email: newEmail,
                last_modified: new Date()
            })
            .into('login')
            .where('email', '=', oldEmail)
            .then(() => {
                return trx('users')
                .where({ user_id: req.userId })
                .returning('*')
                .update({
                    last_modified: new Date()
                })
                .then(user => {
                    return res.status(200).json({ user: user[0] });
                })
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
        .catch(err => res.status(400).json({ error: 'Something wrong with fetching / updating user email, app under maintenance.' }))        
    } catch (e) {
        console.log(e);
        return res.status(400).json({ error: 'Fail to update email, app under maintenance.' });
    }
};

module.exports = {
    handleUpdateEmail
};