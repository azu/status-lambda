// LICENSE : MIT
"use strict";
module.exports = {
    region: 'us-west-2',
    handler: 's3Loop.handler',
    role: "arn:aws:iam::269409946579:role/AWSLambdaExecute",
    functionName: "s3Loop",
    timeout: 60
};