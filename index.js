//tasks
redirectParser();

//functions
function redirectParser() {
    const parser_uid = localStorage.getItem("user-parser");
    if (parser_uid == null) {
        window.location.href = "login.html";
    }
    if (parser_uid != null) {
        window.location.href = "homepage.html";
    }
}