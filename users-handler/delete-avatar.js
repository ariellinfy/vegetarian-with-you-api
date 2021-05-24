const cloudinary = require('cloudinary').v2;

const handleDeleteAvatar = (knex) => (req, res) => {
    const { avatar } = req.body;

    if (!avatar.public_id) {
		return res.status(400).json({ error: 'Avatar url missing.' });
	};

    cloudinary.config({ 
        cloud_name: 'alinfy', 
        api_key: '225325956632848', 
        api_secret: 'pNuy4D20wzTqjorV1y47ms_dKok' 
    });

    cloudinary.uploader.destroy(avatar.public_id, invalidate=true, function(error, result) {
        if (error) {
            return res.status(400).json({ error: 'Fail to remove cloudinary avatar, app under maintenance.' });
        };
        if (result.result === 'not found') {
            return res.status(400).json({ error: 'Cloudinary avatar not found, app under maintenance.' });
        };
        if (result.result === 'ok') {
            knex('users').where({ user_id: req.userId })
            .update({
                avatar: null,
                last_modified: new Date()
            })
            .returning('*')
            .then(user => {
                return res.status(200).json({ user: user[0] });
            })
            .catch(err => res.status(400).json({ error: 'Something wrong with updating user avatar / fetching user info, app under maintenance.' }))
        };
    })
};

module.exports = {
    handleDeleteAvatar
};