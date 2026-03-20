alert("JS読み込まれてる！");

const showcase = document.getElementById("showcase");

console.log("showcase:", showcase);

if (showcase) {
  showcase.addEventListener("click", (e) => {
    console.log("クリックされた！", e.target);
    alert("カードがクリックされた！");
  });
} else {
  console.error("showcase取れてない");
}