var AWS = require('aws-sdk');
var fs = require('fs');

AWS.config.loadFromPath('config.json');

var s3 = new AWS.S3();

//to create a new bucket- we already have one
/*
var bucketParams = {Bucket: 'myBucket'};
s3.createBucket(bucketParams)
*/

/*
* if it is required to upload different types of file, we just need to change the metadata. To do that, we can create a function 
* that can find out what type of file is going to be uploaded and return the value as metadata. Then pass that value as an argument
* to the uploadFile function.
*/
function uploadFile(remoteFilename, fileName) {
  	var fileBuffer = fs.readFileSync(fileName);
  	var metaData = 'image/jpg';
  
	s3.putObject({
	    ACL: 'public-read',
	    Bucket: 'imagemagick-jobe',
	    Key: remoteFilename,
	    Body: fileBuffer,
	    ContentType: metaData
	  }, function(error, response) {
		    console.log('uploaded file: '+fileName);
	});
}

/*
* Get a file from s3
*/

function getFile(fileName){
	var urlParams = {Bucket: 'imagemagick-jobe', Key: 'images/'+fileName};
	//signed url as a temporary url pointing to that image
	s3.getSignedUrl('getObject', urlParams, function(err, url){
		console.log('the signed url of the image is', url);
	});
}

//uploadFile('images/band.jpg', 'band.jpg');
getFile('band.jpg');
