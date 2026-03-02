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


  /* =========================
   ショーケースクリック処理
   （名前編集＆画像アップロード両立）
========================= */

const itemImgInput = document.getElementById("itemImgInput");

if (showcase) {
  showcase.addEventListener("click", e => {

    // --- ハートアイコン ---
    const heart = e.target.closest(".icon-heart");
    if (heart) {
      heart.classList.toggle("liked");

      const path = heart.querySelector("path");
      const isLiked = heart.classList.contains("liked");

      if (path) {
        path.setAttribute("fill", isLiked ? "red" : "none");
        path.setAttribute("stroke", isLiked ? "red" : "#000");
      }

      heart.classList.remove("pop");
      void heart.offsetWidth;
      heart.classList.add("pop");

      return;
    }

    // --- 保存アイコン ---
    const save = e.target.closest(".icon-save");
    if (save) {
      save.classList.toggle("saved");

      const path = save.querySelector("path");
      const isSaved = save.classList.contains("saved");

      if (path) {
        path.setAttribute("fill", isSaved ? "#000" : "none");
        path.setAttribute("stroke", "#000");
      }

      save.classList.remove("pop");
      void save.offsetWidth;
      save.classList.add("pop");

      return;
    }

    // --- 編集ボタン ---
    const editBtn = e.target.closest(".edit-link-btn");
    if (editBtn) {
      e.stopPropagation();

      const card = editBtn.closest(".card");
      const linkEl = card?.querySelector(".link-display");
      if (!linkEl) return;

      const currentLink = linkEl.getAttribute("href");
      const newLink = prompt("商品リンクを入力してください", currentLink);

      if (newLink) {
        linkEl.setAttribute("href", newLink);
        linkEl.textContent = newLink;

        const index = Array.from(showcase.children).indexOf(card);
        if (index >= 0) items[index].link = newLink;
      }

      return;
    }

    // --- 名前編集はここでは何もしない ---
    const nameEl = e.target.closest(".card-name, .modern-name");
    if (nameEl) return;

    // --- 画像クリック（名前以外） ---
    const imageEl = e.target.closest(".image");
    if (!imageEl) return;

    const cardEl = imageEl.closest(".card");
    const imgEl = imageEl.querySelector("img");
    if (!imgEl || !itemImgInput) return;

    itemImgInput.onchange = (event) => {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();

      reader.onload = (ev) => {
        imgEl.src = ev.target.result;

        const index = Array.from(showcase.children).indexOf(cardEl);
        if (index >= 0) {
          items[index].img = ev.target.result;
        }
      };

      reader.readAsDataURL(file);
      itemImgInput.value = "";
    };

    itemImgInput.click();
  });
}

});