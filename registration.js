
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getDatabase,
  set,
  ref,
  get,
  child,
  update,
  remove,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
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
const database = getDatabase(app);

// FOR EMAIL VERIFICATION
(function () {
  emailjs.init({
    publicKey: "8FZVk4TobsyaJxcCJ",
  });
})();

const next = document.getElementById("next_btn");

next.addEventListener("click", (event) => {
  const input_id = document.getElementById("username_txt").value;
  const input_email = document.getElementById("email_txt").value;

  if (input_id === "") {
    return alert("Input ID.");
  }

  if (input_email === "") {
    return alert("Input Email.");
  }


});


const next1 = document.getElementById("next1_btn");

next1.addEventListener("click", async (event) => {
  var email = document.getElementById("email_txt").value;

  // Trim email before using it
  function trimEmail(text) {
    const emailDomain = "@gmail.com";
    const index = text.indexOf(emailDomain);
    if (index !== -1) {
      return text.substring(0, index);
    }
    return text;
  }

  const trimmedEmail = trimEmail(email);
  const dbRef = ref(database);

  try {
    // Get user info using trimmed email
    const userSnapshot = await get(child(dbRef, "PARSEIT/userinfo/" + trimmedEmail));

    if (userSnapshot.exists()) {
      const studentid = userSnapshot.val().studentid;

      // Get student information using studentid
      const studentSnapshot = await get(child(dbRef, "PARSEIT/administration/students/" + studentid));

      if (studentSnapshot.exists()) {
        document.getElementById("txtfirstname").value = studentSnapshot.val().firstname;
        document.getElementById("txtlastname").value = studentSnapshot.val().lastname;
        document.getElementById("txtmidname").value = studentSnapshot.val().middlename;
        document.getElementById("txtsuffixname").value = studentSnapshot.val().suffix;
      }

      // Check if verification code exists
      const verificationCode = userSnapshot.val().verificationcode;
      if (verificationCode !== null) {
        const input_code = document.getElementById("verification_txt").value;

        // If input code matches verification code
        if (input_code === verificationCode) {
          // Remove the verification code
          await remove(ref(database, "PARSEIT/userinfo/" + trimmedEmail + "/verificationcode"));

          // Show/hide relevant containers
          document.getElementById("div_signup_container").style.display = "none";
          document.getElementById("div_verify_container").style.display = "none";
          document.getElementById("div_fillout_container").style.display = "flex";

          // Update the step progress
          document.getElementById("step1_cont").style.display = "block";
          document.getElementById("step1_circle").style.backgroundColor = "#007AFF";
          document.getElementById("step1_circle").style.color = "#fefefe";
        } else {
          console.log("Verification code does not match.");
        }
      }
    } else {
      console.log("User not found.");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});


const step5_btn = document.getElementById("step5_btn");
step5_btn.addEventListener("click", async (event) => {
  event.preventDefault();
  var fullname =
    document.getElementById("txtfirstname").value + " " +
    document.getElementById("txtmidname").value + " " +
    document.getElementById("txtlastname").value + " " +
    document.getElementById("txtsuffixname").value;
  var birthday =
    document.getElementById("txtbirthmonth").value + " " +
    document.getElementById("txtbirthday").value + " " +
    document.getElementById("txtbirthyear").value;

  var username = document.getElementById("txtusername").value;
  var password = document.getElementById("txtpassword").value;
  var email = document.getElementById("email_txt").value;
  var id = document.getElementById("username_txt").value;

  function trimEmail(text) {
    const emailDomain = "@gmail.com";
    const index = text.indexOf(emailDomain);
    if (index !== -1) {
      return text.substring(0, index);
    }
    return text;
  }

  const trimmedEmail = trimEmail(email);
  await update(ref(database, "PARSEIT/userinfo/" + trimmedEmail), {
    fullname: fullname,
    birthday: birthday,
    username: username,
    active: true,
  }).then(() => {
    const auth = getAuth();
    const userCredentials = createUserWithEmailAndPassword(auth, email, password).then(() => {
      window.location.href = "authentication.html";
    });

  });


});
