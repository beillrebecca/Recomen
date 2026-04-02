// =========================
// 🔹 新規登録処理（Signup）
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const signupBtn = document.getElementById("signupBtn");

  if(signupBtn){
    signupBtn.addEventListener("click", () => {
      const user = document.getElementById("newUsername").value;
      const pass = document.getElementById("newPassword").value;

      if(user && pass){
        localStorage.setItem("loginUser", user);
        localStorage.setItem("loginPass", pass);
        alert("登録完了！ログインしてください");
        location.href = "login.html";
      } else {
        alert("全て入力してください");
      }
    });
  }
});