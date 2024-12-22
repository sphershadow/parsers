import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
    getDatabase,
    ref,
    get,
    child,
    update,
    remove,
    onValue,
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
const dbRef = ref(database);

const firebaseConfigAdmin = {
    apiKey: "AIzaSyCoIfQLbAq5gPil3COSauqfHNlv5P5tYXc",
    authDomain: "parseitadmin.firebaseapp.com",
    databaseURL: "https://parseitadmin-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "parseitadmin",
    storageBucket: "parseitadmin.firebasestorage.app",
    messagingSenderId: "1009498274532",
    appId: "1:1009498274532:web:69083f905357ae31b74af1"
};
const appAdmin = initializeApp(firebaseConfigAdmin, "ParseITAdmin");
const databaseAdmin = getDatabase(appAdmin);
const dbRefAdmin = ref(databaseAdmin);

let admin_id = localStorage.getItem("user-parser");


//preloads
setScreenSize(window.innerWidth, window.innerHeight);
window.addEventListener("load", function () {
    document.getElementById("loading_animation_div").style.display = "none";

});
function setScreenSize(width, height) {
    document.body.style.width = width + "px";
    document.body.style.height = height + "px";
    document.documentElement.style.height = height + "px";
}

document.getElementById('canceladdchatbot-btn').addEventListener('click', () => {
    window.location.href = 'parseroom.html';
    // localStorage.setItem('viewbulletin', 'true');
});

document.getElementById('datetime').setAttribute('min', getCurrentDateTime());
const form = document.getElementById('datetimeForm');
form.addEventListener('change', function (event) {
    event.preventDefault();
    const datetimeValue = document.getElementById('datetime').value;
    document.getElementById('setduedate-btn').innerText = formatDateTime(datetimeValue);
    document.getElementById('setduedate-btn').style.color = 'black';
    if (datetimeValue === '') {
        document.getElementById('setduedate-btn').innerText = 'Set Due Date';
        document.getElementById('setduedate-btn').style.color = '#cccccc';
    }
});


function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function formatDateTime(datetime) {
    const date = new Date(datetime);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedTime = `${hours % 12 || 12}:${minutes} ${ampm}`;
    return `${formattedDate} (${formattedTime})`;
}

function showWidget() {
    const widgets = document.querySelectorAll(".widget-wrapper");
    widgets.forEach((widget, index) => {
        document.getElementById("teacher-widget-wrapper").style.display = "flex";
        widget.classList.remove("animate-close");
        setTimeout(() => {
            widget.classList.add("animate");
        }, index * 100);
    });
}
function hideWidget() {
    const widgets = document.querySelectorAll(".widget-wrapper");
    widgets.forEach((widget, index) => {

        widget.classList.remove("animate");
        setTimeout(() => {
            widget.classList.add("animate-close");
            setTimeout(() => {
                document.getElementById("teacher-widget-wrapper").style.display = "none";
            }, 400);
        }, index * 100);
    });
}

document.getElementById("attachfile").addEventListener("click", () => {
    showWidget();
});

document.getElementById("widget-closefile").addEventListener("click", () => {
    hideWidget();
});

document.getElementById("createassignment-btn").addEventListener("click", async () => {
    const acadref = localStorage.getItem("parseroom-acadref");
    const yearlvl = localStorage.getItem("parseroom-yearlvl");
    const sem = localStorage.getItem("parseroom-sem");
    const subject = localStorage.getItem("parseroom-code");
    const section = localStorage.getItem("parseroom-section");
    const assignmentcode = Date.now().toString();

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const assignmenttype = urlParams.get('assignmenttype');
    const header = document.getElementById("header-title").value;
    const instructions = document.getElementById("createassigment-instructions").value;
    const totalscore = document.getElementById("createassigment-totalscore").value;
    const pointsontime = document.getElementById("createassigment-pointsontime").value;
    let repository = false;
    if (document.getElementById("repository-radio").checked) {
        repository = true;
    }
    const duedate = document.getElementById("datetime").value;
    const date = getCurrentDateTime();


    if (header === "") {
        errorElement("header-title");
        return;
    }

    if (instructions === "") {
        errorElement("createassigment-instructions");
        return;
    }

    if (totalscore === "") {
        errorElement("createassigment-totalscore");
        return;
    }

    if (pointsontime === "") {
        errorElement("createassigment-pointsontime");
        return;
    }

    if (duedate === "") {
        errorElement("setduedate-btn");
        return;
    }

    await update(ref(database, `PARSEIT/administration/parseclass/${acadref}/${yearlvl}/${sem}/${subject}/${section}/assignment/${assignmentcode}/`), {
        assignmenttype: assignmenttype,
        header: header,
        instructions: instructions,
        totalscore: totalscore,
        pointsontime: pointsontime,
        repository: repository,
        duedate: duedate,
        date: date,
    });
    console.log("Assignment created successfully");
});


document.getElementById("createassigment-pointsontime").addEventListener("click", () => {
    if (document.getElementById("createassigment-totalscore").value === "") {

        document.getElementById("createassigment-totalscore").focus();
        document.getElementById("createassigment-totalscore").style.border =
            "0.4px solid #f30505";
        setTimeout(() => {
            document.getElementById("createassigment-totalscore").style.border =
                "0.4px solid #dcdcdc";
        }, 1000);
    }
});

function errorElement(element) {
    document.getElementById(element).style.border = "0.4px solid #f30505";
    setTimeout(() => {
        document.getElementById(element).style.border = "0.4px solid #dcdcdc";
    }, 1000);
}



document.getElementById("widget-pdf-file").addEventListener("click", () => {
    // accept = "image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    document.getElementById("fileInput").accept = "application/pdf";
    document.getElementById("fileInput").click();
});




document.getElementById('fileInput').addEventListener('change', handleFileInput);
async function handleFileInput(event) {
    const file = event.target.files[0];
    if (!file) {
        console.error("No file selected.");
        return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
        const base64FileContent = reader.result.split(",")[1];

        const token = await getApikey();
        const owner = "parseitlearninghub";
        const repo = "parseitlearninghub-storage";
        const filePath = `PARSEIT/storage/${admin_id}/${file.name}`;

        uploadFileToGitHub(token, owner, repo, filePath, base64FileContent)
            .then(response => console.log(response))
            .catch(error => console.error(error));
    };

    reader.onerror = () => {
        //console.error("Error reading file.");
    }
    reader.readAsDataURL(file);
}


async function uploadFileToGitHub(token, owner, repo, filePath, fileContent) {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

    const data = {
        message: "assignment attachment " + admin_id,
        content: fileContent,
    };

    try {
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/vnd.github.v3+json",
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (!response.ok) {
            console.error("GitHub API error:", responseData);
            return;
        }

        console.log("File uploaded successfully:", responseData);
        return responseData;
    } catch (error) {
        console.error("Error uploading file:", error);
    }
}

async function getApikey() {
    const apikeyRef = child(dbRef, "PARSEIT/administration/apikeys/");
    const snapshot = await get(apikeyRef);
    if (snapshot.exists()) {
        const currentData = snapshot.val().githubtoken;
        return currentData;
    } else {
        return null;
    }
}
