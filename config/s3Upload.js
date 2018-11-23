const AWS = require('aws-sdk');
const AWS_ACCESS_KEY = require('./keys').IAmUserKey;
const AWS_SECRET_ACCESS_KEY = require('./keys').IAmUserSecret;
const BucketName = require('./keys').BucketName;
 
const s3Client = new AWS.S3({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    //might need to add region
});
 
const uploadParams = {
         Bucket: BucketName, 
         Key: '', // pass key
         Body: null, // pass file body
};
 
const s3 = {};
s3.s3Client = s3Client;
s3.uploadParams = uploadParams;
 
module.exports = s3;