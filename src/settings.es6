$.extend({
    parseQuery: function(str){
        return str.split("&").map(function(n){
            return n = n.split("="),this[decodeURIComponent(n[0])] = decodeURIComponent(n[1]),this
        }.bind({}))[0];
    }
})

var excludes = getExcludeArray();
$("#excludes").val(excludes.join("\n"))

$("#btn_save").click(function(){
    var excludes = $("#excludes").val().split("\n");
    excludes = excludes.filter(x=> x != "");
    writeExcludes(excludes);
})

$('#server-list').jtable({
    title: "代理服务器列表",
    actions: {
        listAction: function() {
            var servers = getServers();
            return {
                "Result": "OK",
                "Records": servers,
            };
        },
        deleteAction: function(data) {
            removeServer(data.id)
            return {
                "Result": "OK"
            };
        },
        updateAction: function(data) {
            var data = $.parseQuery(data);
            console.log(data);
            var obj = updateServer(data);
            return {
                "Result": "OK",
                "Record": obj,
            }
        },
        createAction: function(data) {
            var data = $.parseQuery(data);
            var obj = addServer(data);
            return {
                "Result": "OK",
                "Record": obj,
            }
        }
    },
    fields: {
        id: {
            title: "id",
            key: true,
        },
        Type: {
            title: "类型",
            options: {
                "HTTPS": "HTTPS",
                "SOCKS5":"SOCKS5",
                "PROXY":"HTTP"
            }
        },
        Address: { 
            title: "服务器地址",
            defaultValue: "host:port"
        },
        Username: {
            title: "用户名",
        },
        Password: {
            list: false,
            title: "密码",
            type: "password",
        }

    }
});
$("#server-list").jtable("load");