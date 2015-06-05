// LICENSE : MIT
"use strict";
var http = require("http");
var Promise = require("es6-promise").Promise;
var AWS = require("aws-sdk");
var endpoint = new AWS.Endpoint('s3-us-west-2.amazonaws.com');
AWS.config.region = 'us-west-2';
function getURL(URL) {
    return new Promise(function (resolve, reject) {
        http.get(URL, function (res) {
            var body = "";
            res.on("data", function (chunk) {
                body += chunk;
            });
            res.on("end", function () {
                resolve(body);
            });
        }).on('error', function (e) {
            reject(new Error("Got error: " + e.message));
        });

    });
}

function uploadS3(bucketName, params) {
    return new Promise(function (resolve, reject) {
        var s3bucket = new AWS.S3();
        s3bucket.createBucket(function () {
            s3bucket.upload({Bucket: bucketName, Key: params.key, Body: params.body}, function (err, data) {
                if (err) {
                    reject(err)
                } else {
                    resolve();
                }
            });
        });
    });
}
function deleteLock(bucketName) {
    return new Promise(function (resolve, reject) {
        var s3bucket = new AWS.S3({
            endpoint: endpoint
        });
        var params = {
            Bucket: bucketName, /* required */
            Key: "lock.lock" /* required */
        };
        s3bucket.deleteObject(params, function (error, data) {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    });
}

exports.handler = function (event, context) {
    var time = Date.now();
    var bucketName = "lambda2rest";
    getURL("http://httpbin.org/get?time=" + time).then(function (response) {
        return uploadS3(bucketName, {
            key: "status.json",
            body: response
        }).then(function () {
            console.log("delete lock");
            return deleteLock(bucketName);
        }).then(function () {
            context.done(null, "write status.json. Success！");
        });
    }).catch(function (error) {
        context.done(error);
    });
};