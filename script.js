// =========================
// 🔴 アイテムデータ初期化
// =========================
let items = [];  // 空の配列を用意
for (let i = 1; i <= 12; i++) {
  items.push({
    id: i,
    name: 'アイテム' + i,
    img: 'https://via.placeholder.com/300', // 仮の画像
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
// ローカル保存・読み込み
// =========================
function loadAppState() {
  const saved = localStorage.getItem("recomenState");
  if (saved) {
    try {
      const state = JSON.parse(saved);

      // 画像
      const header = document.getElementById("headerImg");
      if (header && state.headerImg) header.src = state.headerImg;
      const avatar = document.getElementById("avatarImg");
      if (avatar && state.avatarImg) avatar.src = state.avatarImg;

      // アナウンスバー
      const bar = document.getElementById("announcementBar");
      if (bar && state.announcementBg) bar.style.backgroundColor = state.announcementBg;
      const bannerText = document.querySelector(".banner-text");
      if (bannerText && state.announcementText) bannerText.textContent = state.announcementText;

      // 背景・プロフィール・フォント
      if (state.bgColor) document.body.style.backgroundColor = state.bgColor;
      const profileEl = document.querySelector('.profile');
      if (profileEl && state.profileBg) profileEl.style.backgroundColor = state.profileBg;
      if (state.fontColor) document.body.style.color = state.fontColor;

      // テーマ
      if (state.theme) {
        document.body.classList.remove('theme-natural', 'theme-modern');
        document.body.classList.add(`theme-${state.theme}`);
      }

      // フォント
      if (state.fontFamily) document.documentElement.style.setProperty('--font-family', state.fontFamily);

      // プロフィール情報
      const profileNameEl = document.getElementById("profileName");
      if (profileNameEl && state.profileName) profileNameEl.textContent = state.profileName;
      const profileBioEl = document.getElementById("profileBio");
      if (profileBioEl && state.profileBio) profileBioEl.textContent = state.profileBio;

      // アイテム
      if (state.items && Array.isArray(state.items) && state.items.length > 0) {
        items = state.items;
      }

      console.log("保存データ読み込み完了");
    } catch (e) {
      console.error("保存データ読み込み失敗:", e);
    }
  }

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
    alert("保存しました！");
    console.log("✅【saveAppState_FULL】保存完了");
  } catch (e) {
    console.error("❌【saveAppState_FULL】保存失敗:", e);
    alert("保存に失敗しました！");
  }
}

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

    // 💾 保存
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
      const current = target.getAttribute("href") || "";
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
// アナウンスバー スライド
// =========================
function setupAnnouncementBar() {
  const bar = document.getElementById("announcementBar");
  if (!bar) return;
  const text = bar.querySelector(".banner-text");
  if (!text) return;

  let pos = bar.offsetWidth;
  function slide() {
    pos -= 1;
    if (pos < -text.offsetWidth) pos = bar.offsetWidth;
    text.style.transform = `translateX(${pos}px)`;
    requestAnimationFrame(slide);
  }
  slide();
}

// =========================
// DOMContentLoaded で初期化
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const showcaseEl = document.getElementById("showcase");

  // データ読み込み
  loadAppState();

  // カードクリックイベント
  if (showcaseEl) setupCardClickEvents(showcaseEl);

  // 画像アップロード
  setupImageUpload(document.getElementById('headerImg'), document.getElementById('headerImgInput'));
  setupImageUpload(document.getElementById('avatarImg'), document.getElementById('avatarImgInput'));

  // アナウンスバー
  setupAnnouncementBar();

  console.log("アプリ初期化完了");
});
