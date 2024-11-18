import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import {
    getDatabase,
    ref,
    get,
    child,
    update,
    remove
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";
const firebaseConfig = {
    apiKey: "AIzaSyCFqgbA_t3EBVO21nW70umJOHX3UdRr9MY",
    authDomain: "parseit-8021e.firebaseapp.com",
    databaseURL:
        "https://parseit-8021e-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "parseit-8021e",
    storageBucket: "parseit-8021e.appspot.com",
    messagingSenderId: "15166597986",
    appId: "1:15166597986:web:04b0219b1733780ae61a3b",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase(app);
const dbRef = ref(database);

//global variables
const userparser = localStorage.getItem("name-parser");
const emailparser = localStorage.getItem("email-parser");
const id = localStorage.getItem("activate-parser");


//pre-tasks
window.addEventListener("load", function () {
    sendVerificationCode(id, emailparser, generateUniqueID());
    document.getElementById("loading_animation_div").style.display = "none";
    setScreenSize(window.innerWidth, window.innerHeight);
    document.getElementById("verification_div").style.display = "block";
    document.body.style.backgroundImage = "url(assets/ctu_argao_banner_600px.jpg)";
});

//processes
disableResend();
document.getElementById("userparser_lbl").innerHTML = userparser;
document.getElementById("email_lbl").innerHTML = censorEmail(emailparser);

document.getElementById("resend_btn").addEventListener("click", function () {
    countdownVerification();
    sendVerificationCode(id, emailparser, generateUniqueID());
});
document.getElementById("verify_btn").addEventListener("click", function () {
    const userinput_code = document.getElementById("verificationcode_txt").value;
    submitVerificationCode(id, userinput_code);
});
document.getElementById("cancel_btn").addEventListener("click", function () {
    removeDBVerification(id);
});

//for activation
document.getElementById("step1_btn").addEventListener("click", (event) => {
    event.preventDefault();
    openSection(2);
    hideSection(1, 3, 4, 5);
});
document.getElementById("step2_btn").addEventListener("click", (event) => {
    event.preventDefault();
    openSection(3);
    hideSection(2, 1, 4, 5);
});
document.getElementById("step3_btn").addEventListener("click", (event) => {
    event.preventDefault();
    openSection(4);
    hideSection(2, 3, 1, 5);
});

document.getElementById("step4_btn").addEventListener("click", (event) => {
    event.preventDefault();
    openSection(5);
    hideSection(2, 3, 4, 1);
});


document.getElementById("step1_circle").addEventListener("click", (event) => {
    event.preventDefault();
    openSection(1);
    hideSection(2, 3, 4, 5);
});
document.getElementById("step2_circle").addEventListener("click", (event) => {
    event.preventDefault();
    openSection(2);
    hideSection(1, 3, 4, 5);
});
document.getElementById("step3_circle").addEventListener("click", (event) => {
    event.preventDefault();
    openSection(3);
    hideSection(2, 1, 4, 5);
});
document.getElementById("step4_circle").addEventListener("click", (event) => {
    event.preventDefault();
    openSection(4);
    hideSection(2, 3, 5, 1);
});


editdetails_btn.addEventListener("click", (event) => {
    event.preventDefault();
    openSignup();
});

document.getElementById("step5_btn").addEventListener("click", (event) => {


});

document.getElementById('birthday').addEventListener('focus', function () {
    document.getElementById('dateInput').click();

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
    let countdownNumber = 120;

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

function sendVerificationCode(id, email, code) {
    (function () {
        emailjs.init({
            publicKey: "8FZVk4TobsyaJxcCJ",
        });
    })();

    updateDBVerification(id, code); //this supposed to go

    // emailjs.send('service_g8cli5d', 'template_b0rhzue', {
    //     to_name: email,
    //     message: code,
    // }).then((response) => {
    //     updateDBVerification(id, code);
    // }).catch((error) => {
    //     console.log('FAILED...', error);
    // });

}

function updateDBVerification(id, code) {
    update(ref(database, "PARSEIT/administration/students/" + id), {
        verificationcode: code,
    });
}


function disableResend() {
    let countdownNumber = 30;
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

function submitVerificationCode(id, code) {
    const dbRef = ref(database);
    get(child(dbRef, "PARSEIT/administration/students/" + id))
        .then((snapshot) => {
            if (snapshot.exists()) {
                if (snapshot.val().verificationcode == code) {
                    openSignup();
                }
                else {
                    document.getElementById("verificationcode_div").style.border = "1px solid red";
                    document.getElementById("verificationcode_div").style.animation = "shake 0.3s ease-in-out";
                }
            }
        })
        .catch((error) => {

        });
}

function removeDBVerification(id) {
    remove(ref(database, "PARSEIT/administration/students/" + id + "/verificationcode")).then(() => {
        localStorage.removeItem("activate-parser");
        localStorage.removeItem("email-parser");
        localStorage.removeItem("name-parser");
        window.location.href = "login.html";
    });
}

function openSignup() {
    document.getElementById("verification_div").style.display = "none";
    document.getElementById("div_fillout_container").style.display = "flex";
    document.body.style.backgroundImage = "none";
    openSection(1);
    hideSection(2, 3, 4, 5);
    setDatePicker();
}

function openSection(a) {
    document.getElementById(`step${a}_cont`).style.display = "block";
    document.getElementById(`step${a}_circle`).style.backgroundColor = "#007AFF";
    document.getElementById(`step${a}_circle`).style.color = "#fefefe";
}

function hideSection(b, c, d, e) {
    const steps = [b, c, d, e];
    steps.forEach(step => {
        const stepElement = document.getElementById(`step${step}_cont`);
        const stepCircle = document.getElementById(`step${step}_circle`);
        stepElement.style.display = "none";
        stepCircle.style.backgroundColor = "#fefefe";
        stepCircle.style.color = "#007AFF";
    });
}

function setDatePicker() {
    var today = new Date();
    var day = today.getDate();
    var month = today.getMonth() + 1;
    var year = today.getFullYear();

    if (month < 10) month = '0' + month;
    if (day < 10) day = '0' + day;
    var currentDate = year + '-' + month + '-' + day;
    document.getElementById('dateInput').setAttribute('max', currentDate);
}