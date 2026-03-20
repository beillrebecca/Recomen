alert("JS読み込まれてる！");

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM読み込みOK");

  const showcase = document.getElementById("showcase");

  if (!showcase) {
    console.error("showcaseが見つからない");
    return;
  }

  // 👇 まずはクリック確認だけ
  showcase.addEventListener("click", (e) => {
    console.log("クリックされた！", e.target);
    alert("カードがクリックされた！");
  });
});