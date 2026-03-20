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

document.addEventListener("DOMContentLoaded", () => {
  const showcase = document.getElementById("showcase");
  if (!showcase) return;

  // 保存データ読み込み
  loadAppState();

  // ヘッダー・アバター画像アップロード
  setupImageUpload(
    document.getElementById('headerImg'),
    document.getElementById('headerImgInput')
  );
  setupImageUpload(
    document.getElementById('avatarImg'),
    document.getElementById('avatarImgInput')
  );

  // 初期データが空の場合は追加
  if (!items || items.length === 0) {
    for (let i = 1; i <= 12; i++) {
      items.push({
        name: "アイテム" + i,
        img: "https://dummyimage.com/300x300/eeeeee/999999&text=%F0%9F%93%B7",
        link: "商品リンク",
        clicks: 0,
        liked: false,
        saved: false
      });
    }
  }

  // カード描画
  function renderCards() {
    showcase.innerHTML = "";
    items.forEach(item => {
      const card = createCard(item);
      showcase.appendChild(card);
    });
  }

  renderCards();
});