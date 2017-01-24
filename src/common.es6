function setProxy(serverId)
{
    var excludes = getExcludesString();
    var includes = getIncludesString();
    var gfwlist = getGFWRuleString();
    localStorage.setItem("currentProxy", serverId);

    var server = getServer(serverId);
    if(server == null)
    {
        alert("请选择正确的服务器");
    }
    var config = {
        mode: "pac_script",
        pacScript: {data: `

            var excludes = {
                ${excludes}
            }

            var includes = {
                ${includes}
            }

            var gfwhost = {
                ${gfwlist}
            }
            
            ${checkHost.toString()}

            function FindProxyForURL(url, host)
            {
                var proxy = "${server.Type} ${server.Address}";
                if(checkHost(excludes, host))
                {
                    return "DIRECT";
                }
                if(checkHost(includes, host))
                {
                    return proxy;
                }
                if(checkHost(gfwhost, host))
                {
                    return proxy;
                }
                return DIRECT;
            }
            `}
    }
    console.log("setProxy", config);
    chrome.proxy.settings.set({value: config, scope: 'regular'},function() {});
}

function checkHost(hosts, host)
{
    if(hosts == undefined)
    {
        return false;
    }
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

function removeProxy()
{
    localStorage.removeItem("currentProxy");
    var config = {
        "mode": "direct"
    };
    chrome.proxy.settings.set({value: config, scope: 'regular'},function() {});
}

function refreshProxy()
{
    var serverId = localStorage.getItem("currentProxy");
    if(serverId)
    {
        setProxy(serverId);
    }
}

function getExcludesString()
{
    var excludes = localStorage.getItem("excludes");
    if(excludes != null)
        excludes = JSON.parse(excludes);
    if(Array.isArray(excludes))
    {
        return excludes.map(x=> `"${x}":1`).join(",");
    }
    return "";
}

function getIncludesString()
{
    var includes = localStorage.getItem("includes");
    if(includes != null)
        includes = JSON.parse(includes);
    if(Array.isArray(includes))
    {
        return includes.map(x=> `"${x}":1`).join(",");
    }
    return "";
}

function getGFWRuleString()
{
    return getGFWArray().map(x=> `"${x}":1`).join(",");
}

function getGFWArray()
{
    var data = localStorage.getItem("GFWList");
    if(data == null)
    {
        return [];
    }
    return prepareGFWList(data);
}

function getStorageArray(name)
{
    var excludes = localStorage.getItem(name);
    if(excludes != null)
    {
        excludes = JSON.parse(excludes);
        return excludes;
    }
    return [];
}

function addStorageArrayItem(name, host)
{
    var host = host.trim();
    var arr = getStorageArray(name);
    if(arr.indexOf(host) != -1)
    {
        return;
    }
    arr.push(host);
    writeStorageArray(name, arr);
}

function checkInStorageArray(name, host)
{
    var host = host.trim();
    var includes = getStorageArray(name);
    return includes.indexOf(host) != -1;
}

function removeStorageArrayItem(name, host)
{
    var host = host.trim();
    var arr = getStorageArray(name);
    if(arr.indexOf(host) == -1)
    {
        return;
    }
    arr.splice(arr.indexOf(host), 1);
    writeStorageArray(name, arr);
}

function writeStorageArray(name, arr)
{
    localStorage.setItem(name, JSON.stringify(arr));

    refreshProxy();
}

function writeGFWList(data)
{
    localStorage.setItem("GFWList", data);
    localStorage.setItem("GFWListUpdateTime", new Date().toString());
    refreshProxy();
}

function getServers() 
{
    var servers = window.localStorage.getItem("servers")
    var serversArr = [];
    try {
        serversArr = JSON.parse(servers);
    }
    catch(e){}
    if(Array.isArray(serversArr))
    {
        return serversArr.filter(x=>x != null)
    }
    return [];
}

function getServer(id)
{
    var servers = getServers();
    for(var i in servers)
    {
        if(servers[i].id == id)
        {
            return servers[i];
        }
    }
    return null;
}

function getUserPassByHostPort(host)
{
    var servers = getServers();
    var arr = servers.filter(x=>x.Address == host);
    if(arr.length > 0)
    {
        return {
            username: arr[0].Username,
            password: arr[0].Password
        }
    }
    host = host.split(":")[0];
    arr = servers.filter(x => x.Address == host);
    if (arr.length > 0) {
        return {
            username: arr[0].Username,
            password: arr[0].Password
        };
    }
}

function addServer(data)
{
    var servers = getServers();
    var id = servers.length + 1;
    var server = {id: id};
    for(var i in data)
    {
        server[i] = data[i];
    }
    servers.push(server)
    writeServers(servers);
    return server;
}

function updateServer(data)
{
    var servers = getServers();
    for(var i in servers)
    {
        if(servers[i].id == data.id)
        {
            servers[i] = data;
        }
    }
    writeServers(servers);
}

function writeServers(serversArr)
{
    window.localStorage.setItem("servers", JSON.stringify(serversArr));
}

function removeServer(id)
{
    var servers = getServers();
    for(var i in servers)
    {
        if(servers[i].id == id)
        {
            delete(servers[i]);
            break;
        }
    }
    writeServers(servers);
}

function checkHostSlow(hosts, host)
{
    return checkHost(hosts.map(function(x){return this[x]=1,this}.bind({}))[0], host);
}

function checkProxy(host)
{
    var includes = getStorageArray("includes");
    var excludes = getStorageArray("excludes");
    var gfw = getGFWArray();

    if(checkHostSlow(excludes, host))
    {
        return false;
    }
    if(checkHostSlow(includes, host) || checkHostSlow(gfw, host))
    {
        return true;
    }
    return false;
}