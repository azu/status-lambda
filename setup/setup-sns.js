// LICENSE : MIT
"use strict";
var AWS = require('aws-sdk');
var Promise = require("es6-promise").Promise;
var config = require("./config");
var sns = new AWS.SNS(config.aws);
function createTopicAsync(topicName) {
    return new Promise(function (resolve, reject) {
        var params = {
            Name: topicName /* required */
        };
        sns.createTopic(params, function (err, data) {
            if (err) {
                return reject(err);
            }
            resolve(data);
        });
    });
}

module.exports = {
    createTopicAsync: createTopicAsync
};