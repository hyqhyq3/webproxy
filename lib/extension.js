function setProxy(server) {
    localStorage.setItem("currentProxy", server);
    var config = {
        mode: "pac_script",
        pacScript: { data: `

            var hosts = {
                ".cn": 1,
                "ip138.com":1,
            }
            
            function checkExclude(host)
            {
                while(host != "")
                {
                    if(hosts[host] != undefined)
                    {
                        return true;
                    }
                    var pos = host.indexOf(".");
                    if(pos == -1)
                    {
                        return false;
                    }
                    host = host.substr(pos+1);
                }
                return false;
            }

            function FindProxyForURL(url, host)
            {
                if(checkExclude(host))
                {
                    return "DIRECT";
                }
                return "HTTPS ${ server }";
            }
            ` }
    };
    chrome.proxy.settings.set({ value: config, scope: 'regular' }, function () {});
    refreshButton();
}

function removeProxy() {
    localStorage.removeItem("currentProxy");
    var config = {
        "mode": "direct"
    };
    chrome.proxy.settings.set({ value: config, scope: 'regular' }, function () {});
    refreshButton();
}

$("#btn_connect").click(function () {
    setProxy($('#server_list').val());
});

$("#btn_disconnect").click(function () {
    removeProxy();
});

var servers = window.localStorage.getItem("servers");

$("#btn_add").click(function () {
    var str = prompt("add server");
    if (!Array.isArray(servers)) {
        servers = [];
    }
    servers.push(str);
    showServers(servers);
    window.localStorage.setItem("servers", JSON.stringify(servers));
});

$("#settings").click(function () {
    window.open("settings.html");
});

function showServers(servers) {
    $('#server_list>option').remove();
    for (var i in servers) {
        $("<option class='server'>").text(servers[i]).val(servers[i]).appendTo("#server_list");
    }
    var current = localStorage.getItem("currentProxy");
    if (current != null) {
        $(`#server_list`).val(current);
    }
}

if (servers != null) {
    servers = JSON.parse(servers);
    showServers(servers);
}

function refreshButton() {
    if (!localStorage.getItem("currentProxy")) {
        $("#btn_connect").attr("disabled", false);
        $("#btn_disconnect").attr("disabled", true);
    } else {
        $("#btn_connect").attr("disabled", true);
        $("#btn_disconnect").attr("disabled", false);
    }
}

refreshButton();