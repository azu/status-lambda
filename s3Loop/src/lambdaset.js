// LICENSE : MIT
"use strict";
var Promise = require("es6-promise").Promise;
var AWS = require("aws-sdk");
AWS.config.region = 'us-west-2';
function invokeGetJSON() {
    return new Promise(function (resolve, reject) {
        var lambda = new AWS.Lambda();
        lambda.invoke({
            FunctionName: "getJSON",
            Payload: null
        }, function (error, response) {
            if (error) {
                return reject(error);
            }
            resolve(response);
        });
    });
}
module.exports = {
    invokeGetJSON: invokeGetJSON
};