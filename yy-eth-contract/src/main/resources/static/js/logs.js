$("#searchBtn").on("click", function () {
    var name = $("#showName").val().trim()
    myFunction(name);
});

function myFunction(name) {
    if (name != null && name != undefined && name != "") {
        window.location.href="/logs/listlogs?showName=" + name;
    }
}
