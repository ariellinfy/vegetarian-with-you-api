// const refreshToken = require('./refresh');
const fs = require('fs');
const path = require('path');

const handleDeleteAvatar = (knex) => async (req, res) => {
    const { avatar } = req.body;

    if (!req.userId || !avatar) {
		return res.status(400).json('user id or avatar url missing');
	};

    const avatarPath = path.join(__dirname, `../${avatar}`);

    fs.unlink(avatarPath, err => {
        if (err) {
            console.error(err);
            return;
        }
    });

    try {
        await knex('users').where({ user_id: req.userId })
        .update({
            avatar: null,
            last_modified: new Date()
        })
        .returning('*')
        .then(user => {
            // const token = refreshToken.refresh(req.exp, req.userId, req.token);
            // if (!token) {
            //     res.status(400).json('token expired');
            // }
            return res.status(200).json({ data: user[0] });
        })
        .catch(err => res.status(400).json(err))
    } catch (err) {
        res.status(400).json(err);
    }
};

module.exports = {
    handleDeleteAvatar: handleDeleteAvatar
};