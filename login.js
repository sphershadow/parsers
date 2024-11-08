import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    fetchSignInMethodsForEmail,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

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

//tasks
loadLoginPage();



//listeners
document.getElementById("login_btn").addEventListener("click", function () {
    const email = document.getElementById("email_txt").value;
    const password = document.getElementById("password_txt").value
    const email_border = document.getElementById("email_container");
    const password_border = document.getElementById("password_container");

    if (!email || email.trim() === "") {
        email_border.style.border = "1px solid red";
        email_border.style.animation = "shake 0.3s ease-in-out";

        password_border.style.border = "1px solid #e0e0e0";
        password_border.style.animation = "none";
        return;
    }
    if (!password || password.trim() === "") {
        password_border.style.border = "1px solid red";
        password_border.style.animation = "shake 0.3s ease-in-out";

        email_border.style.border = "1px solid #e0e0e0";
        email_border.style.animation = "none";
        return;
    }

    signInWithEmailAndPassword(auth, email, password).then((userCredentials) => {
        window.location.href = "homepage.html";
        return;

    }).catch((error) => {
        const errorCode = error.code;
        if (errorCode === "auth/invalid-email") {
            email_border.style.border = "1px solid red";
            email_border.style.animation = "shake 0.3s ease-in-out";

            password_border.style.border = "1px solid #e0e0e0";
            password_border.style.animation = "none";
            return;
        }
        if (errorCode === "auth/invalid-credential") {
            email_border.style.border = "1px solid red";
            email_border.style.animation = "shake 0.3s ease-in-out";
            password_border.style.border = "1px solid red";
            password_border.style.animation = "shake 0.3s ease-in-out";
            return;
        }
    });
});



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

