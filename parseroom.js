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
    set,
    update,
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
let parseroom_id = localStorage.getItem("parser-parseroom");
let parseroom_username = localStorage.getItem("parser-username");
let active_profile = "";

//listeners
setScreenSize(window.innerWidth, window.innerHeight);
window.addEventListener("load", async function () {
    document.getElementById("loading_animation_div").style.display = "none";
    active_profile = await activeProfile(user_parser); 
    getParseroomMessages();
    scrollToBottom();
    
    
});

document.getElementById("details-btn").addEventListener('click', (event) => {
    document.getElementById("body-parseroom-div").style.animation = "parseroom-slideOut 0.6s ease-out forwards";
    document.getElementById("details-parseroom-div").style.animation = "parseroom-slideOut 0.6s ease-out forwards";
});
window.addEventListener("resize", adjustChatbox); adjustChatbox();
window.addEventListener("resize", scrollToBottom); scrollToBottom();
document.getElementById("sendmessage-btn").addEventListener('click', (event) => {
    submitMessage();
    getParseroomMessages();
    scrollToBottom();
});
function scrollToBottom() {
    const element = document.getElementById("parseroom-body-wrapper");
    if (element) {
        element.scrollTop = element.scrollHeight; // Scroll to the bottom
    }
}
document.addEventListener("DOMContentLoaded", () => {
    scrollToBottom();
});
document.getElementById("closeparseroom-btn").addEventListener('click', (event) => {
    window.location.href = "homepage.html";
    localStorage.removeItem("active-whisper-id");
});
document.getElementById("info-btn").addEventListener('click', (event) => {
    document.getElementById("body-parseroom-div").style.animation = "parseroom-slideIn 0.6s ease-out forwards";
    document.getElementById("details-parseroom-div").style.animation = "parseroom-slideIn 0.6s ease-out forwards";
});
document.getElementById("whispermessage-btn").addEventListener('click', (event) => {
    submitWhisperMessage();
    scrollToBottom();
});

document.getElementById("header-left").addEventListener('click', (event) => {
    getParseroomMessages();
    scrollToBottom();
    hideWhisperTheme();
    localStorage.removeItem("active-whisper-id");

});
document.getElementById("parsermessage-txt").addEventListener('focus', (event) => {
    scrollToBottom();
});

//functions
async function setScreenSize(width, height) {
    document.body.style.width = width + "px";
    document.body.style.height = height + "px";
}
function adjustChatbox() {
    const container = document.querySelector('.body-parseroom-div');
    container.style.height = `${window.innerHeight}px`;
}
async function getParseroomMessages() {
    const dbRef = ref(database, `PARSEIT/administration/parseroom/${parseroom_id}/messages/`);
    const latestMessageQuery = query(dbRef, orderByKey());

    onValue(latestMessageQuery, (snapshot) => {
        if (snapshot.exists()) {
            let messagecont = document.getElementById("parseroom-body-wrapper");
            //messagecont.innerHTML = "";
            let appendMessageHTML = "<div class='filler-message'></div>";
            const snapshotData = snapshot.val();
            const reversedsnapshot = Object.entries(snapshotData);
            reversedsnapshot.forEach(([key, message]) => {
                
                if (message.from === user_parser) {
                    if(message.sender_profile !== `${active_profile}`){
                        updateSenderProfile(parseroom_id, user_parser, active_profile); 
                    }

                    if (message.to === "everyone") {
                        appendMessageHTML += `
                        <div class="parseroom-message">
                        <section class="p-message p-message-me">
                        <section class="p-username p-username-me">@${message.from_username}</section>
                        <section class="p-description p-description-me"> ${message.description}</section>
                        </section>
                        <section class="p-profile p-profile-me">
                        <img id="parser-profile" class="parser-profile" src='${active_profile}' alt="" />
                        </section>
                        </div>`;
                    }
                    else {
                        appendMessageHTML += `
                        <div class="parseroom-message">
                        <section class="p-message p-message-me" style="display: flex; align-items: center; justify-content: center;">
                        <section class="p-username p-username-me" style="display: none;">@${message.from_username}</section>
                        <section class="p-description p-description-me ping-whisper-me">You whispered to @${message.to_username}</section>
                        </section>
                        <section class="p-profile p-profile-me" style="display: none;">
                        <img id="parser-profile" class="parser-profile" src='${active_profile}' alt="" />
                        </section>
                        </div>`;
                    }
                }
                else {
                    if (message.to === "everyone") {
                        appendMessageHTML += `
                        <div class="parseroom-message">
                        <section class="p-profile">
                        <img id="parser-profile" class="parser-profile" src='${message.sender_profile}' alt="" />
                        </section>
                        <section class="p-message">
                        <section class="p-username">@${message.from_username}</section>
                        <section class="p-description" onclick="
                        document.getElementById('parsermessage-txt').value += ' @${message.from_username} ';
                        "
                        >${message.description}</section>
                        </section>
                        </div>`
                    }
                    else {
                        if (message.to === user_parser) {
                            appendMessageHTML += `
                        <div class="parseroom-message" style="display: flex; align-items: center; justify-content: center;">
                        <section class="p-profile" style="display: none;">
                        <img id="parser-profile" class="parser-profile" src='${message.sender_profile}' alt="" />
                        </section>
                        <section class="p-message" style="display: flex; align-items: center; justify-content: center;">
                        <section class="p-username" style="display: none;">@${message.from_username}</section>
                        <section class="p-description ping-whisper" style="width: 100%;" onclick="
                        document.getElementById('parsermessage-txt').value += ' @${message.from_username} ';
                        "
                        >@${message.from_username} whispered to you</section>
                        </section>
                        </div>`
                        }
                    }
                }
            });
            messagecont.innerHTML = appendMessageHTML;
            scrollToBottom();
        } else {

        }
    }, (error) => {
        console.error("Error fetching announcement: ", error);
    });
}
async function submitMessage() {
    const messageInput = document.getElementById("parsermessage-txt").value;
    const username = await getparser_username(user_parser);
    const sender_profile = await activeProfile(user_parser);
    if (!messageInput) {

        return;
    }

    const newAnnouncement = {
        description: messageInput,
        from: user_parser,
        to: "everyone",
        to_username: "everyone",
        time: getMessageTime(),
        from_username: username,
        sender_profile: sender_profile,
    };

    const dbRef = ref(database, `PARSEIT/administration/parseroom/${parseroom_id}/messages/`);
    const newAnnouncementRef = push(dbRef);

    try {
        await set(newAnnouncementRef, newAnnouncement);
        document.getElementById("parsermessage-txt").value = "";
        getParseroomMessages();

    } catch (error) {
        console.error("Error submitting announcement: ", error);
    }
}
function getMessageTime() {
    const date = new Date();

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    const weekday = days[date.getDay()];
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0"); // Add leading zero if needed
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${month} ${day}, ${year} ${weekday} ${hours}:${minutes} ${period}`;
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

// let holdTimeout;
// const holdDetectElement = document.getElementById("sendmessage-btn");
// function startHoldWhisper() {
//     holdTimeout = setTimeout(() => {
//         document.getElementById("parsermessage-txt").style.backgroundColor = "#ede6ff";
//         document.getElementById("parsermessage-txt").style.border = "0.4px solid #6029ec";
//         document.getElementById("sendmessage-btn").style.display = "none";
//         document.getElementById("whispermessage-btn").style.display = "block";
//     }, 500);
// }
// function cancelHold() {
//     clearTimeout(holdTimeout);
// }
// holdDetectElement.addEventListener("touchstart", startHoldWhisper);
// holdDetectElement.addEventListener("touchend", cancelHold);
// holdDetectElement.addEventListener("touchcancel", cancelHold);

function showParseroomDetails() {
    document.getElementById("parsecode").innerHTML = localStorage.getItem("parseroom-code");
    document.getElementById("parsename").innerHTML = localStorage.getItem("parseroom-name");
} showParseroomDetails();
function extractUsername(text) {
    const match = text.match(/@(\S+)/);
    const messageInput = document.getElementById("parsermessage-txt").value;
    const whisperInput = removeUsername(messageInput);
    if (match) {
        return match[1];
    }
    return getparser_id(whisperInput);
}
function removeUsername(text) {
    const match = text.match(/@\S+/);
    let newText = text;
    if (match) {
        newText = text.replace(match[0], '').trim();
        return newText;
    }
    else {
        return null;
    }
}
async function submitWhisperMessage() {
    const messageInput = document.getElementById("parsermessage-txt").value;
    const whisperInput = await removeUsername(messageInput);
    let whisperTo_username = await extractUsername(messageInput) || await getparser_username(localStorage.getItem('active-whisper-id'));
    let whisperTo = await getparser_id(whisperTo_username) || localStorage.getItem('active-whisper-id');
    const username = localStorage.getItem("parser-username");
    const sender_profile = await activeProfile(user_parser);
    if (messageInput === '' || whisperInput === '') {
        errorWhisperTheme();
    }
    else {
        if (whisperTo_username === null || whisperTo === null || username === null) {
            errorWhisperTheme();
        }
        else {
            const newAnnouncement = {
                description: whisperInput || messageInput,
                from: user_parser,
                to: whisperTo,
                to_username: whisperTo_username,
                time: getMessageTime(),
                from_username: username,
                sender_profile: sender_profile,
            };

            const dbRef = ref(database, `PARSEIT/administration/parseroom/${parseroom_id}/messages/`);
            const newAnnouncementRef = push(dbRef);

            try {
                await set(newAnnouncementRef, newAnnouncement);
                document.getElementById("parsermessage-txt").value = "";
                document.getElementById("parsermessage-txt").style.backgroundColor = "#f1f1f1d8";
                document.getElementById("parsermessage-txt").style.border = "0.4px solid #dcdcdc";
                document.getElementById("sendmessage-btn").style.display = "none";
                document.getElementById("whispermessage-btn").style.display = "block";
                showWhisperTheme();
                showPrivateMessages();
            } catch (error) {
                console.error("Error submitting announcement: ", error);
            }
        }
    }
    scrollToBottom();
}
let startY = 0;
let endY = 0;
document.addEventListener('touchstart', (event) => {
    startY = event.touches[0].clientY;
});
document.addEventListener('touchend', async (event) => {
    endY = event.changedTouches[0].clientY;
    if (startY - endY > 400) {
        let messageInput = document.getElementById("parsermessage-txt").value;
        if (messageInput === '') {
            getParseroomMessages();
            hideWhisperTheme();
            errorWhisperTheme();
        }
        else {
            if (messageInput.includes('@')) {
                let username = extractUsername(messageInput);
                let id = await getparser_id(username);
                if (id !== null) {
                    localStorage.setItem('active-whisper-id', id);
                    showPrivateMessages();
                    showWhisperTheme();
                }
                else {
                    getParseroomMessages();
                    errorWhisperTheme();
                }
            }
            else {
                getParseroomMessages();
                errorWhisperTheme();
            }
        }
    }
});
function showWhisperTheme() {
    document.getElementById('parseroom-body').style.backgroundColor = '#000000';
    document.getElementById('parseroom-header').style.backgroundColor = '#000000';
    document.getElementById('parsecode').style.backgroundColor = '#000000';
    document.getElementById('parsename').style.backgroundColor = '#000000';
    document.getElementById('parsecode').style.color = '#fefefe';
    document.getElementById('parsename').style.color = '#fefefe';
    document.getElementById('closeparseroom-btn').style.filter = 'brightness(0) saturate(100%) invert(97%) sepia(6%) saturate(462%) hue-rotate(239deg) brightness(119%) contrast(99%)';
    document.getElementById('info-btn').style.filter = 'brightness(0) saturate(100%) invert(97%) sepia(6%) saturate(462%) hue-rotate(239deg) brightness(119%) contrast(99%)';
    document.getElementById('parseroom-header').style.boxShadow = 'rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px';
    document.getElementById('parseroom-footer').style.boxShadow = 'rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px';
    document.getElementById('parseroom-footer').style.backgroundColor = '#000000';
    document.getElementById('parsermessage-txt').style.backgroundColor = '#2f2f2f';
    document.getElementById('parsermessage-txt').style.color = '#fefefe';
    document.getElementById('parsermessage-txt').style.border = '0.4px solid #dcdcdc';
    document.getElementById('sendmessage-btn').style.display = 'none';
    document.getElementById('whispermessage-btn').style.display = 'block';
    document.querySelectorAll('.p-username').forEach(element => {
        element.style.color = '#fefefe';
    });
}
function showPrivateMessages() {
    const dbRef = ref(database, `PARSEIT/administration/parseroom/${parseroom_id}/messages/`);
    const latestMessageQuery = query(dbRef, orderByKey());

    onValue(latestMessageQuery, (snapshot) => {
        if (snapshot.exists()) {
            let messagecont = document.getElementById("parseroom-body-wrapper");
            //messagecont.innerHTML = "";
            let appendMessageHTML = "<div class='filler-message'></div>";
            const snapshotData = snapshot.val();
            const reversedsnapshot = Object.entries(snapshotData);
            reversedsnapshot.forEach(([key, message]) => {
                if (message.from === user_parser) {
                    if (message.to !== "everyone" && message.to === localStorage.getItem('active-whisper-id')) {
                        appendMessageHTML += `
                        <div class="parseroom-message">
                        <section class="p-message p-message-me" >
                        <section class="p-username p-username-me" style="color: #fefefe; opacity: 0.5;">@${message.from_username}</section>
                        <section class="p-description p-description-me-whisper">${message.description}</section>
                        </section>
                        <section class="p-profile p-profile-me">
                        <img id="parser-profile parser-profile-me" class="parser-profile" src='${active_profile}' alt="" />
                        </section>
                        </div>`;
                    }
                }
                else {
                    if (message.from === localStorage.getItem('active-whisper-id') && message.to === user_parser) {
                        appendMessageHTML += `
                        <div class="parseroom-message">
                        <section class="p-profile">
                        <img id="parser-profile" class="parser-profile" src='${message.sender_profile}' alt="" />
                        </section>
                        <section class="p-message">
                        <section class="p-username" style="color: #fefefe; opacity: 0.5;">@${message.from_username}</section>
                        <section class="p-description p-description-whisper" onclick="
                        localStorage.setItem('active-whisper-id', '${message.from}');
                        "
                        >${message.description}</section>
                        </section>
                        </div>`
                    }
                }
            });
            messagecont.innerHTML = appendMessageHTML;
            scrollToBottom();
        } else {

        }
    }, (error) => {
        console.error("Error fetching announcement: ", error);
    });
}
function hideWhisperTheme() {
    document.getElementById('parseroom-body').style.backgroundColor = '#fefefe';
    document.getElementById('parseroom-header').style.backgroundColor = '#fefefe';
    document.getElementById('parsecode').style.backgroundColor = 'transparent';
    document.getElementById('parsename').style.backgroundColor = 'transparent';
    document.getElementById('parsecode').style.color = 'black';
    document.getElementById('parsename').style.color = 'black';

    document.getElementById('closeparseroom-btn').style.filter = 'brightness(0) saturate(100%) invert(0%) sepia(2%) saturate(0%) hue-rotate(239deg) brightness(100%) contrast(100%)';
    document.getElementById('info-btn').style.filter = 'brightness(0) saturate(100%) invert(8%) sepia(87%) saturate(7314%) hue-rotate(2deg) brightness(123%) contrast(106%)';
    document.getElementById('parseroom-header').style.boxShadow = 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px';
    document.getElementById('parseroom-footer').style.boxShadow = 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px';
    document.getElementById('parseroom-footer').style.backgroundColor = '#fefefe';
    document.getElementById('parsermessage-txt').style.backgroundColor = '#f1f1f1d8';
    document.getElementById('parsermessage-txt').style.color = 'black';
    document.getElementById('parsermessage-txt').style.border = '0.4px solid #dcdcdc';
    document.getElementById('sendmessage-btn').style.display = 'block';
    document.getElementById('whispermessage-btn').style.display = 'none';
    document.querySelectorAll('.p-username').forEach(element => {
        element.style.color = 'black';
        element.style.opacity = '0.5';
    });
    document.getElementById('parsermessage-txt').value = '';
}
function errorWhisperTheme() {
    document.getElementById('parsermessage-txt').style.border = '0.4px solid #f30505';
    setTimeout(() => {
        document.getElementById('parsermessage-txt').style.border = '0.4px solid #dcdcdc';
    }, 1000);
}

async function setparserBanners(id) {
    const profileRef = child(dbRef, `PARSEIT/administration/students/${id}/profile`);
    const teacherProfileRef = child(dbRef, `PARSEIT/administration/teachers/${id}/profile`);

    const snapshot2 = await get(profileRef);
    const snapTeacher2 = await get(teacherProfileRef);

    if (snapshot2.exists()) {
        document.getElementById('parser-profile').src = `assets/profiles/${snapshot2.val()}`;

    }
    else {
        if (snapTeacher2.exists()) {
            document.getElementById('parser-profile').src = `assets/profiles/${snapTeacher2.val()}`;
        }
        else {
            document.getElementById('parser-profile').src = `assets/profiles/default_profile.png`;
        }
    }
} 

async function activeProfile(id) {
    const profileRef = child(dbRef, `PARSEIT/administration/students/${id}/profile`);
    const teacherProfileRef = child(dbRef, `PARSEIT/administration/teachers/${id}/profile`);

    const snapshot2 = await get(profileRef);
    const snapTeacher2 = await get(teacherProfileRef);

    if (snapshot2.exists()) {
        return `assets/profiles/${snapshot2.val()}`;

    }
    else {
        if (snapTeacher2.exists()) {
            return `assets/profiles/${snapTeacher2.val()}`;
        }
        else {
            return `assets/profiles/default_profile.png`;
        }
    }
} 

async function updateSenderProfile(parseroom_id, user_parser, active_profile) {
    const senderRef = child(dbRef, `PARSEIT/administration/parseroom/${parseroom_id}/messages/`);
    const data = await get(senderRef);
    if (data.exists()) {
        data.forEach((childSnapshot) => {
            const childValue = childSnapshot.val();
            if(childValue.from === user_parser){
                const childKey = childSnapshot.key;
                update(ref(database, `PARSEIT/administration/parseroom/${parseroom_id}/messages/${childKey}`), {
                    sender_profile: active_profile,
                })

            }
        });
    }
}