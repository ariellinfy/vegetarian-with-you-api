// const refreshToken = require('./refresh');

const handleUpdateEmail = (knex) => async (req, res) => {
	const { oldEmail, newEmail } = req.body;

    if (!oldEmail || !newEmail){
		return res.status(400).json('unable to process request, missing input data');
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
                    // const token = refreshToken.refresh(req.exp, req.userId, req.token);
                    // if (!token) {
                    //     res.status(400).json('token expired');
                    // }
                    return res.status(200).json({ user: user[0] });
                })
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
        .catch(err => res.status(400).json(err))        
    } catch (err) {
        res.status(400).json(err);
    };
};

module.exports = {
    handleUpdateEmail: handleUpdateEmail
};