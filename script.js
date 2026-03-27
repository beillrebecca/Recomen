// =========================
// データ
// =========================
let items = [
  {id:1, name:'テストA', price:'¥1000'},
  {id:2, name:'テストB', price:'¥2000'}
];

// =========================
// カード生成
// =========================
function createCard(item) {
  const div = document.createElement("div");
  div.textContent = item.name + " - " + item.price;
  return div;
}

// =========================
// 描画
// =========================
function renderCards() {
  const showcase = document.getElementById("showcase");
  showcase.innerHTML = "";
  items.forEach(item => {
    showcase.appendChild(createCard(item));
  });
}

// =========================
// 初期化
// =========================
document.addEventListener("DOMContentLoaded", () => {
  renderCards();
});