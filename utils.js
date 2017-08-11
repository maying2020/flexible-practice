exports.parseRange = function(str,size) {
    if(str.indexOf(",") != -1)
        return;

    var range = str.split("-"),
        start = parseInt(range[0],10),
        end = parseInt(range[1],10);

    //Case : -100
    if(isNaN(start)) {
        start = size - end;
        end = size - 1;
    } else if(isNaN(end)) {    //Case: 100-
        end = size - 1;
    }

    //invalid
    if(isNaN(start) || isNaN(end) || start > end || end > size) {
        return;
    }

    return {start:start,end:end};
};
