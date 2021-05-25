const handleSignOut = () => async (req, res) => {
    return res.status(200).json({ status: 'Successfully sign out.' });
};

module.exports = {
    handleSignOut
};