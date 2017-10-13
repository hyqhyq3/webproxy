chrome.webRequest.onAuthRequired.addListener(
        function(details, callback) {
            if(details.isProxy)
            {
                var userpass = getUserPassByHostPort(details.challenger.host + ":" + details.challenger.port);
                console.log(details.challenger, userpass);
                callback({authCredentials: userpass});
            }
            else
            {
                callback({});
            }
        },
        {urls: ["<all_urls>"]},
        ["asyncBlocking"]);

