const handleGenerateSignature = (cloudinary) => async (req, res) => {
    try {
        const signature = await cloudinary.utils.api_sign_request(req.body.params_to_sign, process.env.CLOUDINARY_API_SECRET);
        return res.status(200).json({ signature });
    } catch (e) {
        console.log(e);
        return res.status(400).json({ error: 'Fail to generate signature, app under maintenance.' });
    }
};

module.exports = {
    handleGenerateSignature
};