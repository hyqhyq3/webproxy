chrome.webRequest.onAuthRequired.addListener(
        function(details, callback) {
            if(details.isProxy)
            {
                var userpass = getUserPassByHostPort(details.challenger.host + ":" + details.challenger.port);
                callback({authCredentials: userpass});
            }
        },
        {urls: ["<all_urls>"]},
        ["asyncBlocking"]);

