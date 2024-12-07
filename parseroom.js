//console.log(localStorage.getItem("parser-parseRoom"));





//listeners
setScreenSize(window.innerWidth, window.innerHeight);
window.addEventListener("load", async function () {
    document.getElementById("loading_animation_div").style.display = "none";
});
let startX = 0;
let endX = 0;
document.addEventListener('touchstart', (event) => {
    startX = event.touches[0].clientX;
});
document.addEventListener('touchend', (event) => {
    endX = event.changedTouches[0].clientX;
    
    if (startX - endX > 50) {
        document.getElementById("body-parseroom-div").style.animation= "parseroom-slideIn 0.6s ease-out forwards";
        document.getElementById("details-parseroom-div").style.animation= "parseroom-slideIn 0.6s ease-out forwards";
    }
});
document.getElementById("details-btn").addEventListener('click', (event) => {
    document.getElementById("body-parseroom-div").style.animation= "parseroom-slideOut 0.6s ease-out forwards";
    document.getElementById("details-parseroom-div").style.animation= "parseroom-slideOut 0.6s ease-out forwards";
});
window.addEventListener("resize", adjustChatbox);adjustChatbox();


//functions
function setScreenSize(width, height) {
    document.body.style.width = width + "px";
    document.body.style.height = height + "px";
}

function adjustChatbox() {
    const container = document.querySelector('.body-parseroom-div');
    container.style.height = `${window.innerHeight}px`;
}

function scrollToBottom() {
    const container = document.querySelector('.parseroom-body-wrapper');
    container.scrollTop = container.scrollHeight;
}
scrollToBottom();