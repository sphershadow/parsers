


//global variables
const userparser = localStorage.getItem("name-parser");
const emailparser = localStorage.getItem("email-parser");


//pre-tasks
window.addEventListener("load", function () {
    document.getElementById("loading_animation_div").style.display = "none";
    setScreenSize(window.innerWidth, window.innerHeight);
    sendVerificationCode(emailparser, generateUniqueID());
});

//processes
document.getElementById("userparser_lbl").innerHTML = userparser;
document.getElementById("email_lbl").innerHTML = censorEmail(emailparser);

document.getElementById("resend_btn").addEventListener("click", function () {
    countdownVerification();
    sendVerificationCode(emailparser, generateUniqueID());
});



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

function countdownVerification() {

    document.getElementById("resend_btn").disabled = true;
    document.getElementById("resend_btn").style.opacity = "50%";
    let countdownNumber = 10;

    const countdownElement = document.getElementById("resend_btn");
    const countdownInterval = setInterval(() => {
        countdownElement.innerHTML = "Resend Code(" + countdownNumber + ")";
        countdownNumber--;
        if (countdownNumber < 0) {
            clearInterval(countdownInterval);
            document.getElementById("resend_btn").disabled = false;
            countdownElement.innerHTML = "Resend Code";
            document.getElementById("resend_btn").style.opacity = "100%";
        }
    }, 1000);
}


function generateUniqueID() {
    return Math.random().toString(36).substr(2, 5);
}




function sendVerificationCode(email, code) {
    (function () {
        emailjs.init({
            publicKey: "8FZVk4TobsyaJxcCJ",
        });
    })();

    emailjs.send('service_g8cli5d', 'template_b0rhzue', {
        to_name: email,
        message: code,

    }).then((response) => {
        console.log('SUCCESS!', response.status, response.text);
    })
        .catch((error) => {
            console.log('FAILED...', error);
        });
}