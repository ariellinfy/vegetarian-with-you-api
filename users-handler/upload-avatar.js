const refreshToken = require('./refresh');

const handleUploadAvatar = (knex) => async (req, res) => {
    if (!req.file){
		return res.status(400).json('incorrect file format');
	}

    try {
        await knex('users').where({ user_id: req.userId })
        .update({
            avatar: req.file.path,
            last_modified: new Date()
        })
        .returning('*')
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
    handleUploadAvatar: handleUploadAvatar
};