function signout() {
    localStorage.removeItem("user-parser");
    window.location.href = "login.html";
}