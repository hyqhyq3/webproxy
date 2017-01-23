
$("#btn_connect").click(function(){
    setProxy($('#server_list').val());
})

$("#btn_disconnect").click(function(){
    removeProxy();
})

var servers = getServers();

$("#settings").click(function(){
    window.open("settings.html")
})

$("#btn_manage").click(function(){
    window.open("settings.html")
})

function showServers(servers)
{
    $('#server_list>option').remove();
    for(var i in servers)
    {
        $("<option class='server'>")
            .text(servers[i].Address)
            .val(servers[i].id)
            .appendTo("#server_list");
    }
    var current = localStorage.getItem("currentProxy");
    if(current != null)
    {
        $(`#server_list`).val(current);
    }
}

$("#server_list").change(function()
{
    setProxy($('#server_list').val());
})

showServers(servers);

function refreshButton()
{
    if(!localStorage.getItem("currentProxy"))
    {
        $("#btn_connect").attr("disabled", false);
        $("#btn_disconnect").attr("disabled", true);
    }
    else
    {
        $("#btn_connect").attr("disabled", true);
        $("#btn_disconnect").attr("disabled", false);
    }
}

$('#btn_add_exclude').click(function(){
    var host = $('#add_exclude').val();
    if(checkIsExclude(host))
    {
        removeExclude(host);
    }
    else
    {
        addExclude(host);
    }
    refreshExcludeButton();
})

function refreshExcludeButton()
{
    var host = $('#add_exclude').val();
    if(checkIsExclude(host))
    {
        $('#btn_add_exclude').text("remove exclude");
    }
    else
    {
        $('#btn_add_exclude').text("add exclude");
    }
}

document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.getSelected(null, function(tab){
    var re = /(\w+):\/\/([^\:|\/]+)(\:\d*)?(.*)(\/[^#|\?|\n]+)?(#.*)?(\?.*)?/i;  
    var url = tab.url;
    var arr = url.match(re)
    $('#add_exclude').val(arr[2]);
    refreshExcludeButton();
})
});

refreshButton();

$('#add_exclude').keyup(function(){
    refreshExcludeButton();
})