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


//vars
let user_parser = localStorage.getItem("user-parser");
let parseclass_cont = document.getElementById("parseclass-default-div");
let backgroundImgInput = "";
let username = "";

let parser = [{
    activated: "",
    birthday: "",
    disabled: "",
    email: "",
    firstname: "",
    lastname: "",
    middlename: "",
    regular: "",
    section: "",
    suffix: "",
    temporarypass: "",
    type: "",
    yearlvl: ""
}];

let status = [{
    current_sem: "",
    ongoing: "",
    academicref: ""
}]

setScreenSize(window.innerWidth, window.innerHeight);
window.addEventListener("load", async function () {
    document.getElementById("loading_animation_div").style.display = "none";
    username = await getparser_username(user_parser);
    await getUser(user_parser).then(async () => {
        await getAcadStatus().then(() => {
            document.getElementById("homepage_div").style.display = "flex";
            viewLatestAnnouncement();
            if (parser[0].type === "student") {
                document.getElementById("student_nav").style.display = "flex";
                if (status[0].ongoing === "true") {
                    document.getElementById("search-parseclass-div").style.display = "flex";
                    document.getElementById("notyetstarted_div").style.display = "none";
                    document.getElementById("parseclass-default-div").style.display = "flex";
                    loadStudentSubjects(status[0].academicref, parser[0].yearlvl, status[0].current_sem, user_parser, parser[0].type, parser[0].section);
                }
                else {
                    loadStudentSubjects(status[0].academicref, parser[0].yearlvl, status[0].current_sem, user_parser, parser[0].type, parser[0].section);
                    document.getElementById("parseclass-default-div").style.display = "none";
                    document.getElementById("search-parseclass-div").style.display = "none";
                    document.getElementById("notyetstarted_div").style.display = "flex";
                }
                //show
                showBodyWrapper("home_all_sec");
                selectNavIcon("homelobby_img");
                selectNavLbl("homelobby_lbl");
                changeHomeLbl("lobby_title", "Home");
                selectNavIcon("homelobby_imgx");
                selectNavLbl("homelobby_lblx");

                //hide
                hideBodyWrapper("game_student_sec");
                hideBodyWrapper("library_student_sec");
                hideBodyWrapper("honors_teacher_sec");
                hideBodyWrapper("chatgpt_all_sec");
                hideBodyWrapper("share_teacher_sec");

                revertNavIcon("homegame_img");
                revertNavLbl("homegame_lbl");

                revertNavIcon("homelibrary_img");
                revertNavLbl("homelibrary_lbl");

                revertNavIcon("homehonors_img");
                revertNavLbl("homehonors_lbl");

                revertNavIcon("homechatbot_img");
                revertNavLbl("homechatbot_lbl");

                revertNavIcon("homechatbot_imgx");
                revertNavLbl("homechatbot_lblx");

                revertNavIcon("homeshare_img");
                revertNavLbl("homeshare_lbl");
            }
            else {
                document.getElementById("teacher_nav").style.display = "flex";
                if (status[0].ongoing === "true") {
                    document.getElementById("search-parseclass-div").style.display = "flex";
                    document.getElementById("notyetstarted_div").style.display = "none";
                    document.getElementById("parseclass-default-div").style.display = "flex";
                    //loadStudentSubjects(status[0].academicref, parser[0].yearlvl, status[0].current_sem, user_parser, parser[0].type, parser[0].section);
                }
                else {
                    document.getElementById("parseclass-default-div").style.display = "none";
                    document.getElementById("search-parseclass-div").style.display = "none";
                    document.getElementById("notyetstarted_div").style.display = "flex";
                }
                //show
                showBodyWrapper("home_all_sec");
                selectNavIcon("homelobby_img");
                selectNavLbl("homelobby_lbl");
                changeHomeLbl("lobby_title", "Home");
                selectNavIcon("homelobby_imgx");
                selectNavLbl("homelobby_lblx");

                //hide
                hideBodyWrapper("game_student_sec");
                hideBodyWrapper("library_student_sec");
                hideBodyWrapper("honors_teacher_sec");
                hideBodyWrapper("chatgpt_all_sec");
                hideBodyWrapper("share_teacher_sec");

                revertNavIcon("homegame_img");
                revertNavLbl("homegame_lbl");

                revertNavIcon("homelibrary_img");
                revertNavLbl("homelibrary_lbl");

                revertNavIcon("homehonors_img");
                revertNavLbl("homehonors_lbl");

                revertNavIcon("homechatbot_img");
                revertNavLbl("homechatbot_lbl");

                revertNavIcon("homechatbot_imgx");
                revertNavLbl("homechatbot_lblx");

                revertNavIcon("homeshare_img");
                revertNavLbl("homeshare_lbl");
            }
        });
    });
});
document.getElementById("sidebar_btn").addEventListener("click", function () {
    showSidebar();
});
document.getElementById("logout_btn").addEventListener("click", function () {
    logout();
});
document.getElementById("homelobby_btn").addEventListener("click", function () {
    loadStudentSubjects(status[0].academicref, parser[0].yearlvl, status[0].current_sem, user_parser, parser[0].type, parser[0].section);
    showBodyWrapper("home_all_sec");
    selectNavIcon("homelobby_img");
    selectNavLbl("homelobby_lbl");
    changeHomeLbl("lobby_title", "Home");

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
    changeHomeLbl("lobby_title", "Game");

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
    changeHomeLbl("lobby_title", "Library");

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
    changeHomeLbl("lobby_title", "ChatBot");

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
    changeHomeLbl("lobby_title", "Home");

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
    changeHomeLbl("lobby_title", "Honors");

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
    showBodyWrapper("share_teacher_wrapper");
    selectNavIcon("homeshare_img");
    selectNavLbl("homeshare_lbl");
    changeHomeLbl("lobby_title", "Share");

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
    changeHomeLbl("lobby_title", "ChatBot");

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
document.getElementById("game-1").addEventListener("click", function () {
    window.location.href = "https://parseitlearninghub.github.io/game-flipcard/";
});
document.getElementById("game-2").addEventListener("click", function () {
    window.location.href = "https://parseitlearninghub.github.io/game-fruitmania/";
});
document.getElementById("game-3").addEventListener("click", function () {
    window.location.href = "https://parseitlearninghub.github.io/game-quiznotes/";
});
let startX = 0;
let endX = 0;
let startY = 0;
let endY = 0;
document.addEventListener('touchstart', (event) => {
    startX = event.touches[0].clientX;
});
document.addEventListener('touchend', (event) => {
    endX = event.changedTouches[0].clientX;
    // if (endX - startX > 50) {
    //     showSidebar();
    // }
    if (startX - endX > 50) {
        hideSidebar();
    }
});
document.addEventListener('touchstart', (event) => {
    startY = event.touches[0].clientY;
});
document.addEventListener('touchend', (event) => {
    endY = event.changedTouches[0].clientY;
    if (endY - startY > 300) {
        document.getElementById("allannouncement-div").style.animation = "fadeScaleDown 0.25s ease-in-out forwards";
    }
});
document.getElementById("announcement-div").addEventListener('click', (event) => {
    document.getElementById("allannouncement-div").style.display = "flex";
    document.getElementById("allannouncement-div").style.animation = "fadeScaleUp 0.25s ease-in-out forwards";
});
document.getElementById("community_btn").addEventListener('click', (event) => {
    event.preventDefault();
    window.location.href = "https://parseitlearninghub.github.io/community/";
});
document.getElementById("myProfile_btn").addEventListener('click', (event) => {
    event.preventDefault();
    localStorage.setItem("active-parser-type", parser[0].type);
    window.location.href = "profile.html";
});
document.getElementById("background-1").addEventListener('click', (event) => {
    hideBackground("background-2");
    hideBackground("background-3");
    hideBackground("background-4");
    document.getElementById("select-bg-img").style.display = "block";
    backgroundImgInput = "4.png";
});
document.getElementById("background-2").addEventListener('click', (event) => {
    hideBackground("background-1");
    hideBackground("background-3");
    hideBackground("background-4");
    document.getElementById("select-bg-img").style.display = "block";
    backgroundImgInput = "1.png";
});
document.getElementById("background-3").addEventListener('click', (event) => {
    hideBackground("background-1");
    hideBackground("background-2");
    hideBackground("background-4");
    document.getElementById("select-bg-img").style.display = "block";
    backgroundImgInput = "2.png";
});
document.getElementById("background-4").addEventListener('click', (event) => {
    hideBackground("background-1");
    hideBackground("background-3");
    hideBackground("background-2");
    document.getElementById("select-bg-img").style.display = "block";
    backgroundImgInput = "3.png";
});
document.getElementById("select-bg-img").addEventListener('click', (event) => {
    showBackground("background-1");
    showBackground("background-2");
    showBackground("background-3");
    showBackground("background-4");
    document.getElementById("share-announcement-btn").style.display = "none";
    document.getElementById("select-bg-img").style.display = "none";
});
document.getElementById("share-announcement-btn").addEventListener('click', (event) => {
    submitAnnouncement();
});
document.getElementById("reloadpage").addEventListener('click', (event) => {
    window.location.reload();
});


//functions
function hideBackground(element) {
    document.getElementById(element).style.display = "none";
    document.getElementById("share-announcement-btn").style.display = "flex";
}
function showBackground(element) {
    document.getElementById(element).style.display = "block";

}
function setScreenSize(width, height) {
    document.body.style.width = width + "px";
    document.body.style.height = height + "px";
}
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
function logout() {
    localStorage.removeItem("user-parser");
    window.location.href = "login.html";
}
function showBodyWrapper(id) {
    document.getElementById(id).style.display = "block";
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
function changeHomeLbl(id, type) {
    document.getElementById(id).innerText = type;
}
async function loadStudentSubjects(acadref, yearlvl, sem, userId, type, section) {
    //console.log(acadref, yearlvl, sem, userId, type, section);
    let sem_final = "first-sem";
    if (sem === "2") {
        sem_final = "second-sem";
    }
    if (type === "student") {
        const subjectsRef = child(dbRef, `PARSEIT/administration/parseclass/${acadref}/year-lvl-${yearlvl}/${sem_final}/`);
        get(subjectsRef).then((snapshot) => {
            if (snapshot.exists()) {
                parseclass_cont.innerHTML = "";
                let parseClassAppend = "";
                snapshot.forEach((subjectSnapshot) => {
                    const sectionRef = child(subjectSnapshot.ref, `${section}`);
                    get(sectionRef).then((sectionSnapshot) => {
                        if (sectionSnapshot.exists()) {
                            const memberRef = sectionSnapshot.child("members");
                            if (memberRef.exists()) {
                                memberRef.forEach((idSnapshot) => {
                                    if (idSnapshot.key === userId) {
                                        let parseclass_id = sectionSnapshot.val().parseclass_id;
                                        let parseimgid = subjectSnapshot.key.replace(/\s+/g, "");
                                        let parseclass_day = sectionSnapshot.val().schedule.sched_day;
                                        let parseclass_sched = sectionSnapshot.val().schedule.sched_start + " - " + sectionSnapshot.val().schedule.sched_end;

                                        if (getCurrentDayName() !== parseclass_day) {
                                            parseclass_day = "No Schedule Today";
                                            parseclass_sched = "";
                                        }
                                        else {
                                            console.log("No Schedule Assigned");
                                        }

                                        parseClassAppend += `
                                        <div class="parseclass-default-wrapper parseclass" onclick="localStorage.setItem('parser-username', '${username.replace(/\s+/g, "")}');
                                            localStorage.setItem('parser-parseroom', '${parseclass_id.replace(/\s+/g, "")}');
                                            localStorage.setItem('parseroom-code', '${subjectSnapshot.key}');
                                            localStorage.setItem('parseroom-name', '${subjectSnapshot.val().name}');
                                            window.location.href = 'parseroom.html';" id="${parseimgid}"
                                            style="background-image: url('assets/parseclass/${parseimgid.toUpperCase()}.jpg');"
                                            value ="${parseclass_id.replace(/\s+/g, "")}">
                                        <div class="parseclass-default-gradient">
                                        <span class="parsesched-default-span">
                                        <label for="" class="parseclass-day-lbl">${parseclass_day}</label>
                                        <label for="" class="parseclass-time-lbl">${parseclass_sched}</label>
                                        </span>
                                        <span class="parseclass-default-span">
                                        <label for="" class="parseclass-header-lbl">${subjectSnapshot.key}</label>
                                        <label for="" class="parseclass-header-sublbl">${subjectSnapshot.val().name}</label>
                                        </span>
                                        </div>
                                        </div>`
                                        parseclass_cont.innerHTML = parseClassAppend;
                                    }

                                });
                            }
                            else {
                                //console.log('No member found,');
                            }
                        } else {
                            //console.log("No members found.");
                        }
                    }).catch((error) => {
                        console.log(error);
                    })
                });
            }
            else {
                console.log("No Data Found.");
            }
        });
    }


}
// loadTeacherSubjects(status[0].academicref, status[0].current_sem);
// async function loadTeacherSubjects(acadref, sem) {
//     let sem_final = "first-sem";
//     if (sem === "2") {
//         sem_final = "second-sem";
//     }
//     const subjectsRef = child(dbRef, `PARSEIT/administration/parseclass/${acadref}/`);
//         await get(subjectsRef).then((snapshot) => {
//             if (snapshot.exists()) {
//                 // parseclass_cont.innerHTML = "";
//                 // let parseClassAppend = "";
//                 snapshot.forEach((yearLvlSnapshot) => {
//                     //console.log(yearLvlSnapshot.val());
//                     const yearLvlRef = child(yearLvlSnapshot.ref, `year-lvl-4`);
//                     get(yearLvlRef).then((sectionSnapshot) => {
//                         console.log(sectionSnapshot.val());
//                         const sectionRef = child(yearLvlSnapshot.ref, `4B-Laravel`);
//                         get(sectionRef).then((section) => {
//                             console.log(section.val());
                            
//                         });
//                     });
//                 });
//             }
//             else {
//                 console.log("No Data Found.");
//             }
//         });
// }

function getCurrentDayName() {
    let today = new Date();
    let weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return weekdays[today.getDay()];
}
let ongoing_previousData = null;
async function changesInOngoing() {
    const statusRef = child(dbRef, "PARSEIT/administration/academicyear/status/ongoing");
    onValue(statusRef, (snapshot) => {
        if (snapshot.exists()) {
            const currentData = snapshot.val();
            if (ongoing_previousData === null) {
                //console.log('Ongoing:', currentData);
            } else {
                //console.log('Ongoing:', currentData);
                if (ongoing_previousData !== currentData) {
                    if (currentData === "true") {
                        status[0].ongoing = "true";
                        document.getElementById("search-parseclass-div").style.display = "flex";
                        document.getElementById("notyetstarted_div").style.display = "none";
                        document.getElementById("parseclass-default-div").style.display = "flex";
                        loadStudentSubjects(status[0].academicref, parser[0].yearlvl, status[0].current_sem, user_parser, parser[0].type, parser[0].section);
                    }
                    else {
                        status[0].ongoing = "false";
                        document.getElementById("search-parseclass-div").style.display = "none";
                        document.getElementById("notyetstarted_div").style.display = "flex";
                        document.getElementById("parseclass-default-div").style.display = "none";
                        loadStudentSubjects(status[0].academicref, parser[0].yearlvl, status[0].current_sem, user_parser, parser[0].type, parser[0].section);

                    }
                }
            }
            ongoing_previousData = currentData;
        } else {
            console.log('No data available');
        }
    }, (error) => {
        console.error('Error reading data:', error);
    });
} changesInOngoing();
let sem_previousData = null;
async function changesInSem() {
    const statusRef = child(dbRef, "PARSEIT/administration/academicyear/status/current_sem");
    onValue(statusRef, (snapshot) => {
        if (snapshot.exists()) {
            const currentData = snapshot.val();
            if (sem_previousData === null) {

            } else {
                if (sem_previousData !== currentData) {
                    status[0].current_sem = "1";
                    if (currentData === "2") {
                        status[0].current_sem = "2";
                    }
                    document.getElementById("search-parseclass-div").style.display = "flex";
                    document.getElementById("notyetstarted_div").style.display = "none";
                    document.getElementById("parseclass-default-div").style.display = "flex";
                    loadStudentSubjects(status[0].academicref, parser[0].yearlvl, status[0].current_sem, user_parser, parser[0].type, parser[0].section);
                }
            }
            sem_previousData = currentData;
        } else {
            console.log('No data available');
        }
    }, (error) => {
        console.error('Error reading data:', error);
    });
} changesInSem();
let academicref_previousData = null;
async function changesInAcademicRef() {
    const statusRef = child(dbRef, "PARSEIT/administration/academicyear/status/academic_ref");
    onValue(statusRef, (snapshot) => {
        if (snapshot.exists()) {
            const currentData = snapshot.val();
            if (academicref_previousData === null) {
                // console.log('Ongoing:', currentData);
            } else {
                // console.log('Ongoing:', currentData);
                if (academicref_previousData !== currentData) {
                    document.getElementById("search-parseclass-div").style.display = "flex";
                    document.getElementById("notyetstarted_div").style.display = "none";
                    document.getElementById("parseclass-default-div").style.display = "flex";
                    loadStudentSubjects(currentData, parser[0].yearlvl, status[0].current_sem, user_parser, parser[0].type, parser[0].section);
                }
            }
            academicref_previousData = currentData;
        } else {
            console.log('No data available');
        }
    }, (error) => {
        console.error('Error reading data:', error);
    });
} changesInAcademicRef();
async function getAcadStatus() {
    const ref = child(dbRef, "PARSEIT/administration/academicyear/status/");
    await get(ref).then((snapshot) => {
        status[0].current_sem = snapshot.val().current_sem;
        status[0].ongoing = snapshot.val().ongoing;
        status[0].academicref = snapshot.val().academic_ref;
    });

}
function getUser(id) {
    return new Promise((resolve, reject) => {
        const dbRef = ref(database);
        get(child(dbRef, "PARSEIT/administration/students/" + id)).then((snapshot) => {
            if (snapshot.exists()) {
                parser[0].activated = snapshot.val().activated;
                parser[0].birthday = snapshot.val().birthday;
                parser[0].disabled = snapshot.val().disabled;
                parser[0].email = snapshot.val().email;
                parser[0].firstname = snapshot.val().firstname;
                parser[0].lastname = snapshot.val().lastname;
                parser[0].middlename = snapshot.val().middlename;
                parser[0].regular = snapshot.val().regular;
                parser[0].section = snapshot.val().section;
                parser[0].suffix = snapshot.val().suffix;
                parser[0].temporarypass = snapshot.val().temporarypass;
                parser[0].type = snapshot.val().type;
                parser[0].yearlvl = snapshot.val().yearlvl;
                resolve();
            } else {
                get(child(dbRef, "PARSEIT/administration/teachers/" + id)).then((snapshot) => {
                    if (snapshot.exists()) {
                        parser[0].activated = snapshot.val().activated;
                        parser[0].birthday = snapshot.val().birthday;
                        parser[0].disabled = snapshot.val().disabled;
                        parser[0].email = snapshot.val().email;
                        parser[0].firstname = snapshot.val().firstname;
                        parser[0].lastname = snapshot.val().lastname;
                        parser[0].middlename = snapshot.val().middlename;
                        parser[0].suffix = snapshot.val().suffix;
                        parser[0].temporarypass = snapshot.val().temporarypass;
                        parser[0].type = snapshot.val().type;
                        resolve();
                    }
                });
            }
        }).catch((error) => {
            alert('Error getting user info');
            reject(error);
        });
    });
}
function viewLatestAnnouncement() {
    const date_announcement_lbl = document.getElementById("date_announcement_lbl");
    const announcement_lbl = document.getElementById("announcement_lbl");
    const time_announcement_lbl = document.getElementById("time_announcement_lbl");
    const dbRef = ref(database, "PARSEIT/administration/announcement/");
    const latestAnnouncementQuery = query(dbRef, orderByKey(), limitToLast(1));

    onValue(latestAnnouncementQuery, (snapshot) => {
        if (snapshot.exists()) {
            let latestAnnouncement = null;

            snapshot.forEach((childSnapshot) => {
                latestAnnouncement = childSnapshot.val();
            });

            if (latestAnnouncement) {
                date_announcement_lbl.innerText = latestAnnouncement.date || "[Date not available]";
                announcement_lbl.innerText = latestAnnouncement.header || "[Message not available]";
                time_announcement_lbl.innerText = latestAnnouncement.time || "[Time not available]";
                document.getElementById("announcement-div").style.backgroundImage = `url(assets/announcement/${latestAnnouncement.background_img || "4.png"})`;
                date_announcement_lbl.style.color = "#323232";
                announcement_lbl.style.color = "#323232";
                time_announcement_lbl.style.color = "#323232";

                if (latestAnnouncement.background_img === "4.png") {

                    date_announcement_lbl.style.color = "#fefefe";
                    announcement_lbl.style.color = "#fefefe";
                    time_announcement_lbl.style.color = "#fefefe";
                }

            }
        } else {
            document.getElementById("announcement-div").style.backgroundImage = "url(assets/announcement/4.png)";
            date_announcement_lbl.innerText = "There is no announcement";
            date_announcement_lbl.style.color = "#fefefe";
            announcement_lbl.innerText = "Seems like you are all caught up!";
            announcement_lbl.style.color = "#fefefe";
            time_announcement_lbl.style.color = "#fefefe";
        }
    }, (error) => {
        console.error("Error fetching announcement: ", error);
    });
}
async function submitAnnouncement() {
    const dateInput = getCurrentDayName();
    const timeInput = getTimeWithAMPM();
    const headerInput = document.getElementById("body-share-header").value;
    const descriptionInput = document.getElementById("body-share-description").value;

    if (!dateInput || !timeInput || !headerInput) {

        return;
    }

    const newAnnouncement = {
        date: dateInput,
        time: timeInput,
        header: headerInput,
        description: descriptionInput,
        background_img: backgroundImgInput,
        authorid: user_parser,
        month: formatDate(new Date())
    };

    const dbRef = ref(database, "PARSEIT/administration/announcement/");
    const newAnnouncementRef = push(dbRef);

    try {
        await set(newAnnouncementRef, newAnnouncement);


        document.getElementById("check_animation_div").style.display = "flex";
        setTimeout(() => {
            document.getElementById("check_animation_div").style.display = "none";
            document.getElementById("body-share-header").value = "";
            document.getElementById("body-share-description").value = "";
            backgroundImgInput = "";
            showBackground("background-1");
            showBackground("background-2");
            showBackground("background-3");
            showBackground("background-4");
        }, 2000);

    } catch (error) {
        console.error("Error submitting announcement: ", error);
    }
}
function getTimeWithAMPM() {
    const now = new Date();
    const options = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true // To use 12-hour format with AM/PM
    };
    const timeString = new Intl.DateTimeFormat('en-US', options).format(now);
    return timeString;
}
viewAllAnnouncement();
function viewAllAnnouncement() {

    const dbRef = ref(database, "PARSEIT/administration/announcement/");
    const latestAnnouncementQuery = query(dbRef, orderByKey());

    onValue(latestAnnouncementQuery, (snapshot) => {
        if (snapshot.exists()) {
            let announcementcont = document.getElementById("allannouncement-body");
            announcementcont.innerHTML = "";

            let appendAnnouncementHTML = "";
            const snapshotData = snapshot.val();
            const reversedsnapshot = Object.entries(snapshotData).reverse();

            reversedsnapshot.forEach(([key, value]) => {

                appendAnnouncementHTML += `
            <div class="allannouncement-wrapper">
            <div class="alldate">
            <span class="announcemonth">${value.month}</span>
            <span class="announceday">${value.date}</span>
            <span class="announcetime">${value.time}</span>
            </div>
            <div class="allheader">${value.header}</div>
            <div class="alldescription" >${value.description}</div>
            </div>`;
            });
            announcementcont.innerHTML = appendAnnouncementHTML;
        } else {
            document.getElementById("announcement-div").style.backgroundImage = "url(assets/announcement/4.png)";
            date_announcement_lbl.innerText = "There is no announcement";
            date_announcement_lbl.style.color = "#fefefe";
            announcement_lbl.innerText = "Seems like you are all caught up!";
            announcement_lbl.style.color = "#fefefe";
            time_announcement_lbl.style.color = "#fefefe";
        }
    }, (error) => {
        console.error("Error fetching announcement: ", error);
    });
}
function formatDate(date) {
    const months = [
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ];

    const month = months[date.getMonth()]; // Get the month name
    const day = date.getDate(); // Get the day of the month
    const year = date.getFullYear(); // Get the year

    return `${month} ${day}, ${year}`;
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

async function setParser_username() {
    document.getElementById('parser_username').innerText = "@" + await getparser_username(user_parser);
} setParser_username();

async function setparserBanners(id) {
    // let banners = ["venti_banner.png", "raiden_banner.png", "zhongli_banner.png",
    //     "mavuika_banner.png", "nahida_banner.png", "furina_banner.png"];

    // let profiles = ["venti_1.png", "venti_2.png", "raiden_1.png", "raiden_2.png", "zhongli_1.png", "zhongli_2.png",
    //     "mavuika_1.png", "mavuika_2.png", "nahida_1.png", "nahida_2.png", "furina_1.png", "furina_2.png"];

    const bannerRef = child(dbRef, `PARSEIT/administration/students/${id}/banner`);
    const profileRef = child(dbRef, `PARSEIT/administration/students/${id}/profile`);

    const teacherBannerRef = child(dbRef, `PARSEIT/administration/teachers/${id}/banner`);
    const teacherProfileRef = child(dbRef, `PARSEIT/administration/teachers/${id}/profile`);

    const snapshot = await get(bannerRef);
    const snapshot2 = await get(profileRef);
    const snapTeacher = await get(teacherBannerRef);
    const snapTeacher2 = await get(teacherProfileRef);
    if (snapshot.exists()) {
        document.getElementById('sidebar_header').style.backgroundImage = `url(assets/profiles/${snapshot.val()})`;
    }
    else {
        if (snapTeacher.exists()) {
            document.getElementById('sidebar_header').style.backgroundImage = `url(assets/profiles/${snapTeacher.val()})`;
        }
        else {
            document.getElementById('sidebar_header').style.backgroundImage = `url(assets/profiles/default_banner.png`;
        }

    }


    if (snapshot2.exists()) {
        document.getElementById('parser_profile').src = `assets/profiles/${snapshot2.val()}`;
    }
    else {
        if (snapTeacher2.exists()) {
            document.getElementById('parser_profile').src = `assets/profiles/${snapTeacher2.val()}`;
        }
        else {
            document.getElementById('parser_profile').src = `assets/profiles/default_profile.png`;
        }
    }
} setparserBanners(user_parser);



function loadTeacherSubjects() {
  const semesterToCheck = "first-sem";
  const teacherIDToFind = "12345";
  const acadref= "1733645590448Pcd0h0";
  const databaseRef = ref(database, "PARSEIT/administration/parseclass/"+acadref);
  get(databaseRef).then((snapshot) => {
      if (snapshot.exists()) {
        parseclass_cont.innerHTML = "";
        let parseClassAppend = "";
        const data = snapshot.val();
        for (const yearLevel in data) {
          if (data[yearLevel][semesterToCheck]) {
            const semesterData = data[yearLevel][semesterToCheck];
            for (const subject in semesterData) {
              const subjectData = semesterData[subject];
              if (typeof subjectData === 'object') {
                for (const key in subjectData) {
                    if (key === "name" || key === "unit") {
                         
                    }
                    else{
                        //console.log(subjectData[key]);
                        const parseclass_img = subject.replace(/\s+/g, "");
                        if(user_parser === subjectData[key].teacher_id){
                            parseClassAppend += `
                                <div class="parseclass-default-wrapper parseclass" onclick="localStorage.setItem('parser-username', '${username.replace(/\s+/g, "")}');
                                localStorage.setItem('parser-parseroom', '${subjectData[key].parseclass_id.replace(/\s+/g, "")}');
                                localStorage.setItem('parseroom-code', '${subject}');
                                localStorage.setItem('parseroom-name', '${subjectData.name}');
                                window.location.href = 'parseroom.html';" id=""
                                style="background-image: url('assets/parseclass/${parseclass_img.toUpperCase()}.jpg');"
                                value ="">
                                <div class="parseclass-default-gradient">
                                <span class="parsesched-default-span">
                                <label for="" class="parseclass-day-lbl"></label>
                                <label for="" class="parseclass-time-lbl"></label>
                                </span>
                                <span class="parseclass-default-span">
                                <label for="" class="parseclass-header-lbl">${subject}</label>
                                <label for="" class="parseclass-header-sublbl">${subjectData.name}</label>
                                </span>
                                </div>
                                </div>`
                            parseclass_cont.innerHTML = parseClassAppend;
                        }
                    }
                }
              }
            }
          }
        }
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

loadTeacherSubjects ();