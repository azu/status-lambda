// LICENSE : MIT
"use strict";
var Promise = require("es6-promise").Promise;
var AWS = require("aws-sdk");
AWS.config.region = 'us-west-2';
var endpoint = new AWS.Endpoint('s3-us-west-2.amazonaws.com');
var lockFileKey = "lock.lock";
function isLockAsync(bucketName) {
    return new Promise(function (resolve, reject) {
        var s3bucket = new AWS.S3({
            endpoint: endpoint
        });
        s3bucket.getObject({
            Bucket: bucketName,
            Key: lockFileKey
        }, function (error, data) {
            if (error) {
                console.log("not found lock file", error);
                resolve(false);
                return;
            }
            if (data) {
                resolve(true);
            }
        });
    });
}
function lockAsync(bucketName) {
    return new Promise(function (resolve, reject) {
        var s3bucket = new AWS.S3({
            endpoint: endpoint
        });
        var lockData = {
            time: Date.now()
        };
        s3bucket.putObject({
            Bucket: bucketName,
            Key: lockFileKey,
            Body: JSON.stringify(lockData)
        }, function (error, data) {
            if (error) {
                reject(error);
                return;
            }
            resolve(data);
        });
    });
}

module.exports = {
    isLockAsync: isLockAsync,
    lockAsync: lockAsync
};