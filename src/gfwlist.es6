function prepareGFWList(data)
{
    var myrules = [];
    var rules = data.split("\n");
    for(var i in rules)
    {
        if(rules[i].length == 0)
        {
            continue;
        }
        if(rules[i].startsWith("!") || rules[i].startsWith("["))
        {
            continue;
        }
        if(rules[i].startsWith("@"))
        {
            continue;
        }
        if(rules[i].startsWith("|"))
        {
            if(rules[i].startsWith("||"))
            {
                makeDomain(myrules, rules[i].substr(2));
            }
            else
            {
                makeDomain(myrules, rules[i].substr(1));
            }
        }
        else if(rules[i].startsWith("."))
        {
            makeDomain(myrules, rules[i].substr(1));
        }
    }
    return myrules;
}

var re = /^(\w+:\/\/)?([^:/]*)(:\d+)?(\/?.*)$/;
function makeDomain(myrules, str)
{
    var arr = str.match(re)
    if(arr[2] != null)
    {
        myrules.push(arr[2]);
    }
}