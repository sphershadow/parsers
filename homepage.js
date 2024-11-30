
//document.getElementById("username").innerText = localStorage.getItem("user-parser");


setScreenSize(window.innerWidth, window.innerHeight);
window.addEventListener("load", function () {
    document.getElementById("loading_animation_div").style.display = "none";
    document.getElementById("homepage_div").style.display = "flex";
});

function setScreenSize(width, height) {
    document.body.style.width = width + "px";
    document.body.style.height = height + "px";
}

document.getElementById("sidebar_btn").addEventListener("click", function () {
    showSidebar();
});
document.getElementById("sidebar_div").addEventListener("click", function () {
    hideSidebar();
});
function showSidebar() {
    document.getElementById("sidebar_div").style.zIndex = "100";
    document.getElementById("sidebar_div").style.display = "flex";
    document.getElementById("sidebar_frame").style.animation = "showsidebar 0.3s ease-in-out forwards";
}
function hideSidebar() {
    document.getElementById("sidebar_frame").style.animation = "hidesidebar 0.3s ease-in-out forwards";
    setTimeout(() => {
        document.getElementById("sidebar_div").style.zIndex = "-1";
    }, 300);
}
document.getElementById("logout_btn").addEventListener("click", function () {
    logout();
});
function logout() {
    localStorage.removeItem("user-parser");
    window.location.href = "login.html";
}