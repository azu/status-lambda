// LICENSE : MIT
"use strict";
require("./getJSON").handler({}, {
    done : function(error,response){
        if(error){
            console.error(error);
            return;
        }
        console.log(response);
    }
});