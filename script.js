console.log("Recomen JS 起動");

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM読み込みOK");

  const showcase = document.getElementById("showcase");
  console.log("showcase:", showcase);

  // =========================
  // データ
  // =========================
  let items = [];

  /* =========================
   ローカル保存 読み込み
========================= */
function loadAppState() {
  const saved = localStorage.getItem("recomenState");

  if (saved) {
    const state = JSON.parse(saved);

    if (state.headerImg) {
      const header = document.getElementById("headerImg");
      if (header) header.src = state.headerImg;
    }

    if (state.avatarImg) {
      const avatar = document.getElementById("avatarImg");
      if (avatar) avatar.src = state.avatarImg;
    }

    if (state.announcementBg) {
      const bar = document.getElementById("announcementBar");
      if (bar) bar.style.background = state.announcementBg;
    }

    if (state.announcementText) {
      const text = document.querySelector(".banner-text");
      if (text) text.textContent = state.announcementText;
    }

    if (state.items && Array.isArray(state.items)) {
      items = state.items;
    }
  }
  

  console.log("保存データ読み込み完了");
}

/* =========================
   SVG アイコン
========================= */

function heartIcon() {
  return `
    <svg class="icon-heart" viewBox="0 0 24 24" stroke-width="1.3"
      stroke-linecap="round" stroke-linejoin="round">
      <path d="M20.8 4.6a5 5 0 0 0-7.1 0L12 6.3l-1.7-1.7
        a5 5 0 0 0-7.1 7.1L12 21l8.8-9.3
        a5 5 0 0 0 0-7.1z"/>
    </svg>
  `;
}

function commentIcon() {
  return `
    <svg class="icon-comment" viewBox="0 0 24 24"
      stroke-width="1.3" stroke-linecap="round"
      stroke-linejoin="round">
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7
        a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>
    </svg>
  `;
}

function shareIcon() {
  return `
    <svg class="icon-share" viewBox="0 0 24 24"
      stroke-width="1.3" stroke-linecap="round"
      stroke-linejoin="round">
      <path d="M22 2L11 13"/>
      <path d="M22 2L15 22l-4-9-9-4z"/>
    </svg>
  `;
}

function saveIcon() {
  return `
    <svg class="icon-save" viewBox="0 0 24 24"
      stroke-width="1.3" stroke-linecap="round"
      stroke-linejoin="round">
      <path d="M19 21l-7-5-7 5V5
        a2 2 0 0 1 2-2h10
        a2 2 0 0 1 2 2z"/>
    </svg>
  `;
}

/* =========================
   カード作成（テーマ別生成）
========================= */
function createCard(item, theme) {
  const card = document.createElement('div');
  card.className = 'card';

  card.innerHTML = `
    <div class="image">
      <img src="${item.img}" alt="">
      <span class="modern-clicks">${item.clicks || 0}</span>
    </div>

    <div class="card-name" contenteditable="true">
      ${item.name}
    </div>

    <div class="price-link-wrapper">
      <div class="card-price" contenteditable="true">
        ${item.price || '¥0'}
      </div>

      <a class="link-display"
         href="${item.link}"
         target="_blank">
         ${item.link}
      </a>
    </div>

    <div class="card-actions">
      ${heartIcon()}
      ${commentIcon()}
      ${shareIcon()}
      ${saveIcon()}
    </div>

    <button class="edit-link-btn" style="display:none;">
      編集
    </button>
  `;

  return card;
}

  // =========================
  // カード描画
  // =========================
  function renderCards() {
  if (!showcase) return;

  showcase.innerHTML = "";

  items.forEach(item => {
    const card = createCard(item);
    showcase.appendChild(card);
  });
}


loadAppState();

// 保存データが無いときだけ初期データ作成
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

renderCards();

// =========================
// 編集されたら items を更新
// =========================
if (showcase) {
  showcase.addEventListener('input', (e) => {

    const card = e.target.closest('.card');
    if (!card) return;

    const index = Array.from(showcase.children).indexOf(card);
    if (index < 0) return;

    // 名前（モダン対応）
    if (e.target.classList.contains('card-name') ||
        e.target.classList.contains('modern-name')) {
      items[index].name = e.target.innerText.trim();
    }

    // 値段
    if (e.target.classList.contains('card-price')) {
      items[index].price = e.target.innerText.trim();
    }

    // リンク
    if (e.target.classList.contains('link-display')) {
      const newLink = e.target.innerText.trim();
      items[index].link = newLink;
      e.target.href = newLink;
    }

    saveAppState();
  });
}

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