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
let parseroom_id = localStorage.getItem("parser-parseroom");
let parseroom_username = localStorage.getItem("parser-username");
//listeners
await setScreenSize(window.innerWidth, window.innerHeight);
window.addEventListener("load", async function () {
    document.getElementById("loading_animation_div").style.display = "none";
    getParseroomMessages();
});

document.getElementById("details-btn").addEventListener('click', (event) => {
    document.getElementById("body-parseroom-div").style.animation= "parseroom-slideOut 0.6s ease-out forwards";
    document.getElementById("details-parseroom-div").style.animation= "parseroom-slideOut 0.6s ease-out forwards";
});
window.addEventListener("resize", adjustChatbox);adjustChatbox();
window.addEventListener("resize", scrollToBottom);scrollToBottom();
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
});
 document.getElementById("info-btn").addEventListener('click', (event) => {
    document.getElementById("body-parseroom-div").style.animation= "parseroom-slideIn 0.6s ease-out forwards";
    document.getElementById("details-parseroom-div").style.animation= "parseroom-slideIn 0.6s ease-out forwards";
});
document.getElementById("whispermessage-btn").addEventListener('click', (event) => {
   submitWhisperMessage();
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
function getParseroomMessages(){
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
                if(message.from === user_parser){
                    if(message.to === "everyone"){
                        appendMessageHTML += `
                        <div class="parseroom-message">
                        <section class="p-message p-message-me">
                        <section class="p-username p-username-me">@${message.from_username}</section>
                        <section class="p-description p-description-me"> ${message.description}</section>
                        </section>
                        <section class="p-profile p-profile-me">
                        <img id="parser-profile parser-profile-me" class="parser-profile" src="assets/game_background/fruitmania.jpg" alt="" />
                        </section>
                        </div>`;
                    }
                    else{
                        appendMessageHTML += `
                        <div class="parseroom-message">
                        <section class="p-message p-message-me">
                        <section class="p-username p-username-me">@${message.from_username}</section>
                        <section class="p-description p-description-me-whisper">@${message.to_username} ${message.description}</section>
                        </section>
                        <section class="p-profile p-profile-me">
                        <img id="parser-profile parser-profile-me" class="parser-profile" src="assets/game_background/fruitmania.jpg" alt="" />
                        </section>
                        </div>`;
                    }
                }
                else{
                    if(message.to === "everyone"){
                        appendMessageHTML += `
                        <div class="parseroom-message">
                        <section class="p-profile">
                        <img id="parser-profile" class="parser-profile" src="assets/game_background/fruitmania.jpg" alt="" />
                        </section>
                        <section class="p-message">
                        <section class="p-username">@${message.from_username}</section>
                        <section class="p-description" onclick="localStorage.setItem('active-whisper-username', '${message.from}');
                        document.getElementById('parsermessage-txt').innerText = '@${message.from_username} '";
                        document.getElementById('parsermessage-txt').focus()";
                        >${message.description}</section>
                        </section>
                        </div>`
                    }
                    else{
                        if(message.to_username === parseroom_username){
                            appendMessageHTML += `
                        <div class="parseroom-message">
                        <section class="p-profile">
                        <img id="parser-profile" class="parser-profile" src="assets/game_background/fruitmania.jpg" alt="" />
                        </section>
                        <section class="p-message">
                        <section class="p-username">@${message.from_username}</section>
                        <section class="p-description p-description-whisper" onclick="
                        localStorage.setItem('active-whisper-username', '${message.from}');
                        document.getElementById('parsermessage-txt').innerText = '@${message.from_username} '";
                        document.getElementById('parsermessage-txt').focus()";
                        >${message.description}</section>
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
async function submitMessage(){
    const messageInput = document.getElementById("parsermessage-txt").value;
    const username = await getparser_username(user_parser);
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
    };

    const dbRef = ref(database, `PARSEIT/administration/parseroom/${parseroom_id}/messages/`);
    const newAnnouncementRef = push(dbRef);

    try {
        await set(newAnnouncementRef, newAnnouncement);
        document.getElementById("parsermessage-txt").value = "";
        getParseroomMessages();
        scrollToBottom();
        
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
        console.log(snapshot.val());
        
    } else {
        console.log("No data available");
        return null;
    }
}

let holdTimeout;
const holdDetectElement = document.getElementById("sendmessage-btn");
function startHoldWhisper() {
    holdTimeout = setTimeout(() => {
        document.getElementById("parsermessage-txt").style.backgroundColor = "#ede6ff";
        document.getElementById("parsermessage-txt").style.border = "0.4px solid #6029ec";
        document.getElementById("sendmessage-btn").style.display = "none";
        document.getElementById("whispermessage-btn").style.display = "block";
    }, 500);
}
function cancelHold() {
    clearTimeout(holdTimeout);
}
holdDetectElement.addEventListener("touchstart", startHoldWhisper);
holdDetectElement.addEventListener("touchend", cancelHold);
holdDetectElement.addEventListener("touchcancel", cancelHold);
showParseroomDetails();
function showParseroomDetails(){
    document.getElementById("parsecode").innerHTML = localStorage.getItem("parseroom-code");
    document.getElementById("parsename").innerHTML = localStorage.getItem("parseroom-name");
}
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
}
async function submitWhisperMessage(){
    const messageInput = document.getElementById("parsermessage-txt").value;
    const whisperInput = removeUsername(messageInput);
    const whisperTo_username = extractUsername(messageInput);
    const whisperTo = localStorage.getItem("active-whisper-username");
    const username = await getparser_username(user_parser);

    if (!messageInput || whisperTo_username === null) {
        return;
    }

    const newAnnouncement = {
        description: whisperInput,
        from: user_parser,
        to: whisperTo,
        to_username: whisperTo_username,
        time: getMessageTime(),
        from_username: username,
    };

    const dbRef = ref(database, `PARSEIT/administration/parseroom/${parseroom_id}/messages/`);
    const newAnnouncementRef = push(dbRef);

    try {
        await set(newAnnouncementRef, newAnnouncement);
        document.getElementById("parsermessage-txt").value = "";
        getParseroomMessages();
        document.getElementById("parsermessage-txt").style.backgroundColor = "#f1f1f1d8";
        document.getElementById("parsermessage-txt").style.border = "0.4px solid #dcdcdc";
        document.getElementById("sendmessage-btn").style.display = "block";
        document.getElementById("whispermessage-btn").style.display = "none";
        localStorage.removeItem("active-whisper-username");
        scrollToBottom();
    } catch (error) {
        console.error("Error submitting announcement: ", error);
    }
}

let startY = 0;
let endY = 0;
document.addEventListener('touchstart', (event) => {
    startY = event.touches[0].clientY;
});
document.addEventListener('touchend', (event) => {
    endY = event.changedTouches[0].clientY;
    if (startY - endY > 400) {
        document.getElementById("parsermessage-txt").style.backgroundColor = "#ede6ff";
        document.getElementById("parsermessage-txt").style.border = "0.4px solid #6029ec";
        document.getElementById("sendmessage-btn").style.display = "none";
        document.getElementById("whispermessage-btn").style.display = "block";
    }
});