const refreshToken = require('./refresh');

const handleUpdateEmail = (knex) => async (req, res) => {
	const { email } = req.body;

    if (!email){
		return res.status(400).json('unable to process request, missing input data');
	}
    
    try {
        await knex('users').where({ user_id: req.userId })
        .update({
            email: email
        })
        .returning('*')
        .then(user => {
            const token = refreshToken.refresh(req.exp, req.userId, req.token);
            if (!token) {
                res.status(400).json('token expired');
            }
            res.status(200).json({ user: user[0], token });
        })
        .catch(err => res.status(400).json(err))
    } catch (err) {
        res.status(400).json(err);
    };
};

module.exports = {
    handleUpdateEmail: handleUpdateEmail
};