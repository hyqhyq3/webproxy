
$("#btn_connect").click(function () {
    setProxy($('#server_list').val());
    refreshButton();
});

$("#btn_disconnect").click(function () {
    removeProxy();
    refreshButton();
});

var servers = getServers();

$("#settings").click(function () {
    window.open("settings.html");
});

$("#btn_manage").click(function () {
    window.open("settings.html");
});

function showServers(servers) {
    $('#server_list>option').remove();
    for (var i in servers) {
        $("<option class='server'>").text(servers[i].Address).val(servers[i].id).appendTo("#server_list");
    }
    var current = localStorage.getItem("currentProxy");
    if (current != null) {
        $(`#server_list`).val(current);
    }
}

$("#server_list").change(function () {
    setProxy($('#server_list').val());
    refreshButton();
});

showServers(servers);

function refreshButton() {
    if (!localStorage.getItem("currentProxy")) {
        $("#btn_connect").attr("disabled", false);
        $("#btn_disconnect").attr("disabled", true);
    } else {
        $("#btn_connect").attr("disabled", true);
        $("#btn_disconnect").attr("disabled", false);
    }
}

function refreshRadio() {
    var host = $('#add_exclude').val();
    if (checkInStorageArray("excludes", host)) {
        $('input[name=radio_rule][value=direct]')[0].checked = true;
    } else if (checkInStorageArray("includes", host)) {
        $('input[name=radio_rule][value=proxy]')[0].checked = true;
    } else {
        $('input[name=radio_rule][value=default]')[0].checked = true;
    }

    if (checkProxy(host)) {
        $('#add_exclude').css('color', 'blue');
    } else {
        $('#add_exclude').css('color', 'green');
    }
}

$("input[name=radio_rule]").change(function () {
    var host = $('#add_exclude').val();
    var type = this.value;
    if (type == "proxy") {
        removeStorageArrayItem("excludes", host);
        addStorageArrayItem("includes", host);
    } else if (type == "direct") {
        removeStorageArrayItem("includes", host);
        addStorageArrayItem("excludes", host);
    } else {
        removeStorageArrayItem("excludes", host);
        removeStorageArrayItem("includes", host);
    }
    refreshRadio();
});

document.addEventListener('DOMContentLoaded', function () {
    chrome.tabs.getSelected(null, function (tab) {
        var re = /(\w+):\/\/([^\:|\/]+)(\:\d*)?(.*)(\/[^#|\?|\n]+)?(#.*)?(\?.*)?/i;
        var url = tab.url;
        var arr = url.match(re);
        $('#add_exclude').val(arr[2]);
        refreshRadio();
    });
});

refreshButton();

$('#add_exclude').keyup(function () {
    refreshRadio();
});