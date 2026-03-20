// =========================
// JS読み込み確認
// =========================
alert("JSは読み込まれた！");
console.log("JSは読み込まれた！");

// =========================
// items 初期化
// =========================
let items = [
  {
    name: "アイテム1",
    price: "¥1000",
    link: "https://example.com",
    img: "https://dummyimage.com/300x300/eeeeee/999999&text=%F0%9F%93%B7",
    clicks: 0,
    liked: false,
    saved: false
  },
  // 必要なら2〜12まで同様に追加
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