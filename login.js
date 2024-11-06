
//tasks
setScreenSize(window.innerWidth, window.innerHeight);
setLoginBodyHeight(window.innerHeight);


//functions
function setScreenSize(width, height) {
    document.body.style.width = width + "px";
    document.body.style.height = height + "px";
}

function setLoginBodyHeight(height) {
    const bodyheight = height - 210;
    document.getElementById("body_login_div").style.height = bodyheight + "px";
}