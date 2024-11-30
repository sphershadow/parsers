
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

document.getElementById("homelobby_btn").addEventListener("click", function () {
    showBodyWrapper("home_all_sec");
    selectNavIcon("homelobby_img");
    selectNavLbl("homelobby_lbl");

    //revert
    hideBodyWrapper("game_student_sec");
    revertNavIcon("homegame_img");
    revertNavLbl("homegame_lbl");

    hideBodyWrapper("library_student_sec");
    revertNavIcon("homelibrary_img");
    revertNavLbl("homelibrary_lbl");

    hideBodyWrapper("chatgpt_all_sec");
    revertNavIcon("homechatbot_img");
    revertNavLbl("homechatbot_lbl");
});
document.getElementById("homegame_btn").addEventListener("click", function () {
    showBodyWrapper("game_student_sec");
    selectNavIcon("homegame_img");
    selectNavLbl("homegame_lbl");

    //revert
    hideBodyWrapper("home_all_sec");
    revertNavIcon("homelobby_img");
    revertNavLbl("homelobby_lbl");

    hideBodyWrapper("library_student_sec");
    revertNavIcon("homelibrary_img");
    revertNavLbl("homelibrary_lbl");

    hideBodyWrapper("chatgpt_all_sec");
    revertNavIcon("homechatbot_img");
    revertNavLbl("homechatbot_lbl");
});
document.getElementById("homelibrary_btn").addEventListener("click", function () {
    showBodyWrapper("library_student_sec");
    selectNavIcon("homelibrary_img");
    selectNavLbl("homelibrary_lbl");

    //revert
    hideBodyWrapper("home_all_sec");
    revertNavIcon("homelobby_img");
    revertNavLbl("homelobby_lbl");

    hideBodyWrapper("game_student_sec");
    revertNavIcon("homegame_img");
    revertNavLbl("homegame_lbl");

    hideBodyWrapper("chatgpt_all_sec");
    revertNavIcon("homechatbot_img");
    revertNavLbl("homechatbot_lbl");
});
document.getElementById("homechatbot_btn").addEventListener("click", function () {
    showBodyWrapper("chatgpt_all_sec");
    selectNavIcon("homechatbot_img");
    selectNavLbl("homechatbot_lbl");

    //revert
    hideBodyWrapper("home_all_sec");
    revertNavIcon("homelobby_img");
    revertNavLbl("homelobby_lbl");

    hideBodyWrapper("game_student_sec");
    revertNavIcon("homegame_img");
    revertNavLbl("homegame_lbl");

    hideBodyWrapper("library_student_sec");
    revertNavIcon("homelibrary_img");
    revertNavLbl("homelibrary_lbl");
});

document.getElementById("homelobby_btnx").addEventListener("click", function () {
    showBodyWrapper("home_all_sec");
    selectNavIcon("homelobby_imgx");
    selectNavLbl("homelobby_lblx");

    //revert
    hideBodyWrapper("honors_teacher_sec");
    revertNavIcon("homehonors_img");
    revertNavLbl("homehonors_lbl");

    hideBodyWrapper("share_teacher_sec");
    revertNavIcon("homeshare_img");
    revertNavLbl("homeshare_lbl");

    hideBodyWrapper("chatgpt_all_sec");
    revertNavIcon("homechatbot_imgx");
    revertNavLbl("homechatbot_lblx");
});

document.getElementById("homehonors_btn").addEventListener("click", function () {
    showBodyWrapper("honors_teacher_sec");
    selectNavIcon("homehonors_img");
    selectNavLbl("homehonors_lbl");

    //revert
    hideBodyWrapper("home_all_sec");
    revertNavIcon("homelobby_imgx");
    revertNavLbl("homelobby_lblx");

    hideBodyWrapper("share_teacher_sec");
    revertNavIcon("homeshare_img");
    revertNavLbl("homeshare_lbl");

    hideBodyWrapper("chatgpt_all_sec");
    revertNavIcon("homechatbot_imgx");
    revertNavLbl("homechatbot_lblx");
});

document.getElementById("homeshare_btn").addEventListener("click", function () {
    showBodyWrapper("share_teacher_sec");
    selectNavIcon("homeshare_img");
    selectNavLbl("homeshare_lbl");

    //revert
    hideBodyWrapper("home_all_sec");
    revertNavIcon("homelobby_imgx");
    revertNavLbl("homelobby_lblx");

    hideBodyWrapper("honors_teacher_sec");
    revertNavIcon("homehonors_img");
    revertNavLbl("homehonors_lbl");

    hideBodyWrapper("chatgpt_all_sec");
    revertNavIcon("homechatbot_imgx");
    revertNavLbl("homechatbot_lblx");
});

document.getElementById("homechatbot_btnx").addEventListener("click", function () {
    showBodyWrapper("chatgpt_all_sec");
    selectNavIcon("homechatbot_imgx");
    selectNavLbl("homechatbot_lblx");


    //revert
    hideBodyWrapper("home_all_sec");
    revertNavIcon("homelobby_imgx");
    revertNavLbl("homelobby_lblx");

    hideBodyWrapper("honors_teacher_sec");
    revertNavIcon("homehonors_img");
    revertNavLbl("homehonors_lbl");

    hideBodyWrapper("share_teacher_sec");
    revertNavIcon("homeshare_img");
    revertNavLbl("homeshare_lbl");
});

function showBodyWrapper(id) {
    document.getElementById(id).style.display = "flex";
}
function selectNavIcon(id) {
    document.getElementById(id).style.filter = "invert(30%) sepia(59%) saturate(7076%) hue-rotate(350deg) brightness(88%) contrast(120%)";
}
function selectNavLbl(id) {
    document.getElementById(id).style.color = "#f30505";
}
function hideBodyWrapper(id) {
    document.getElementById(id).style.display = "none";
}
function revertNavIcon(id) {
    document.getElementById(id).style.filter = "invert(54%) sepia(8%) saturate(27%) hue-rotate(319deg) brightness(91%) contrast(85%)";
}
function revertNavLbl(id) {
    document.getElementById(id).style.color = "#808080";
}