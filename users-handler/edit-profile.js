const refreshToken = require('./refresh');

const handleEditProfile = (knex) => async (req, res) => {
	const { public_name, location } = req.body;
	if (!public_name){
		return res.status(400).json('please enter a valid name');
	}

    try {
        await knex('users').where({ user_id: req.userId })
        .update({
            public_name: public_name,
            location: location,
            last_modified: new Date()
        })
        .returning('*')
        .then(user => {
            const token = refreshToken.refresh(req.exp, req.userId, req.token);
            if (!token) {
                res.status(400).json('token expired');
            }
            return res.status(200).json({ user: user[0], token });
        })
        .catch(err => res.status(400).json(err))
    } catch (err) {
        res.status(400).json(err);
    }

    
}

module.exports = {
    handleEditProfile: handleEditProfile
};