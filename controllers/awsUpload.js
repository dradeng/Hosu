const stream = require('stream');
const uuidv4 = require('uuid/v4');
const s3 = require('../config/s3Upload.js');
 
exports.doUpload = (req, res) => {
	const s3Client = s3.s3Client;
	const params = s3.uploadParams;


	params.Key = req.files[0].originalname;

	params.Body = req.files[0].buffer;
	
	

	s3Client.upload(params, (err, data) => {
		if (err) {
			res.status(500).json({error:"Error -> " + err});
		}
		res.json({message: 'File uploaded successfully! -> keyname = ' + req.files[0].originalname});
	});
}
