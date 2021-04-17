const refreshToken = require('./refresh');

const handleDeleteAvatar = (knex) => async (req, res) => {

    try {
        
    } catch (err) {
        res.status(400).json(err);
    }
};

module.exports = {
    handleDeleteAvatar: handleDeleteAvatar
};