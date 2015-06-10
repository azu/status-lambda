// LICENSE : MIT
"use strict";
var AWS = require("aws-sdk");
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});
var Promise = require("es6-promise").Promise;

/**
 * everySecondごとにメッセージを発行する
 * @param everySecond
 */
function sendMessageEvery(everySecond) {
    var queueName = 'SNS_QUEUE';
    return createQueue(queueName).then(function (queueURL) {
        return batchSendMessages(queueURL, everySecond, 10);
    });
}

function batchSendMessages(queueURL, everySecond, times) {
    return new Promise(function (resolve, reject) {
        var params = {
            Entries: createEntries(everySecond, times),
            QueueUrl: queueURL /* required */
        };
        sqs.sendMessageBatch(params, function (err, data) {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    });
}
function createEntries(everySecond, times) {
    var results = [];
    for (var i = 0; i < times; i++) {
        results.push({
                Id: String(i), /* required */
                MessageBody: String(i), /* required */
                DelaySeconds: i * everySecond
            }
        )
    }
    return results;
}
// if exist return the one, otherwise create one.
function createQueue(queueName) {
    return new Promise(function (resolve, reject) {
        var params = {
            QueueName: queueName /* required */
        };
        sqs.createQueue(params, function (err, data) {
            if (err) {
                reject(err);
            }
            resolve(data.QueueUrl);
        });
    });
}

module.exports = {
    sendMessageEvery: sendMessageEvery
};