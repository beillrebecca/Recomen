

// =========================
// 🔴 データ本体（超重要）
// =========================
let items = [];

// =========================
// SVG アイコン生成（状態反映版）
// =========================
function heartIcon(item) {
  return `
    <svg class="icon-heart ${item.liked ? 'liked' : ''}" viewBox="0 0 24 24" stroke-width="1.3"
      stroke-linecap="round" stroke-linejoin="round">
      <path d="M20.8 4.6a5 5 0 0 0-7.1 0L12 6.3l-1.7-1.7
        a5 5 0 0 0-7.1 7.1L12 21l8.8-9.3
        a5 5 0 0 0 0-7.1z"/>
    </svg>
  `;
}

function commentIcon() {
  return `
    <svg class="icon-comment" viewBox="0 0 24 24" stroke-width="1.3"
      stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7
        a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>
    </svg>
  `;
}

function shareIcon() {
  return `
    <svg class="icon-share" viewBox="0 0 24 24" stroke-width="1.3"
      stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 2L11 13"/>
      <path d="M22 2L15 22l-4-9-9-4z"/>
    </svg>
  `;
}

function saveIcon(item) {
  return `
    <svg class="icon-save ${item.saved ? 'saved' : ''}" viewBox="0 0 24 24" stroke-width="1.3"
      stroke-linecap="round" stroke-linejoin="round">
      <path d="M19 21l-7-5-7 5V5
        a2 2 0 0 1 2-2h10
        a2 2 0 0 1 2 2z"/>
    </svg>
  `;
}

// =========================
// カード作成
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
// カード描画
// =========================
function renderCards() {
  const showcase = document.getElementById("showcase");
  if (!showcase) return;

  showcase.innerHTML = "";
  items.forEach(item => {
    const card = createCard(item);
    showcase.appendChild(card);
  });
}



// =========================
// 保存データ読み込み
// =========================
function loadAppState() {
  let loadedItems = [];
  try {
    const saved = localStorage.getItem("recomenState");
    if (saved) {
      const state = JSON.parse(saved);

      if (Array.isArray(state.items) && state.items.length > 0) {
        loadedItems = state.items;
        console.log("保存データ読み込み成功: アイテム数", loadedItems.length);
      } else {
        console.log("保存データに items がありません");
      }

      // ヘッダー・アバター
      const headerImg = document.getElementById('headerImg');
      if (headerImg) headerImg.src = state.headerImg || '';
      const avatarImg = document.getElementById('avatarImg');
      if (avatarImg) avatarImg.src = state.avatarImg || '';
    } else {
      console.log("保存データなし → 初期アイテムを使用");
    }
  } catch (e) {
    console.error("保存データ読み込み失敗:", e);
  }

  if (!loadedItems || loadedItems.length === 0) {
    loadedItems = [
      {id:1,name:'初期アイテムA',price:'¥1000',link:'#',img:'',liked:false,saved:false,clicks:0},
      {id:2,name:'初期アイテムB',price:'¥2000',link:'#',img:'',liked:false,saved:false,clicks:0},
    ];
  }

  items = loadedItems;
  renderCards();
}

// =========================
// 保存（アプリ全体）
// =========================
function saveAppState_FULL() {
  try {
    const savedItems = items.map(item => ({
      ...item,
      img: document.querySelector(`#card-${item.id} img`)?.src || item.img
    }));

    const state = {
      items: savedItems,
      headerImg: document.getElementById('headerImg')?.src || null,
      avatarImg: document.getElementById('avatarImg')?.src || null,
      announcementBg: document.getElementById('announcementBar')?.style.backgroundColor || null,
      announcementText: document.querySelector('.banner-text')?.textContent || "",
      bgColor: document.body.style.backgroundColor || null,
      profileBg: document.querySelector('.profile')?.style.backgroundColor || null,
      fontColor: document.body.style.color || null,
      theme: document.body.classList.contains('theme-natural') ? 'natural' : 'modern',
      fontFamily: getComputedStyle(document.documentElement).getPropertyValue('--font-family') || null,
      profileName: document.getElementById("profileName")?.textContent || "",
      profileBio: document.getElementById("profileBio")?.textContent || ""
    };

    localStorage.setItem("recomenState", JSON.stringify(state));
    console.log("✅【saveAppState_FULL】保存完了");
  } catch (e) {
    console.error("❌【saveAppState_FULL】保存失敗:", e);
  }
}

// ===============================
// ページ読み込み後 初期化（保存ボタン登録＋データ読み込み＋クリックイベント）
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  console.log("JS読み込まれた"); // 最初に確認

  const saveBtn = document.getElementById("saveBtn");
  if (saveBtn) saveBtn.addEventListener("click", saveAppState_FULL);

  const showcaseEl = document.getElementById("showcase");
  if (showcaseEl) loadAppState();

  if (!showcaseEl) console.warn("#showcase が存在しません");

  if (showcaseEl) {
    showcaseEl.addEventListener("click", (e) => {
      const card = e.target.closest(".card");
      if (!card) return;
      const index = Array.from(showcaseEl.children).indexOf(card);

      // ❤️ ハート
      const heart = e.target.closest(".icon-heart");
      if (heart && items[index]) {
        items[index].liked = !items[index].liked;
        heart.classList.toggle("liked", items[index].liked);
        const path = heart.querySelector("path");
        if (path) {
          path.setAttribute("fill", items[index].liked ? "red" : "none");
          path.setAttribute("stroke", items[index].liked ? "red" : "#000");
        }
        return;
      }

      // 💾 保存アイコン
      const save = e.target.closest(".icon-save");
      if (save && items[index]) {
        items[index].saved = !items[index].saved;
        save.classList.toggle("saved", items[index].saved);
        const path = save.querySelector("path");
        if (path) path.setAttribute("fill", items[index].saved ? "#000" : "none");
        return;
      }

      // 🔗 リンク編集
      const linkEl = e.target.closest(".link-display");
      const editBtn = e.target.closest(".edit-link-btn");
      if ((linkEl || editBtn) && items[index]) {
        const target = card.querySelector(".link-display");
        const current = target.getAttribute("href") || "";
        const newLink = prompt("商品リンクを入力してね", current);
        if (newLink) {
          const finalLink = newLink.startsWith("http") ? newLink : "https://" + newLink;
          target.setAttribute("href", finalLink);
          target.textContent = finalLink;
          items[index].link = finalLink;
        }
        return;
      }

      // 🖼 画像アップロード
      const imageEl = e.target.closest(".image");
      const input = document.getElementById("itemImgInput");
      if (imageEl && input && items[index]) {
        input.onchange = (event) => {
          const file = event.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (ev) => {
            items[index].img = ev.target.result;
            const imgTag = imageEl.querySelector("img");
            if (imgTag) imgTag.src = ev.target.result;
          };
          reader.readAsDataURL(file);
          input.value = "";
        };
        input.click();
      }
    });
  }
});