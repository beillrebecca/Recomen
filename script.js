alert("JSは読み込まれた！");
console.log("JSは読み込まれた！");


document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM読み込みOK");

  const showcase = document.getElementById("showcase");
  const itemImgInput = document.getElementById("itemImgInput");

  console.log('showcase:', showcase);
  console.log('itemImgInput:', itemImgInput);

  if (!showcase) {
    console.error("showcase が見つからない");
    return;
  }

  if (!itemImgInput) {
    console.warn("itemImgInput が見つからない");
  }
});


// =========================
  // 仮データ（テスト用）
  // =========================
  for (let i = 1; i <= 3; i++) {
    items.push({
      name: "アイテム" + i,
      img: "https://dummyimage.com/300x300/eeeeee/999999&text=IMG",
      link: "#",
      price: "¥0"
    });
  }

  // =========================
  // カード生成（超シンプル版）
  // =========================
  function createCard(item) {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="image">
        <img src="${item.img}">
      </div>
      <div class="card-name">${item.name}</div>
    `;

    return card;
  }

  // =========================
  // 描画
  // =========================
  function renderCards() {
    showcase.innerHTML = "";

    items.forEach(item => {
      const card = createCard(item);
      showcase.appendChild(card);
    });
  }

  renderCards();
});
