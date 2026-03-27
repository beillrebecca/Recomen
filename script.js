alert("JSスタート");

// =========================
// ① データ
// =========================
let items = [
  { id: 1, name: "テストA", price: "¥1000", img: "https://via.placeholder.com/300", liked: false },
  { id: 2, name: "テストB", price: "¥2000", img: "https://via.placeholder.com/300", liked: false }
];

// =========================
// ② カード生成
// =========================
function createCard(item, index) {
  const card = e.target.closest(".card");

  card.innerHTML = `
  <div class="image">
    <img src="${item.img}" alt="">
  </div>

  <div class="card-name">${item.name}</div>
  <div class="card-price">${item.price}</div>

  <button class="like-btn">
    ${item.liked ? "❤️" : "♡"}
  </button>
`;

  card.dataset.index = index;

  return card;
}

// =========================
// ③ 描画
// =========================
function renderCards() {
  const showcase = document.getElementById("showcase");
  showcase.innerHTML = "";

  items.forEach((item, index) => {
    showcase.appendChild(createCard(item, index));
  });
}

// =========================
// ④ 初期化＋イベント
// =========================
document.addEventListener("DOMContentLoaded", () => {

  // 初回描画
  renderCards();

  // クリックイベント
  const showcase = document.getElementById("showcase");
  if (!showcase) return;

  showcase.addEventListener("click", (e) => {
    if (e.target.classList.contains("like-btn")) {

      const card = e.target.closest("div");
      const index = card.dataset.index;

      items[index].liked = !items[index].liked;

      renderCards(); // 再描画
    }
  });

});