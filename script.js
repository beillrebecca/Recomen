alert("JSスタート");

// =========================
// ① データ
// =========================
let items = [
  {
    id: 1,
    name: "テストA",
    price: "¥1000",
    img: "https://via.placeholder.com/300",
    liked: false,
    saved: false,
    clicks: 0,
    link: "#"
  },
  {
    id: 2,
    name: "テストB",
    price: "¥2000",
    img: "https://via.placeholder.com/300",
    liked: false,
    saved: false,
    clicks: 0,
    link: "#"
  }
];

// =========================
// ② カード生成
// =========================
function createCard(item) {
  const card = document.createElement('div');
  card.className = 'card';
  card.id = `card-${item.id}`;

  card.innerHTML = `
    <div class="image">
      <img src="${item.img || ''}" alt="">
      <span class="modern-clicks">${item.clicks || 0}</span>
    </div>

    <div class="card-name" contenteditable="true">
      ${item.name || ''}
    </div>

    <div class="price-link-wrapper">
      <div class="card-price" contenteditable="true">
        ${item.price || '¥0'}
      </div>

      <a class="link-display" href="${item.link || '#'}" target="_blank">
        ${item.link || "リンク未設定"}
      </a>

      <button class="edit-link-btn">リンク編集</button>
    </div>

    <div class="card-actions">
      ${heartIcon(item)}
      ${commentIcon()}
      ${shareIcon()}
      ${saveIcon(item)}
    </div>
  `;

  return card;
}

// =========================
// ③ 描画
// =========================
function renderCards() {
  alert("renderCards入った");

  const showcase = document.getElementById("showcase");
  alert("showcase → " + showcase);

  showcase.innerHTML = "";

  items.forEach(item => {
    const card = createCard(item);
    showcase.appendChild(card);
  });
}

// =========================
// ④ 初期化＋イベント
// =========================
document.addEventListener("DOMContentLoaded", () => {
  alert("DOMContentLoaded動いた"); // ←これ追加

  renderCards(); // ←これは元からあるならOK
});