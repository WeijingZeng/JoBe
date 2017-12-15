// function calls are at the end of the file
var AWS = require('aws-sdk');
var fs = require('fs');
var request = require('request');

//cannot load config from path, giving AWS.FileWriteStream is not a constructor, so hard coded the values below.
//AWS.config.loadFromPath('config.json');
AWS.config.region='us-west-2'
AWS.config.accessKeyId="AKIAIRQKEHCLTSW4LKCQ"
AWS.config.secretAccessKey="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"

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

//upload profile pictures from facebook and google to s3... need to set a default suffix or prefix with filenames
// this will not work as I was downloading the image and then trying to upload, but client(browser) doesn't understand readFile or writeFileStream
function uploadFileFromURL(remoteFilename, fileName) {
  	 download(fileName, remoteFilename, function(){			//download(uri, new_file_name, callback)
 		var fileBuffer = fs.readFileSync('google.jpg');
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
	});
	
}

// Working for google right now
function put_from_url(url, filename, callback) {
    request({
        url: url,
        encoding: null
    }, function(err, res, body) {
        if (err)
            return callback(err, res);

        s3.putObject({
        	ACL: 'public-read',
            Bucket: 'imagemagick-jobe',
            Key: 'images/'+filename,
            ContentType: res.headers['content-type'],
            ContentLength: res.headers['content-length'],
            Body: body // buffer
        }, function(error, response) {
			    console.log('uploaded file');
		});
    })
}

//download the file from remote to local 
 function download(uri, filename, callback){			// download(uri, new_file_name, callback)
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};


/*
* Get a file from s3
*/
async function getFile(fileName){
	var urlParams = {Bucket: 'imagemagick-jobe', Key: 'images/'+fileName+'.jpg'};
	//signed url as a temporary url pointing to that image
	 let url= await s3.getSignedUrl('getObject', urlParams)
	return url.substring(0, url.indexOf(".jpg"))+".jpg";
	
}

//uploadFileFromURL('images/google.jpg', 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg')
//uploadFile('images/band.jpg', 'band.jpg');
//getFile('band.jpg');

export function test(url, filename) {
	//uploadFileFromURL("google.jpg" ,url);
	put_from_url(url, filename);
}
export async function get_profile_image(filename) {
	return await getFile(filename);
}