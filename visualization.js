function asyncGetRequest(requestURL, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", requestURL, true); 
    xmlHttp.send(null);
}

const CV_IT_STATS_URL = "https://cors.io/?https://voice.mozilla.org/api/v1/it/clips/stats"

asyncGetRequest(CV_IT_STATS_URL, function(response) {
    console.log(response);
});