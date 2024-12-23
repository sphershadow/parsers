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
const assignmentcode = Date.now().toString();

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
    document.getElementById("attachedfile-container-wrapper").style.display = "block";


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



document.getElementById("widget-image-file").addEventListener("click", () => {
    // accept = "image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    document.getElementById("fileInput").click();
});




document.getElementById('fileInput').addEventListener('change', handleFileInput);
async function handleFileInput(event) {
    document.getElementById("attachedfile-container-wrapper").style.display = "none";
    document.getElementById("assigment-attachedfile-container").style.display = "block";

    const subject = localStorage.getItem("parseroom-code");
    const section = localStorage.getItem("parseroom-section");

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
        const filePath = `PARSEIT/storage/${admin_id}/${section}/${subject}/${file.name}`;

        uploadFileToGitHub(token, owner, repo, filePath, base64FileContent, file.name).then(async () => {
            await addAttachment(file.type, file.name);
        });
    };

    reader.onerror = () => {
        //console.error("Error reading file.");
    }
    reader.readAsDataURL(file);
}


async function uploadFileToGitHub(token, owner, repo, filePath, fileContent, filename) {
    const attachmentid = 'file-' + Date.now().toString();
    const container = document.createElement('section');
    container.className = 'attachedfile-container';
    container.id = 'attachedfile-container';
    const progressBarWrapper = document.createElement('section');
    progressBarWrapper.className = 'progress-bar-wrapper';
    progressBarWrapper.id = 'view' + attachmentid;
    const progressBarFill = document.createElement('div');
    progressBarFill.className = 'progress-bar-fill';
    progressBarFill.id = attachmentid;
    const label = document.createElement('label');
    label.className = 'sticky-attached';
    label.htmlFor = '';
    label.textContent = filename;
    progressBarWrapper.appendChild(progressBarFill);
    progressBarWrapper.appendChild(label);
    const removeSection = document.createElement('section');
    removeSection.className = 'remove-attachedfile';

    removeSection.addEventListener('click', async (event) => {
        const fileSha = await getSha(filePath);
        await deleteFileGitHub(token, owner, repo, filePath, fileSha);
        container.remove();
    });
    const removeImg = document.createElement('img');
    removeImg.src = 'assets/icons/xmark-solid.svg';
    removeImg.alt = '';
    removeImg.className = 'remove-attachedfile-img';
    removeSection.appendChild(removeImg);
    container.appendChild(progressBarWrapper);
    container.appendChild(removeSection);
    const parentElement = document.getElementById('assigment-attachedfile-container');
    parentElement.appendChild(container);


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

        progressBarWrapper.addEventListener('click', async (event) => {
            const fileUrl = responseData.content.download_url;
            const fileExtension = fileUrl.split('.').pop().toLowerCase();

            if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
                const imgElement = document.getElementById('viewattachedfile-img');
                imgElement.src = fileUrl;
                document.getElementById('viewattachedfile-container').style.display = 'flex';
                document.getElementById("viewattachedfile-container").style.animation =
                    "fadeScaleUp-bg 0.25s ease-in-out forwards";

                document.getElementById("viewattachedfile-img").style.animation =
                    "fadeScaleUp 0.25s ease-in-out forwards";

                let startY = 0;
                let endY = 0;
                document.addEventListener("touchstart", (event) => {
                    startY = event.touches[0].clientY;
                });
                document.addEventListener("touchend", (event) => {
                    endY = event.changedTouches[0].clientY;
                    if (endY - startY > 300) {

                        document.getElementById("viewattachedfile-img").style.animation =
                            "fadeScaleDown 0.25s ease-in-out forwards";

                        document.getElementById("viewattachedfile-container").style.animation =
                            "fadeScaleDown-bg 0.25s ease-in-out forwards";
                        setTimeout(() => {
                            document.getElementById('viewattachedfile-container').style.display = 'none';
                        }, 500);
                    }
                });
            }

            if (['doc', 'docx'].includes(fileExtension)) {
                document.getElementById('viewattachedfile-container-docx').style.display = 'flex';
                document.getElementById("viewattachedfile-container-docx").style.animation =
                    "fadeScaleUp-bg 0.25s ease-in-out forwards";

                document.getElementById("output-wordfile").style.animation =
                    "fadeScaleUp 0.25s ease-in-out forwards";
                try {
                    const response = await fetch(fileUrl);
                    const arrayBuffer = await response.arrayBuffer();

                    mammoth.convertToHtml({ arrayBuffer: arrayBuffer }).then(function (result) {
                        document.getElementById("output-wordfile").innerHTML = result.value;
                    }).catch(function (err) {
                        console.log("Error:", err);
                    });



                    let startY = 0;
                    let endY = 0;
                    document.addEventListener("touchstart", (event) => {
                        startY = event.touches[0].clientY;
                    });
                    document.addEventListener("touchend", (event) => {
                        endY = event.changedTouches[0].clientY;
                        if (endY - startY > 300) {

                            document.getElementById("output-wordfile").style.animation =
                                "fadeScaleDown 0.25s ease-in-out forwards";

                            document.getElementById("viewattachedfile-container-docx").style.animation =
                                "fadeScaleDown-bg 0.25s ease-in-out forwards";
                            setTimeout(() => {
                                document.getElementById('viewattachedfile-container-docx').style.display = 'none';
                            }, 500);
                        }
                    });

                } catch (error) {
                    console.error("Error fetching DOCX file:", error);
                }
            }

            if (['pdf'].includes(fileExtension)) {
                document.getElementById('viewattachedfile-container-pdf').style.display = 'flex';
                document.getElementById("viewattachedfile-container-pdf").style.animation =
                    "fadeScaleUp-bg 0.25s ease-in-out forwards";

                document.getElementById("output-pdffile").style.animation =
                    "fadeScaleUp 0.25s ease-in-out forwards";
                try {

                    pdfjsLib.getDocument(fileUrl).promise.then(function (pdf) {
                        const container = document.getElementById("output-pdffile");
                        container.innerHTML = "";

                        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
                            pdf.getPage(pageNumber).then(function (page) {
                                const containerWidth = container.offsetWidth;
                                const viewport = page.getViewport({ scale: 1 });
                                const scale = containerWidth / viewport.width;
                                const scaledViewport = page.getViewport({ scale: scale });
                                const canvas = document.createElement("canvas");
                                const context = canvas.getContext("2d");
                                canvas.width = scaledViewport.width;
                                canvas.height = scaledViewport.height;
                                page.render({
                                    canvasContext: context,
                                    viewport: scaledViewport,
                                }).promise.then(function () {
                                    container.appendChild(canvas);
                                });
                            });
                        }
                    });

                    let startY = 0;
                    let endY = 0;
                    document.addEventListener("touchstart", (event) => {
                        startY = event.touches[0].clientY;
                    });
                    document.addEventListener("touchend", (event) => {
                        endY = event.changedTouches[0].clientY;
                        if (endY - startY > 300) {

                            document.getElementById("output-pdffile").style.animation =
                                "fadeScaleDown 0.25s ease-in-out forwards";

                            document.getElementById("viewattachedfile-container-pdf").style.animation =
                                "fadeScaleDown-bg 0.25s ease-in-out forwards";
                            setTimeout(() => {
                                document.getElementById('viewattachedfile-container-pdf').style.display = 'none';
                            }, 500);
                        }
                    });

                } catch (error) {
                    console.error("Error fetching DOCX file:", error);
                }
            }
        });

        const progressBarFill = document.getElementById(attachmentid);
        let progress = 0;
        const interval = setInterval(() => {
            if (progress < 100) {
                progress += 1;
                progressBarFill.style.width = `${progress}%`;
            } else {
                clearInterval(interval);
            }

            if (!response.ok) {
                document.getElementById("attachedfile-container").style.display = "none";
                return;
            }
            if (response.ok) {
                progressBarFill.style.width = `100%`;
                document.getElementById('fileInput').value = '';
                return responseData;
            }
        }, 100);
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


async function addAttachment(type, filename) {
    const acadref = localStorage.getItem("parseroom-acadref");
    const yearlvl = localStorage.getItem("parseroom-yearlvl");
    const sem = localStorage.getItem("parseroom-sem");
    const subject = localStorage.getItem("parseroom-code");
    const section = localStorage.getItem("parseroom-section");
    const attachmentcode = Date.now().toString();


    await update(ref(database, `PARSEIT/administration/parseclass/${acadref}/${yearlvl}/${sem}/${subject}/${section}/assignment/${assignmentcode}/attachedfile/${attachmentcode}/`), {
        type: type,
        filename: filename,
    });



}

async function deleteFileGitHub(token, owner, repo, filePath, fileSha) {


    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`;

    const data = {
        message: "delete file", // Commit message for the deletion
        sha: fileSha, // The SHA of the file to be deleted (you need to fetch this first)
    };

    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/vnd.github.v3+json",
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();

        if (!response.ok) {
            console.error("Error deleting file:", responseData);
            return;
        }

        // Handle successful deletion
        console.log("File deleted successfully:", responseData);

    } catch (error) {
        console.error("Error deleting file:", error);
    }


}

async function getSha(filePath) {
    const token = await getApikey();
    const owner = "parseitlearninghub";
    const repo = "parseitlearninghub-storage";

    const fileUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}/`;
    const response = await fetch(fileUrl, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/vnd.github.v3+json",
        },
    });

    const fileDetails = await response.json();
    const fileSha = fileDetails.sha;
    return fileSha;
} 