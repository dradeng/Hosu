const stream = require('stream');
const uuidv4 = require('uuid/v4');
const s3 = require('../config/s3Delete.js');
 
exports.doDelete = (req, res) => {
	const s3Client = s3.s3Client;
	const params = s3.uploadParams;

	params.Key = req.body.fileName;


	s3Client.deleteObject(params, function(err, data) {
      if (err) {
			res.status(500).json({error:"Error -> " + err});
		}
		res.json({message: 'File deleted successfully!'});
    });
}