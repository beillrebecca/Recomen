// =========================
// JS読み込み確認
// =========================
alert("JSは読み込まれた！");
console.log("JSは読み込まれた！");

// =========================
// items初期化
// =========================
let items = [
  {
    name: "テストアイテム",
    img: "https://dummyimage.com/100x100/cccccc/000000&text=IMG",
  }
];

// =========================
// DOM読み込み後
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const showcase = document.getElementById("showcase");
  const itemImgInput = document.getElementById("itemImgInput");

  // =========================
  // 画像アップロード関数
  // =========================
  function setupImageUpload(imgEl, inputEl) {
    if (!imgEl || !inputEl) return;

    imgEl.addEventListener("click", () => inputEl.click());

    inputEl.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        imgEl.src = ev.target.result;
      };
      reader.readAsDataURL(file);
      inputEl.value = '';
    });
  }

  // =========================
  // カード描画
  // =========================
  function renderCards() {
    showcase.innerHTML = "";
    items.forEach((item, index) => {
      const card = document.createElement("div");
      card.className = "card";

      const imgEl = document.createElement("img");
      imgEl.src = item.img;
      setupImageUpload(imgEl, itemImgInput);

      const nameEl = document.createElement("div");
      nameEl.textContent = item.name;

      card.appendChild(imgEl);
      card.appendChild(nameEl);
      showcase.appendChild(card);
    });
  }

  renderCards();
});