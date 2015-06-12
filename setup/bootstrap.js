// LICENSE : MIT
"use strict";
var config = require("./config");
var AWS = require("aws-sdk");
AWS.config.region = config.aws.region;
var sns = require("./setup-sns");
var sqs = require("./setup-sqs");

var createQueue = sqs.createQueueAsync.bind(sqs, config.sqs.queueName);
var createTopic = sns.createTopicAsync.bind(sns, config.sns.topicName);
createQueue().then(createTopic).then(function () {
    console.log("Success - SQS,SNS");
}).catch(function (error) {
    console.log(error.stack);
});
