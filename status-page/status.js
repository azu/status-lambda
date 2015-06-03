// LICENSE : MIT
"use strict";
function getURL(URL) {
    return new Promise(function (resolve, reject) {
        var request = new XMLHttpRequest();
        request.open("GET", URL);
        request.onload = function () {
            if (request.status >= 200 && request.status < 300) {
                resolve(request.response);
            } else {
                reject(new Error("loading error. status: " + request.status));
            }
        };
        request.onerror = function () {
            reject(new Error("loading error. status: " + request.status));
        };
        request.send();
    });
}

var div = document.getElementById("js-status");
getURL("https://s3-us-west-2.amazonaws.com/lambda2rest/status.json").then(function (response) {
    div.textContent = JSON.parse(response);
}).catch(console.log.bind(console));