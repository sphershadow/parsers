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
    update
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

//parser
let parser = [{
    activated: "",
    email: "",
    firstname: "",
    lastname: "",
    middlename: "",
    suffix: "",
    temporarypass: ""
}];

//global variables
const idBorder = document.getElementById("id_container");
const passwordBorder = document.getElementById("password_container");

//pre-tasks
setScreenSize(window.innerWidth, window.innerHeight);
setLoginBodyHeight(window.innerHeight);
document.getElementById("login_div").style.display = "block";


//listeners
document.getElementById("login_btn").addEventListener("click", function () {
    const id = document.getElementById("id_txt").value.trim();
    const password = document.getElementById("password_txt").value.trim();

    if (!id) {
        applyErrorStyle(idBorder);
        resetStyle(passwordBorder);
        return;
    } else if (!password) {
        applyErrorStyle(passwordBorder);
        resetStyle(idBorder);
        return;
    }

    getParser(id).then(() => {
        if (parser[0].activated === "no") {
            if (parser[0].temporarypass !== password) {
                applyErrorStyle(passwordBorder);
                resetStyle(idBorder);
            }
            else {
                let middleinitial = parser[0].middlename[0] + ".";
                if (parser[0].suffix === "none") {
                    parser[0].suffix = "";
                }
                localStorage.setItem("name-parser", parser[0].firstname + " " + middleinitial + " " + parser[0].lastname + " " + parser[0].suffix);
                if (parser[0].middlename === "none") {
                    localStorage.setItem("name-parser", parser[0].firstname + " " + parser[0].lastname + " " + parser[0].suffix);
                }
                localStorage.setItem("activate-parser", id);

                update(ref(database, "PARSEIT/administration/students/" + id), {
                    verificationcode: generateUniqueID(),
                }).then((snapshot) => {
                    window.location.href = "activate.html";
                });;

            }
        }
        else {
            loginParser(parser[0].email, password, id);
        }
    }).catch((error) => {
        applyErrorStyle(idBorder);
        resetStyle(passwordBorder);
    });

});

document.getElementById("showpass_btn").addEventListener("click", function () {
    showpassword();
});

document.getElementById("hidepass_btn").addEventListener("click", function () {
    hidepassword();
});
//functions

function setScreenSize(width, height) {
    document.body.style.width = width + "px";
    document.body.style.height = height + "px";
}

function setLoginBodyHeight(height) {
    const bodyheight = height - 390;
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

function getParser(id) {
    return new Promise((resolve, reject) => {
        const dbRef = ref(database);
        get(child(dbRef, "PARSEIT/administration/students/" + id))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    parser[0].activated = snapshot.val().activated;
                    parser[0].email = snapshot.val().email;
                    parser[0].firstname = snapshot.val().firstname;
                    parser[0].lastname = snapshot.val().lastname;
                    parser[0].middlename = snapshot.val().middlename;
                    parser[0].suffix = snapshot.val().suffix;
                    parser[0].temporarypass = snapshot.val().temporarypass;
                    resolve();
                } else {
                    applyErrorStyle(idBorder);
                    resetStyle(passwordBorder);
                    resolve();
                }
            })
            .catch((error) => {
                alert('Error getting user info');
                reject(error);
            });
    });
}

async function loginParser(email, password, id) {
    try {
        const userCredentials = await signInWithEmailAndPassword(auth, email, password);
        localStorage.setItem("user-parser", id);
        window.location.href = "homepage.html";
    } catch (error) {
        const errorCode = error.code;
        switch (errorCode) {
            case "auth/invalid-email":
                applyErrorStyle(idBorder);
                resetStyle(passwordBorder);
                break;
            case "auth/invalid-credential":
                applyErrorStyle(idBorder);
                applyErrorStyle(passwordBorder);
                break;
            default:
                console.error("An unexpected error occurred:", error);
        }
    }
}

function generateUniqueID() {
    return Math.random().toString(36).substr(2, 5);
}

function showpassword() {
    document.getElementById("showpass_btn").style.display = "none";
    document.getElementById("hidepass_btn").style.display = "flex";
    document.getElementById("password_txt").type = "text";
}

function hidepassword() {
    document.getElementById("showpass_btn").style.display = "flex";
    document.getElementById("hidepass_btn").style.display = "none";
    document.getElementById("password_txt").type = "password";
}

function setVerificationcode(id) {

}