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
    // lockの作成、更新、削除?
    if (key.indexOf("lock.lock")) {
        return lockAction(bucket, key);
    }
    return Promise.resolve();
}

/*
    ロックファイルがないならロックする
 */
function changeStatusAction(bucket, key) {
    // ロックファイルがない場合はlockDataはfalseという値が入る
    return isLockAsync(bucket).then(function (lockData) {
        if (lockData === false) {
            console.log("locking...");
            return lockAsync(bucket).then(function () {
                console.log("success locked");
            });
        }
    });
}
/*
    ロックファイルを見て、前回の呼び出しから30秒以上経過しているstatusを更新する
 */
function lockAction(bucket, key) {
    // ロックファイルがない場合はlockDataはfalseという値が入る
    return isLockAsync(bucket).then(function (lockData) {
        if (!lockData) {
            return;
        }
        var lastLockTime = lockData["lastLockTime"];
        var currentTime = Date.now();
        var halfMinute = 1000 * 30;
        // 前回の呼び出しから30秒以上経過している
        if (lastLockTime + halfMinute < currentTime) {
            console.log("30 sec");
            console.log("invoke getJSON");
            return invokeGetJSON();
        }
        // 次の呼び出しを予約する
        return lockData;
    });
}

exports.handler = function (event, context) {
    console.log("event", JSON.stringify(event, null, 4));
    var bucket = event.Records[0].s3.bucket.name;
    var key = event.Records[0].s3.object.key;
    route(bucket, key).then(function (response) {
        context.done(null, response);
    }, function (error) {
        context.done(error);
    });
};