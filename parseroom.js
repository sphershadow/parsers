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
setScreenSize(window.innerWidth, window.innerHeight);
window.addEventListener("load", async function () {
    document.getElementById("loading_animation_div").style.display = "none";
    getParseroomMessages();

});
let startX = 0;
let endX = 0;
document.addEventListener('touchstart', (event) => {
    startX = event.touches[0].clientX;
});
document.addEventListener('touchend', (event) => {
    endX = event.changedTouches[0].clientX;
    
    if (startX - endX > 50) {
        document.getElementById("body-parseroom-div").style.animation= "parseroom-slideIn 0.6s ease-out forwards";
        document.getElementById("details-parseroom-div").style.animation= "parseroom-slideIn 0.6s ease-out forwards";
    }
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


//functions
function setScreenSize(width, height) {
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
                        <section class="p-description">${message.description}</section>
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
                        <section class="p-description p-description-whisper">${message.description}</section>
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
        to_username: "x",
        time: getMessageTime(),
        from_username: username,
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


let holdTimeout;
const holdDetectElement = document.getElementById("parsermessage-txt");
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