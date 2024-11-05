setScreenSize(window.innerWidth, window.innerHeight);
redirectParser();


//functions
function setScreenSize(width, height) {
    document.body.style.width = width + "px";
    document.body.style.height = height + "px";
}

function redirectParser() {
    const parser_uid = localStorage.getItem("user-parser");
    if (parser_uid == null) {
        window.location.href = "login.html";
    }
    if (parser_uid != null) {
        window.location.href = "homepage.html";
    }
}