const cloudinary = require('cloudinary').v2;

const handleDeletePhoto = () => (req, res) => {
	const { photo } = req.body;

	if (!photo) {
		return res.status(400).json({ error: 'Photo info missing, app under maintenance.' });
	};

    cloudinary.config({ 
        cloud_name: 'alinfy', 
        api_key: '225325956632848', 
        api_secret: 'pNuy4D20wzTqjorV1y47ms_dKok' 
    });

    cloudinary.uploader.destroy(photo.public_id, invalidate=true, function(error, result) {
        if (error) {
            return res.status(400).json({ error: 'Fail to remove cloudinary photo, app under maintenance.' });
        };
        if (result.result === 'not found') {
            return res.status(400).json({ error: 'Cloudinary photo not found, app under maintenance.' });
        };
        if (result.result === 'ok') {
            return res.status(200).json({ status: 'success' });
        };
    })
};

module.exports = {
    handleDeletePhoto
};