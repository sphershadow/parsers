setScreenSize();
loadHomepage();







function loadHomepage() {
    window.addEventListener("load", function () {
        //document.getElementById("loading_animation_div").style.display = "none";
        this.document.body.style.display = "flex";
    });
}


function setScreenSize() {
    document.body.style.width = window.innerWidth + "px";
    document.body.style.height = window.innerHeight + "px";
}