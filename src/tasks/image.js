// if you are using a mac os- install imagemagick command line tools first, else checkout the website and look for windows installer
//brew install imagemagick
var im = require('imagemagick'), 
        srcPath = "source_images/"
        desPath = "destination_images/"

//random image
var url="https://www.dhresource.com/0x0s/f2-albu-g5-M01-E2-13-rBVaI1kfpTOABSS1AAH27XOGb4U680.jpg/7x5ft-night-sea-jolly-roger-pirate-ship-peter.jpg";

//Image resize function
function resize(){
	im.resize({
	  srcPath: url,
	  dstPath: 'resized.jpg',
	  width: 400,
	  height: 400
	}, function(err, stdout, stderr){
	  if (err) throw err;
	  console.log('resized jpg to fit within 400x400px');
	});

}

// Image convert function
function convert() {
	im.convert([url, '-resize', '400x400', 'converted.png'], 
	function(err, stdout){
		if (err) 
			throw err;
		console.log('successfully converted image');
	});
}

// Image crop function
function crop() {
	im.crop({
		srcPath: url,
		dstPath: 'cropped.jpg',
		width: 400,
		height: 400,
		quality: 1,
		gravity: "North"
	}, function(err, stdout, stderr){
		console.log("Image cropped");
	});
}

crop()
//convert();
//resize();

//	UPLOAD to S3

//we can use amazon s3 bucket to hold the the profile pictures 
//upload image to amazon s3

// s3-uploader package have some bugs and failing to do the job.
/*var Upload=require('s3-uploader')


var client = new Upload('imagemagick-jobe', {
  aws: {
    path: 'images/',
    region: 'us-west-2',
    acl: 'public-read'
  },
 
  cleanup: {
    versions: true,
    original: false
  },
 
  original: {
    awsImageAcl: 'public-read'
  },
 
  versions: [{
    maxHeight: 1040,
    maxWidth: 1040,
    format: 'jpg',
    suffix: '-large',
    quality: 80,
    awsImageExpires: 31536000,
    awsImageMaxAge: 31536000
  },{
    maxWidth: 780,
    aspect: '3:2!h',
    suffix: '-medium'
  },{
    maxWidth: 420,
    aspect: '16:9!h',
    suffix: '-small'
  },{
    maxHeight: 100,
    aspect: '1:1',
    format: 'png',
    suffix: '-thumb1'
  },{
    maxHeight: 250,
    maxWidth: 250,
    aspect: '1:1',
    suffix: '-thumb2'
  }]
});


//image url in s3 bucket

function upload_image_to_s3(path) {
	client.upload(path, {}, function(err, versions, meta) {
		if (err) { throw err; }

		versions.forEach(function(image) {
			console.log(image.width, image.height, image.url);
		// 1024 760 https://my-bucket.s3.amazonaws.com/path/110ec58a-a0f2-4ac4-8393-c866d813b8d1.jpg 
		});
	});
}

upload_image_to_s3('band.jpg');

*/
