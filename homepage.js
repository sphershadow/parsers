
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
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
const dbRef = ref(database)


//vars
let user_parser = localStorage.getItem("user-parser");

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


//getAcadStatus();
constantRunning();
setScreenSize(window.innerWidth, window.innerHeight);
window.addEventListener("load", function () {
    document.getElementById("loading_animation_div").style.display = "none";
    document.getElementById("homepage_div").style.display = "flex";
    getUser(user_parser).then(() => {
        if (parser[0].type === "student") {
            document.getElementById("student_nav").style.display = "flex";
            //console.log(status[0].academicref, parser[0].yearlvl, status[0].current_sem, user_parser, parser[0].type);
            if (status[0].ongoing === "true") {
                document.getElementById("search-parseclass-div").style.display = "flex";
                document.getElementById("parseclass-default-div").style.display = "flex";
                document.getElementById("notyetstarted_div").style.display = "none";
                loadStudentSubjects(status[0].academicref, parser[0].yearlvl, status[0].current_sem, user_parser, parser[0].type, parser[0].section);
            }
            else {
                document.getElementById("parseclass-default-div").style.display = "none";
                document.getElementById("search-parseclass-div").style.display = "none";
                document.getElementById("notyetstarted_div").style.display = "flex";
                console.log("here");
            }

        }
        else {
            document.getElementById("teacher_nav").style.display = "flex";
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

    });
});

function setScreenSize(width, height) {
    document.body.style.width = width + "px";
    document.body.style.height = height + "px";
}

document.getElementById("sidebar_btn").addEventListener("click", function () {
    showSidebar();
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
document.getElementById("game-1").addEventListener("click", function () {
    window.location.href = "https://parseitlearninghub.github.io/game-flipcard/";
});

document.getElementById("game-2").addEventListener("click", function () {
    window.location.href = "https://parseitlearninghub.github.io/game-fruitmania/";
});

document.getElementById("game-3").addEventListener("click", function () {
    window.location.href = "https://parseitlearninghub.github.io/game-quiznotes/";
});

function loadStudentSubjects(acadref, yearlvl, sem, userId, type, section) {
    let parseclass_cont = document.getElementById("parseclass-default-div");
    document.getElementById("search-parseclass-div").style.display = "flex";
    document.getElementById("notyetstarted_div").style.display = "none";
    let sem_final = "first-sem";
    if (sem === "2") {
        sem_final = "second-sem";
    }
    if (type === "student") {
        const subjectsRef = child(dbRef, `PARSEIT/administration/parseclass/${acadref}/year-lvl-${yearlvl}/${sem_final}/`);
        get(subjectsRef).then((snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach((subjectSnapshot) => {
                    const sectionRef = child(subjectSnapshot.ref, `${section}`);
                    get(sectionRef).then((sectionSnapshot) => {
                        sectionSnapshot.forEach((childSnapshot) => {
                            if (childSnapshot.exists()) {
                                if (childSnapshot.key === userId) {
                                    let parseclassid = subjectSnapshot.val().name + "_" + childSnapshot.val().section;
                                    let parseimgid = subjectSnapshot.key.replace(/\s+/g, "");
                                    let parseclass_day = sectionSnapshot.val().sched_day;
                                    let parseclass_sched = sectionSnapshot.val().sched_start + " - " + sectionSnapshot.val().sched_end;

                                    if (getCurrentDayName() !== parseclass_day) {
                                        parseclass_day = "No Schedule Today";
                                        parseclass_sched = "";
                                    }

                                    let parseClassAppend = `
                                <div class="parseclass-default-wrapper parseclass" id="${parseimgid}" value ="${parseclassid.replace(/\s+/g, "")}">
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
                                    parseclass_cont.innerHTML += parseClassAppend;
                                    document.getElementById(`${parseimgid}`).style.backgroundImage = "url(assets/parseclass/" + parseimgid + ".jpg)";
                                    localStorage.setItem("parseclass-old-version-id", snapshot.val().version_id);
                                }
                            }
                        });
                    }).catch((error) => {
                        console.error("Error retrieving members:", error);
                    });
                });
            } else {
                console.log("No subjects found");
            }
        }).catch((error) => {
            console.error("Error retrieving subjects:", error);
        });
    }
    else {

    }

}

function getCurrentDayName() {
    let today = new Date();
    let weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return weekdays[today.getDay()];
}

// function reloadSubject() {
//     console.log(status[0].academicref);
//     if (parser[0].type === "student") {
//         loadStudentSubjects(status[0].academicref, parser[0].yearlvl, status[0].current_sem, user_parser, parser[0].type, parser[0].section);
//         console.log(status[0].academicref, parser[0].yearlvl, status[0].current_sem, user_parser, parser[0].type, parser[0].section);
//     } else {

//     }
// }

// async function getVersionID() {
//     let sem_final = "first-sem";
//     if (status[0].current_sem === "2") {
//         sem_final = "second-sem";
//     }
//     if (parser[0].type === "student") {
//         const subjectsRef = child(dbRef, `PARSEIT/administration/parseclass/${status[0].academicref}/year-lvl-${parser[0].yearlvl}/${sem_final}/`);
//         //console.log(`PARSEIT/administration/parseclass/${acadref}/year-lvl-${yearlvl}/${sem_final}/`);
//         await get(subjectsRef).then((snapshot) => {
//             if (snapshot.exists()) {
//                 localStorage.setItem("parseclass-current-version-id", snapshot.val().version_id);

//             } else {
//                 console.log("No subjects found");
//             }

//         });
//     }
//     else {

//     }
// }

async function getAcadStatus() {
    const ref = child(dbRef, "PARSEIT/administration/academicyear/status/");
    await get(ref).then((snapshot) => {
        localStorage.setItem("acad-ongoing-current", snapshot.val().ongoing)
        status[0].current_sem = snapshot.val().current_sem;
        status[0].ongoing = snapshot.val().ongoing;
        status[0].academicref = snapshot.val().academic_ref;
    });

}

async function populateSubjectsForStudent(studentId, yearlvl, sem, acad_ref) {
    try {
        // Fetch the student login information
        const studentSnapshot = await get(child(dbRef, `PARSEIT/users/${studentId}`));
        if (!studentSnapshot.exists()) {
            alert("Student login not found.");
            return;
        }

        // Fetch the list of subjects the student is enrolled in
        const subjectSnapshot = await get(child(dbRef, `PARSEIT/administration/parseclass/${acad_ref}/${yearlvl}/${sem}`));
        const academicyear_cont = document.getElementById('parseclass_list');
        academicyear_cont.innerHTML = "";

        if (subjectSnapshot.exists()) {
            const subjects = subjectSnapshot.val();
            Object.keys(subjects).forEach((key) => {
                const subject = subjects[key];
                const members = subject?.members || [];

                // Check if the student is a member of the subject
                if (members.includes(studentId)) {
                    const title = subject?.title || key;
                    const container = document.createElement("div");
                    container.className = "radio-subject";

                    const radioButton = document.createElement("input");
                    radioButton.type = "radio";
                    radioButton.id = `parseclass-${subject.parseclass_id}`;
                    radioButton.name = "subject-list";
                    radioButton.className = "radio-subjectlist";
                    radioButton.value = title;

                    radioButton.addEventListener("click", () => {
                        subjectparseclass_id = `${subject.parseclass_id}`;
                        selectedSubject = title;
                        document.getElementById("parseclass_list").style.border = "0.5px solid #dcdcdc";
                    });

                    const label = document.createElement("label");
                    label.htmlFor = `parseclass-${subject.parseclass_id}`;
                    label.textContent = title;
                    label.className = "lbl-subjectlist";

                    container.appendChild(radioButton);
                    container.appendChild(label);
                    academicyear_cont.appendChild(container);
                }
            });

            // If no subjects match, show a "No data found" message
            if (academicyear_cont.innerHTML === "") {
                academicyear_cont.innerHTML = "<div class='nodatafound'>No data found.</div>";
            }
        } else {
            academicyear_cont.innerHTML = "<div class='nodatafound'>No data found.</div>";
        }
    } catch (error) {
        alert(error);
    }
}


async function constantRunning() {
    setInterval(() => {
        getAcadStatus();
        if (localStorage.getItem("acad-ongoing-current") != localStorage.getItem("acad-ongoing-old")) {
            if (localStorage.getItem("acad-ongoing-current") === "true") {
                //reloadSubject(status[0].academicref, parser[0].yearlvl, status[0].academicref, user_parser, parser[0].type);
                localStorage.setItem("acad-ongoing-old", "true");
                //console.log("here");
            }
            else {
                document.getElementById("search-parseclass-div").style.display = "none";
                document.getElementById("parseclass-default-div").style.display = "none";
                document.getElementById("notyetstarted_div").style.display = "flex";
                localStorage.setItem("acad-ongoing-old", "false");
            }
        }
        else {

        }

        getUser(user_parser);

        //getVersionID();
        // console.log(parser[0].disabled);
        // console.log(parser[0].firstname + " " + parser[0].middlename + " " + parser[0].lastname + " " + parser[0].suffix);
        // console.log(parser[0].regular);
        // console.log(parser[0].section);
        // console.log(parser[0].type);
        // console.log(parser[0].yearlvl);

        // console.log(status[0].current_sem);
        // console.log(status[0].ongoing);
        // console.log(status[0].academicref);
    }, 1000);
}

async function findExclusiveStudents(acad_ref, yearlvl, sem) {
    const subjectRef = ref(database, `PARSEIT/administration/parseclass/${acad_ref}/${yearlvl}/${sem}`);
    try {
        const snapshot = await get(subjectRef);
        if (snapshot.exists()) {
            const members = snapshot.val().members;
            const allMembers = Object.keys(members); // List of student IDs
            const uniqueStudents = [];

            for (let studentId of allMembers) {
                const studentRef = ref(db, `path_to_all_classes_and_subjects/${studentId}`);
                const studentSnapshot = await get(studentRef);

                if (studentSnapshot.exists()) {
                    const enrolledSubjects = Object.keys(studentSnapshot.val());

                    // Check if the student is only enrolled in one subject
                    if (enrolledSubjects.length === 1) {
                        uniqueStudents.push(studentId);
                    }
                }
            }

            console.log("Students enrolled only in this subject:", uniqueStudents);
            return uniqueStudents;
        } else {
            console.log("No data available at the specified path.");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

//for sidebar
let startX = 0;
let endX = 0;
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

document.getElementById("community_btn").addEventListener('click', (event) => {
    event.preventDefault();
    window.location.href = "https://parseitlearninghub.github.io/community/";
});