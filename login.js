document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("loginBtn");
  const guestBtn = document.getElementById("guestBtn");
  const goSignup = document.getElementById("goSignup");

  loginBtn?.addEventListener("click", () => {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    const storedUser = localStorage.getItem("loginUser");
    const storedPass = localStorage.getItem("loginPass");

    if(user === storedUser && pass === storedPass){
      location.href = "home.html";
    } else {
      alert("ユーザー名かパスワードが違います");
    }
  });

  guestBtn?.addEventListener("click", () => {
    localStorage.setItem("loginUser", "guest");
    location.href = "index.html";
  });

  goSignup?.addEventListener("click", () => {
    location.href = "signup.html";
  });
});