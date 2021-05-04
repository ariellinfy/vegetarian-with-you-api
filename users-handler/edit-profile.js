const handleEditProfile = (knex) => async (req, res) => {
	const { public_name, location } = req.body;
	
    if (!public_name) {
		return res.status(400).json({ error: 'Please enter a valid name.' });
	};

    try {
        await knex('users').where({ user_id: req.userId })
        .update({
            public_name: public_name,
            location: location,
            last_modified: new Date()
        })
        .returning('*')
        .then(user => {
            return res.status(200).json({ user: user[0] });
        })
        .catch(err => res.status(400).json({ error: 'Something wrong with fetching / updating user profile, app under maintenance.' }))
    } catch (e) {
        console.log(e);
        return res.status(400).json({ error: 'Fail to edit profile, app under maintenance.' });
    }
};

module.exports = {
    handleEditProfile: handleEditProfile
};