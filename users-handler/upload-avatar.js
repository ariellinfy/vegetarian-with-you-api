const handleUploadAvatar = (knex) => async (req, res) => {
    if (!req.file){
		return res.status(400).json({ error: 'Please select a file to upload the avatar.' });
	};

    try {
        await knex('users').where({ user_id: req.userId })
        .update({
            avatar: req.file.path,
            last_modified: new Date()
        })
        .returning('*')
        .then(user => {
            return res.status(200).json({ user: user[0] });
        })
        .catch(err => res.status(400).json({ error: 'Something wrong with fetching / updating user avatar, app under maintenance.' }))
    } catch (e) {
        console.log(e);
        return res.status(400).json({ error: 'Fail to upload avatar, app under maintenance.' });
    }
};

module.exports = {
    handleUploadAvatar
};