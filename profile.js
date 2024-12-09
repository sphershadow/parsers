import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
    getDatabase,
    ref,
    get,
    child,
    onValue,
    query,
    orderByKey,
    limitToLast,
    push,
    set
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
const database = getDatabase(app);
const dbRef = ref(database)

//variables
let user_parser = localStorage.getItem("user-parser");
//listeners
await setScreenSize(window.innerWidth, window.innerHeight);
window.addEventListener("load", async function () {
    document.getElementById("loading_animation_div").style.display = "none";
});

// document.getElementById("details-btn").addEventListener('click', (event) => {
//     document.getElementById("body-parseroom-div").style.animation = "parseroom-slideOut 0.6s ease-out forwards";
//     document.getElementById("details-parseroom-div").style.animation = "parseroom-slideOut 0.6s ease-out forwards";
// });

// document.getElementById("info-btn").addEventListener('click', (event) => {
//     document.getElementById("body-parseroom-div").style.animation = "parseroom-slideIn 0.6s ease-out forwards";
//     document.getElementById("details-parseroom-div").style.animation = "parseroom-slideIn 0.6s ease-out forwards";
// });

document.getElementById("profile-banner").addEventListener('click', (event) => {
    document.getElementById("body-parseroom-div").style.animation = "parseroom-slideIn 0.6s ease-out forwards";
    document.getElementById("details-parseroom-div").style.animation = "parseroom-slideIn 0.6s ease-out forwards";
});
document.getElementById("profile-avatar").addEventListener('click', (event) => {
    document.getElementById("body-parseroom-div").style.animation = "parseroom-slideIn 0.6s ease-out forwards";
    document.getElementById("details-parseroom-div").style.animation = "parseroom-slideIn 0.6s ease-out forwards";
});
document.getElementById("closeprofile-btn").addEventListener('click', (event) => {
    window.location.href = "homepage.html";
});



//functions
async function setScreenSize(width, height) {
    document.body.style.width = width + "px";
    document.body.style.height = height + "px";
}

async function getparser_username(id) {
    const usernameRef = child(dbRef, `PARSEIT/username/`);
    const snapshot = await get(usernameRef);
    if (snapshot.exists()) {
        const currentData = snapshot.val();
        for (const username of Object.keys(currentData)) {
            if (currentData[username] === id) {
                return username;
            }
        }
        return null;
    } else {
        console.log("No data available");
        return null;
    }
}
async function getparser_id(username) {
    const usernameRef = child(dbRef, `PARSEIT/username/${username}`);
    const snapshot = await get(usernameRef);
    if (snapshot.exists()) {
        return snapshot.val();
    } else {
        console.log("No data available");
        return null;
    }
}

async function setparserBanners(id) {
    const coverRef = child(dbRef, `PARSEIT/administration/students/${id}/cover`);
    const profileRef = child(dbRef, `PARSEIT/administration/students/${id}/profile`);

    const teacherCoverRef = child(dbRef, `PARSEIT/administration/teachers/${id}/cover`);
    const teacherProfileRef = child(dbRef, `PARSEIT/administration/teachers/${id}/profile`);

    const snapshot = await get(coverRef);
    const snapshot2 = await get(profileRef);
    const snapTeacher = await get(teacherCoverRef);
    const snapTeacher2 = await get(teacherProfileRef);
    if (snapshot.exists()) {
        document.getElementById('profile-banner').style.backgroundImage = `url(assets/profiles/${snapshot.val()})`;
    }
    else {
        if (snapTeacher.exists()) {
            document.getElementById('profile-banner').style.backgroundImage = `url(assets/profiles/${snapTeacher.val()})`;
        }
        else {
            document.getElementById('profile-banner').style.backgroundImage = `url(assets/profiles/default_cover.png`;
        }

    }


    if (snapshot2.exists()) {
        document.getElementById('avatar-img').src = `assets/profiles/${snapshot2.val()}`;
        document.getElementById('avatar-img').style.display = `block`;
    }
    else {
        if (snapTeacher2.exists()) {
            document.getElementById('avatar-img').src = `assets/profiles/${snapTeacher2.val()}`;
            document.getElementById('avatar-img').style.display = `block`;
        }
        else {
            document.getElementById('avatar-img').src = `assets/profiles/default_profile.png`;
            document.getElementById('avatar-img').style.display = `block`;
        }
    }
} setparserBanners(user_parser);