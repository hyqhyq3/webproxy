function base64decode(data)
{
    var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var table = {};
    Array.prototype.map.call(charset, function(current, index){ this[current]=parseInt(index);}.bind(table));
    
    var num = 0;
    var arr = [];
    var index = 0;
    for(var i = 0; i < data.length; ++i)
    {
        var c = data[i];
        if(c == " " || c == "\n")
        {
            continue;
        }    
        index++;
        num = (num << 6) | table[c];
        if(index % 4 == 0)
        {
            arr.push((num >> 16) & 0xff);
            arr.push((num >> 8) & 0xff);
            arr.push(num & 0xff);
            num = 0;
        }
    }
    return String.fromCharCode.apply(null, arr);
}