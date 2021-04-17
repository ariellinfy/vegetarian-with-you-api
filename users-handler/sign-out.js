const handleSignOut = () => async (req, res) => {
    return res.status(200).json('successfully sign out');
};

module.exports = {
    handleSignOut: handleSignOut
};