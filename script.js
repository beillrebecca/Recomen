console.log("Recomen JS 起動");

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM読み込みOK");

  const showcase = document.getElementById("showcase");
  console.log("showcase:", showcase);

  // =========================
  // データ
  // =========================
  let items = [];

  // =========================
  // 保存データ読み込み
  // =========================
  function loadAppState() {
    const saved = localStorage.getItem("recomenState");
    if (!saved) return;

    const state = JSON.parse(saved);

    if (state.items && Array.isArray(state.items)) {
      items = state.items;
    }

    console.log("保存データ読み込み完了");
  }

  // ① まず保存データを読む
  loadAppState();

  // ② 保存データが無いときだけ初期データを作る
  if (items.length === 0) {
    for (let i = 1; i <= 12; i++) {
      items.push({
        name: "アイテム" + i,
        img: "https://dummyimage.com/300x300/eeeeee/999999&text=%F0%9F%93%B7",
        link: "商品リンク",
        clicks: 0
      });
    }
  }

  console.log("items準備完了", items);

  // =========================
  // カード描画
  // =========================
  function renderCards() {
    if (!showcase) return;

    showcase.innerHTML = "";

    items.forEach(item => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <div class="image">
          <img src="${item.img}" alt="">
        </div>

        <div class="card-name">
          ${item.name}
        </div>

        <div class="price-link-wrapper">
          <a class="link-display" href="${item.link}" target="_blank">
            ${item.link}
          </a>
        </div>
      `;

      showcase.appendChild(card);
    });
  }

  // ③ 描画
  renderCards();

  // =========================
  // 保存機能
  // =========================
  function saveAppState() {
    const state = {
      items: items
    };

    localStorage.setItem("recomenState", JSON.stringify(state));
    console.log("保存完了");
  }

  const saveBtn = document.getElementById("saveBtn");

  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      saveAppState();
      alert("保存しました");
    });
  }

});