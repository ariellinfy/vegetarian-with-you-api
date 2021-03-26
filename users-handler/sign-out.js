const handleSignOut = () => async (req, res) => {
    return res.status(200).json('');
}

module.exports = {
    handleSignOut: handleSignOut
};