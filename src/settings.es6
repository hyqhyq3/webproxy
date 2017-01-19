var excludes = localStorage.getItem("excludes");
if(excludes != null)
    excludes = JSON.parse(excludes);
if(Array.isArray(excludes))
{
    $("#excludes").val(excludes.join("\n"))
}

$("#btn_save").click(function(){
    writeExcludes();
})

function writeExcludes()
{
    var excludes = $("#excludes").val().split("\n");
    excludes = excludes.filter(x=> x != "");
    localStorage.setItem("excludes", JSON.stringify(excludes));
}