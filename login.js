
//tasks
loadLoginPage();


//functions
function loadLoginPage() {
    document.body.style.backgroundImage = "url(assets/ctu_argao_banner_600px.jpg)";
    window.addEventListener("load", function () {
        setScreenSize(window.innerWidth, window.innerHeight);
        setLoginBodyHeight(window.innerHeight);
        document.getElementById("login_div").style.display = "block";
        document.getElementById("loading_animation_div").style.display = "none";
    });
}

function setScreenSize(width, height) {
    document.body.style.width = width + "px";
    document.body.style.height = height + "px";
}

function setLoginBodyHeight(height) {
    const bodyheight = height - 230;
    document.getElementById("body_login_div").style.height = bodyheight + "px";
}
