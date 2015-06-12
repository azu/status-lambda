// LICENSE : MIT
"use strict";
var AWS = require("aws-sdk");
var config = require("./config");
var sqs = new AWS.SQS(config.aws);
var Promise = require("es6-promise").Promise;

// if exist return the one, otherwise create one.
function createQueueAsync(queueName) {
    return new Promise(function (resolve, reject) {
        var params = {
            QueueName: queueName /* required */
        };
        sqs.createQueue(params, function (err, data) {
            if (err) {
                return reject(err);
            }
            resolve(data.QueueUrl);
        });
    });
}
module.exports = {
    createQueueAsync: createQueueAsync
};