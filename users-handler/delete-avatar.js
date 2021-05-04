const fs = require('fs');
const path = require('path');

const handleDeleteAvatar = (knex) => async (req, res) => {
    const { avatar } = req.body;

    if (!avatar) {
		return res.status(400).json({ error: 'Avatar url missing' });
	};

    try {
        const avatarPath = path.join(__dirname, `../${avatar}`);

        fs.unlink(avatarPath, err => {
            if (err) {
                console.log(err);
                return res.status(400).json({ error: 'Fail to delete server stored avatar, app under maintenance.' });
            }
        }); 

        await knex('users').where({ user_id: req.userId })
        .update({
            avatar: null,
            last_modified: new Date()
        })
        .returning('*')
        .then(user => {
            return res.status(200).json({ user: user[0] });
        })
        .catch(err => res.status(400).json({ error: 'Something wrong with fetching / updating user avatar, app under maintenance.' }))
    } catch (e) {
        console.log(e);
        return res.status(400).json({ error: 'Fail to delete avatar, app under maintenance.' });
    }
};

module.exports = {
    handleDeleteAvatar: handleDeleteAvatar
};