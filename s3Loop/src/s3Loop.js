// LICENSE : MIT
"use strict";
var Promise = require("es6-promise").Promise;
var isLockAsync = require("./s3Lock").isLockAsync;
var lockAsync = require("./s3Lock").lockAsync;
var invokeGetJSON = require("./lambdaset").invokeGetJSON;
/**
 *
 * @param bucket
 * @param key
 * @returns {Promise}
 */
function route(bucket, key) {
    if (key.indexOf("status.json") !== -1) {
        return changeStatusAction(bucket, key)
    }
    return Promise.resolve();
}

function changeStatusAction(bucket, key) {
    return isLockAsync(bucket).then(function (isLocked) {
        console.log("locking...");
        return lockAsync(bucket).then(function () {
            console.log("success locked");
            if (!isLocked) {
                return invokeGetJSON();
            }
            return isLocked;
        });
    });
}
exports.handler = function (event, context) {
    var bucket = event.Records[0].s3.bucket.name;
    var key = event.Records[0].s3.object.key;
    route(bucket, key).then(function (response) {
        context.done(null, response);
    }, function (error) {
        context.done(error);
    });
};