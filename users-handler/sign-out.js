const handleSignOut = () => async (req, res) => {
    return res.status(200).json('Successfully sign out.');
};

module.exports = {
    handleSignOut: handleSignOut
};