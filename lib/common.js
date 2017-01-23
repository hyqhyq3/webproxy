function setProxy(serverId) {
    var excludes = getExcludesString();
    localStorage.setItem("currentProxy", serverId);

    var server = getServer(serverId);
    if (server == null) {
        alert("请选择正确的服务器");
    }
    var config = {
        mode: "pac_script",
        pacScript: { data: `

            var hosts = {
                ${ excludes }
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
                return "${ server.Type } ${ server.Address }";
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

function refreshProxy() {
    var serverId = localStorage.getItem("currentProxy");
    if (serverId) {
        setProxy(serverId);
    }
}

function getExcludesString() {
    var excludes = localStorage.getItem("excludes");
    if (excludes != null) excludes = JSON.parse(excludes);
    if (Array.isArray(excludes)) {
        return excludes.map(x => `"${ x }":1`).join(",");
    }
    return "";
}

function getExcludeArray() {
    var excludes = localStorage.getItem("excludes");
    if (excludes != null) {
        excludes = JSON.parse(excludes);
        return excludes;
    }
    return [];
}

function addExclude(host) {
    var host = host.trim();
    var excludes = getExcludeArray();
    if (excludes.indexOf(host) != -1) {
        return;
    }
    excludes.push(host);
    writeExcludes(excludes);
}

function checkIsExclude(host) {
    var host = host.trim();
    var excludes = getExcludeArray();
    return excludes.indexOf(host) != -1;
}

function removeExclude(host) {
    var host = host.trim();
    var excludes = getExcludeArray();
    if (excludes.indexOf(host) == -1) {
        return;
    }
    excludes.splice(excludes.indexOf(host), 1);
    writeExcludes(excludes);
}

function writeExcludes(excludes) {
    localStorage.setItem("excludes", JSON.stringify(excludes));

    refreshProxy();
}

function getServers() {
    var servers = window.localStorage.getItem("servers");
    var serversArr = [];
    try {
        serversArr = JSON.parse(servers);
    } catch (e) {}
    if (Array.isArray(serversArr)) {
        return serversArr.filter(x => x != null);
    }
    return [];
}

function getServer(id) {
    var servers = getServers();
    for (var i in servers) {
        if (servers[i].id == id) {
            return servers[i];
        }
    }
    return null;
}

function getUserPassByHostPort(host) {
    var servers = getServers();
    var arr = servers.filter(x => x.Address == host);
    if (arr.length > 0) {
        return {
            username: arr[0].Username,
            password: arr[0].Password
        };
    }
}

function addServer(data) {
    var servers = getServers();
    var id = servers.length + 1;
    var server = { id: id };
    for (var i in data) {
        server[i] = data[i];
    }
    servers.push(server);
    writeServers(servers);
    return server;
}

function updateServer(data) {
    var servers = getServers();
    for (var i in servers) {
        if (servers[i].id == data.id) {
            servers[i] = data;
        }
    }
    writeServers(servers);
}

function writeServers(serversArr) {
    window.localStorage.setItem("servers", JSON.stringify(serversArr));
}

function removeServer(id) {
    var servers = getServers();
    for (var i in servers) {
        if (servers[i].id == id) {
            delete servers[i];
            break;
        }
    }
    writeServers(servers);
}