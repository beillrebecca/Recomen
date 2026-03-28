// =========================
// 🔴 アイテムデータ初期化
// =========================
let items = [];  // 空の配列を用意
for (let i = 1; i <= 12; i++) {
  items.push({
    id: i,
    name: 'アイテム' + i,
    img: 'https://via.placeholder.com/300',
    link: '#',
    price: '¥0',
    clicks: 0,
    liked: false,
    saved: false
  });
}

// =========================
// SVG アイコン生成
// =========================
function heartIcon(item) {
  return `<svg class="icon-heart ${item.liked ? 'liked' : ''}" viewBox="0 0 24 24" stroke-width="1.3"
    stroke-linecap="round" stroke-linejoin="round">
    <path d="M20.8 4.6a5 5 0 0 0-7.1 0L12 6.3l-1.7-1.7
      a5 5 0 0 0-7.1 7.1L12 21l8.8-9.3
      a5 5 0 0 0 0-7.1z"/>
  </svg>`;
}

function commentIcon() {
  return `<svg class="icon-comment" viewBox="0 0 24 24" stroke-width="1.3"
    stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7
      a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>
  </svg>`;
}

function shareIcon() {
  return `<svg class="icon-share" viewBox="0 0 24 24" stroke-width="1.3"
    stroke-linecap="round" stroke-linejoin="round">
    <path d="M22 2L11 13"/>
    <path d="M22 2L15 22l-4-9-9-4z"/>
  </svg>`;
}

function saveIcon(item) {
  return `<svg class="icon-save ${item.saved ? 'saved' : ''}" viewBox="0 0 24 24" stroke-width="1.3"
    stroke-linecap="round" stroke-linejoin="round">
    <path d="M19 21l-7-5-7 5V5
      a2 2 0 0 1 2-2h10
      a2 2 0 0 1 2 2z"/>
  </svg>`;
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
      <img src="${item.img}" alt="">
      <span class="modern-clicks">${item.clicks}</span>
    </div>

    <div class="card-name" contenteditable="true">
      ${item.name}
    </div>

    <div class="price-link-wrapper">
      <div class="card-price" contenteditable="true">
        ${item.price}
      </div>

      <a class="link-display" href="${item.link}" target="_blank">
        ${item.link === "#" ? "リンク未設定" : item.link}
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
// DOMContentLoaded 初期化
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const showcaseEl = document.getElementById("showcase");

  // 1️⃣ データ読み込み
  loadAppState();

  // 2️⃣ カードクリックイベント
  if (showcaseEl) setupCardClickEvents(showcaseEl);

  // 3️⃣ ヘッダー・プロフィール画像アップロード
  setupImageUpload(document.getElementById('headerImg'), document.getElementById('headerImgInput'));
  setupImageUpload(document.getElementById('avatarImg'), document.getElementById('avatarImgInput'));

  // 4️⃣ カラーピッカー・アナウンスバー・テーマ切替などを初期化
  setupAnnouncementBar();
  setupThemeSwitch();
  setupColorPickers();

  console.log("アプリ初期化完了");
});

// =========================
// カードクリックイベント
// =========================
function setupCardClickEvents(showcaseEl) {
  showcaseEl.addEventListener("click", e => {
    const card = e.target.closest(".card");
    if (!card) return;
    const index = Array.from(showcaseEl.children).indexOf(card);
    const item = items[index];
    if (!item) return;

    // ❤️ ハート
    const heart = e.target.closest(".icon-heart");
    if (heart) {
      item.liked = !item.liked;
      heart.classList.toggle("liked", item.liked);
      const path = heart.querySelector("path");
      if (path) {
        path.setAttribute("fill", item.liked ? "red" : "none");
        path.setAttribute("stroke", item.liked ? "red" : "#000");
      }
      return;
    }

    // 💾 保存アイコン
    const save = e.target.closest(".icon-save");
    if (save) {
      item.saved = !item.saved;
      save.classList.toggle("saved", item.saved);
      const path = save.querySelector("path");
      if (path) path.setAttribute("fill", item.saved ? "#000" : "none");
      return;
    }

    // 🔗 リンク編集
    const linkEl = e.target.closest(".link-display");
    const editBtn = e.target.closest(".edit-link-btn");
    if (linkEl || editBtn) {
      const target = card.querySelector(".link-display");
      const current = target.getAttribute("href") || "#";
      const newLink = prompt("商品リンクを入力してね", current);
      if (newLink) {
        const finalLink = newLink.startsWith("http") ? newLink : "https://" + newLink;
        target.setAttribute("href", finalLink);
        target.textContent = finalLink;
        item.link = finalLink;
      }
      return;
    }

    // 🖼 画像アップロード
    const imageEl = e.target.closest(".image");
    const input = document.getElementById("itemImgInput");
    if (imageEl && input) {
      input.onchange = event => {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
          item.img = ev.target.result;
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

// =========================
// 画像アップロード補助
// =========================
function setupImageUpload(imgEl, inputEl) {
  if (!imgEl || !inputEl) return;
  imgEl.addEventListener('click', () => inputEl.click());
  inputEl.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => imgEl.src = ev.target.result;
    reader.readAsDataURL(file);
  });
}

// =========================
// アナウンスバー設定
// =========================
function setupAnnouncementBar() {
  const bar = document.getElementById("announcementBar");
  if (!bar) return;

  let pos = 0;
  const speed = 1;
  const scroll = () => {
    pos -= speed;
    bar.scrollLeft = -pos;
    requestAnimationFrame(scroll);
  };
  scroll();
}

// =========================
// テーマ切替
// =========================
function setupThemeSwitch() {
  const btn = document.getElementById("themeSwitchBtn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    document.body.classList.toggle("theme-natural");
    document.body.classList.toggle("theme-modern");
  });
}

// =========================
// カラーピッカー初期化
// =========================
function setupColorPickers() {
  const bgPicker = document.getElementById("bgColorPicker");
  if (bgPicker) bgPicker.addEventListener("input", e => {
    document.body.style.backgroundColor = e.target.value;
  });

  const profilePicker = document.getElementById("profileBgPicker");
  const profileEl = document.querySelector(".profile");
  if (profilePicker && profileEl) profilePicker.addEventListener("input", e => {
    profileEl.style.backgroundColor = e.target.value;
  });

  const fontPicker = document.getElementById("fontColorPicker");
  if (fontPicker) fontPicker.addEventListener("input", e => {
    document.body.style.color = e.target.value;
  });

  const announcementPicker = document.getElementById("announcementColorPicker");
  const bar = document.getElementById("announcementBar");
  if (announcementPicker && bar) announcementPicker.addEventListener("input", e => {
    bar.style.backgroundColor = e.target.value;
  });
}

// =========================
// ローカル保存・読み込み
// =========================
function saveAppState_FULL() {
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
  alert("保存しました！");
  console.log("✅【saveAppState_FULL】保存完了");
}

function loadAppState() {
  const saved = localStorage.getItem("recomenState");
  if (!saved) return;

  try {
    const state = JSON.parse(saved);
    if (state.items) items = state.items;

    if (state.headerImg) document.getElementById("headerImg").src = state.headerImg;
    if (state.avatarImg) document.getElementById("avatarImg").src = state.avatarImg;
    if (state.announcementBg) document.getElementById("announcementBar").style.backgroundColor = state.announcementBg;
    if (state.announcementText) document.querySelector(".banner-text").textContent = state.announcementText;
    if (state.bgColor) document.body.style.backgroundColor = state.bgColor;
    if (state.profileBg) document.querySelector(".profile").style.backgroundColor = state.profileBg;
    if (state.fontColor) document.body.style.color = state.fontColor;
    if (state.fontFamily) document.documentElement.style.setProperty('--font-family', state.fontFamily);
    if (state.theme) {
      document.body.classList.remove('theme-natural', 'theme-modern');
      document.body.classList.add(`theme-${state.theme}`);
    }
    if (state.profileName) document.getElementById("profileName").textContent = state.profileName;
    if (state.profileBio) document.getElementById("profileBio").textContent = state.profileBio;

    renderCards();
    console.log("保存データ読み込み完了");
  } catch (e) {
    console.error("保存データ読み込み失敗:", e);
  }
}

// =========================
// フォロー / フォロワーモーダル制御
// =========================
function setupFollowModal() {
  const modal = document.getElementById("followModal");
  const openBtns = document.querySelectorAll(".open-follow-modal");
  const closeBtn = modal?.querySelector(".close-modal");

  openBtns.forEach(btn => btn.addEventListener("click", () => {
    modal.style.display = "block";
  }));

  if (closeBtn) closeBtn.addEventListener("click", () => modal.style.display = "none");

  window.addEventListener("click", e => {
    if (e.target === modal) modal.style.display = "none";
  });
}

// =========================
// 初期化関数
// =========================
function initApp() {
  const showcaseEl = document.getElementById("showcase");

  loadAppState();
  if (showcaseEl) setupCardClickEvents(showcaseEl);

  setupImageUpload(document.getElementById('headerImg'), document.getElementById('headerImgInput'));
  setupImageUpload(document.getElementById('avatarImg'), document.getElementById('avatarImgInput'));

  setupAnnouncementBar();
  setupThemeSwitch();
  setupColorPickers();
  setupFollowModal();

  console.log("✅ アプリ初期化完了");
}

document.addEventListener("DOMContentLoaded", initApp);

