const gm = require("gm")
const imageMagick = gm.subClass({ imageMagick: true });
const uuid = require("uuid/v4");
const AWS = require('aws-sdk');

AWS.config.region = 'us-west-2'
AWS.config.accessKeyId = "AKIAIRQKEHCLTSW4LKCQ"
AWS.config.secretAccessKey = "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"

var s3 = new AWS.S3();

const exportedMethods = {
    resizeAndCrop(buffer) {
        return new Promise(function (resolve, reject) {
            imageMagick(buffer).size(function (err, value) {
                if (err) return reject(err);
                var size = Math.min(value.width, value.height);
                var diff = Math.abs(value.width - value.height);
                var halfDiff = Math.round(diff / 2);
                //crop and resize image to 300x300 square
                imageMagick(buffer)
                    .crop(size, size, (value.width > value.height ? halfDiff : 0), (value.width < value.height ? halfDiff : 0))
                    .resize(300, 300)
                    .toBuffer("JPEG", function (err, buffer) {
                        if (err) return reject(err);
                        resolve(buffer);
                    });
            });
        });
    },

    uploadToS3AndReturnUrl(buffer) {
        return new Promise(function (resolve, reject) {
            var filename = uuid() + ".jpg";
            s3.putObject({
                ACL: 'public-read',
                Bucket: 'imagemagick-jobe',
                Key: "images/" + filename,
                Body: buffer,
                ContentType: "image/jpg"
            }, function (error, response) {
                if (error) return reject(error);
                resolve("http://imagemagick-jobe.s3.amazonaws.com/images/" + filename);
            });
        });

    }
}

module.exports = exportedMethods;