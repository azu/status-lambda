// LICENSE : MIT
"use strict";
var event = {
    "Records": [
        {
            "eventVersion": "2.0",
            "eventSource": "aws:s3",
            "awsRegion": "us-east-1",
            "eventTime": "1970-01-01T00:00:00.000Z",
            "eventName": "ObjectCreated:Put",
            "userIdentity": {
                "principalId": "EXAMPLE"
            },
            "requestParameters": {
                "sourceIPAddress": "127.0.0.1"
            },
            "responseElements": {
                "x-amz-request-id": "C3D13FE58DE4C810",
                "x-amz-id-2": "FMyUVURIY8/IgAtTv8xRjskZQpcIZ9KG4V5Wp6S7S/JRWeUWerMUE5JgHvANOjpD"
            },
            "s3": {
                "s3SchemaVersion": "1.0",
                "configurationId": "testConfigRule",
                "bucket": {
                    "name": "lambda2rest",
                    "ownerIdentity": {
                        "principalId": "EXAMPLE"
                    },
                    "arn": "arn:aws:s3:::mybucket"
                },
                "object": {
                    "key": "status.json",
                    "size": 1024,
                    "eTag": "d41d8cd98f00b204e9800998ecf8427e"
                }
            }
        }
    ]
};

Error.stackTraceLimit = 100;
require("./src/s3Loop").handler(event, {
    done: function (error, response) {
        if (error) {
            console.error(error);
            console.error(error.stack);
            return;
        }
        console.log("done", response);
    }
});