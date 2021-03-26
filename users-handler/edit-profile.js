const refreshToken = require('./refresh');

const handleEditProfile = (knex) => (req, res) => {
	const { public_name, location } = req.body;
	if (!public_name){
		return res.status(400).json('please enter a valid name');
	}

    knex('users').where({ user_id: req.userId })
    .update({
        public_name: public_name,
        location: location
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
}

module.exports = {
    handleEditProfile: handleEditProfile
};