const refreshToken = require('./refresh');

const handleRequestUser = (knex) => async (req, res) => {
	if (!req.userId){
		return res.status(400).json('user id missing');
	}

    try {
        await knex('users').select('*').where({ user_id: req.userId })
        .then(user => {
            const token = refreshToken.refresh(req.exp, req.userId, req.token);
            if (!token) {
                res.status(400).json('token expired');
            }
            return res.status(200).json({ data: user[0], token });
        })
        .catch(err => res.status(400).json(err))
    } catch (err) {
        res.status(400).json(err);
    }
};

module.exports = {
    handleRequestUser: handleRequestUser
};