import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
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

//pre-tasks
setScreenSize(window.innerWidth, window.innerHeight);
setLoginBodyHeight(window.innerHeight);
document.getElementById("login_div").style.display = "block";
//document.getElementById("loading_animation_div").style.display = "none";

//listeners
document.getElementById("login_btn").addEventListener("click", async function () {
    const email = document.getElementById("email_txt").value.trim();
    const password = document.getElementById("password_txt").value.trim();
    const emailBorder = document.getElementById("email_container");
    const passwordBorder = document.getElementById("password_container");


    if (!email) {

        applyErrorStyle(emailBorder);
        resetStyle(passwordBorder);
        return;
    } else if (!password) {
        applyErrorStyle(passwordBorder);
        resetStyle(emailBorder);
        return;
    }

    try {
        const userCredentials = await signInWithEmailAndPassword(auth, email, password);
        localStorage.setItem("user-parser", email);
        window.location.href = "homepage.html";
    } catch (error) {
        const errorCode = error.code;
        switch (errorCode) {
            case "auth/invalid-email":
                applyErrorStyle(emailBorder);
                resetStyle(passwordBorder);
                break;
            case "auth/invalid-credential":
                applyErrorStyle(emailBorder);
                applyErrorStyle(passwordBorder);
                break;
            default:
                console.error("An unexpected error occurred:", error);
        }
    }
});



//functions

function setScreenSize(width, height) {
    document.body.style.width = width + "px";
    document.body.style.height = height + "px";
}

function setLoginBodyHeight(height) {
    const bodyheight = height - 230;
    document.getElementById("body_login_div").style.height = bodyheight + "px";
}

function applyErrorStyle(element) {
    element.style.border = "1px solid red";
    element.style.animation = "shake 0.3s ease-in-out";
}

function resetStyle(element) {
    element.style.border = "1px solid #e0e0e0";
    element.style.animation = "none";
}