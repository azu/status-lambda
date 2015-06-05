// LICENSE : MIT
"use strict";
var http = require("http");
var Promise = require("es6-promise").Promise;
var AWS = require("aws-sdk");
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

exports.handler = function (event, context) {
    var time = Date.now();
    getURL("http://httpbin.org/get?" + time).then(function (response) {
        return uploadS3("lambda2rest", {
            key: "status.json",
            body: JSON.stringify(response)
        }).then(function () {
            context.done("write status.json. Success！");
        });
    }).catch(function (error) {
        context.done(error);
    });
};