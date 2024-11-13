



//global variables
const userparser = localStorage.getItem("name-parser");
const emailparser = localStorage.getItem("email-parser");
console.log(name);

//pre-tasks
window.addEventListener("load", function () {
    document.getElementById("loading_animation_div").style.display = "none";
    setScreenSize(window.innerWidth, window.innerHeight);
});

//processes
document.getElementById("userparser_lbl").innerHTML = userparser;
document.getElementById("email_lbl").innerHTML = censorEmail(emailparser);

//functions
function setScreenSize(width, height) {
    document.body.style.width = width + "px";
    document.body.style.height = height + "px";
}

function censorEmail(email) {
    const [local, domain] = email.split('@');
    const visibleLocal = local.slice(0, 4);
    const censoredLocal = visibleLocal + '*'.repeat(local.length - 4);
    return censoredLocal + '@' + domain;
}

