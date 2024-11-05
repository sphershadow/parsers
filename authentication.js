import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
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


function setScreenSize() {
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  document.body.style.height = screenHeight + 'px';
  document.body.style.width = screenWidth + 'px';

}



const signin = document.getElementById("signin_btn");
signin.addEventListener("click", (event) => {
  var email = document.getElementById("username_txt").value;
  var password = document.getElementById("password_txt").value;

  const auth = getAuth();
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredentials) => {
      localStorage.setItem("user-parser", email);
      window.location.href = "index.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      if (errorCode === "auth/missing-password") {
        alert('auth/missing-password');
      }

      if (errorCode === "auth/invalid-email") {
        alert('auth/invalid-email');
      }

      if (errorCode === "auth/wrong-password" || errorCode === "auth/user-not-found") {
        alert('auth/wrong-password');
      }

      if (errorCode === "auth/invalid-credential") {
        alert('auth/invalid-credential');
      }
    });
});
