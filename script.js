// =========================
// 🔴 データ本体（超重要）
// =========================
if (!items || items.length === 0) {
  items = [];
  for (let i = 1; i <= 12; i++) {
    items.push({
      id: i,
      name: `アイテム${i}`,
      price: `¥${i * 1000}`,
      img: "https://via.placeholder.com/300",
      link: "#",
      clicks: 0,
      liked: false,
      saved: false
    });
  }
}

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

function renderCards() {
  const showcase = document.getElementById("showcase");
  if (!showcase) return;

  showcase.innerHTML = ""; // クリア
  items.forEach(item => {
    const card = createCard(item);
    showcase.appendChild(card); // ← 必ず append
  });
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
    showcase.appendChild(card); // ←ここで DOM に追加
  });
}

// =========================
// ローカル保存 読み込み（初期化付き）
// =========================
function loadAppState() {
  const saved = localStorage.getItem("recomenState");

  if (saved) {
    try {
      const state = JSON.parse(saved);

      // ヘッダー画像
      const header = document.getElementById("headerImg");
      if (header && state.headerImg) header.src = state.headerImg;

      // プロフィール画像
      const avatar = document.getElementById("avatarImg");
      if (avatar && state.avatarImg) avatar.src = state.avatarImg;

      // アナウンスバー背景色
      const bar = document.getElementById("announcementBar");
      if (bar && state.announcementBg) bar.style.backgroundColor = state.announcementBg;

      // アナウンスバー文字
      const bannerText = document.querySelector(".banner-text");
      if (bannerText && state.announcementText) bannerText.textContent = state.announcementText;

      // 背景カラー
      if (state.bgColor) document.body.style.backgroundColor = state.bgColor;

      // プロフィール背景
      const profileEl = document.querySelector('.profile');
      if (profileEl && state.profileBg) profileEl.style.backgroundColor = state.profileBg;

      // フォントカラー
      if (state.fontColor) document.body.style.color = state.fontColor;

      // テーマ
      if (state.theme) {
        document.body.classList.remove('theme-natural', 'theme-modern');
        document.body.classList.add(`theme-${state.theme}`);
      }

      // フォント
      if (state.fontFamily) {
        document.documentElement.style.setProperty('--font-family', state.fontFamily);
      }

      // プロフィール名前
      const profileNameEl = document.getElementById("profileName");
      if (profileNameEl && state.profileName) profileNameEl.textContent = state.profileName;

      // プロフィール紹介
      const profileBioEl = document.getElementById("profileBio");
      if (profileBioEl && state.profileBio) profileBioEl.textContent = state.profileBio;

      // アイテム配列
      if (state.items && Array.isArray(state.items) && state.items.length > 0) {
        items = state.items;
      }

      console.log("保存データ読み込み完了");
    } catch (e) {
      console.error("保存データ読み込み失敗:", e);
    }
  }

  // 保存データが無い、またはアイテムが空なら初期12個作成
  if (!items || items.length === 0) {
    items = [];
    for (let i = 1; i <= 12; i++) {
      items.push({
        id: i,
        name: `アイテム${i}`,
        price: `¥${i * 1000}`,
        img: "https://via.placeholder.com/300",
        liked: false,
        saved: false,
        clicks: 0,
        link: "#"
      });
    }
    console.log("初期12アイテムを生成");
  }

  renderCards(); // カード描画
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
    
    // ←ここを追加
    alert("保存しました！");
    console.log("✅【saveAppState_FULL】保存完了");

  } catch (e) {
    console.error("❌【saveAppState_FULL】保存失敗:", e);
    alert("保存に失敗しました！");
  }
}

// =========================
// カードクリックイベント設定（ハート・保存・リンク・画像）
// =========================
function setupCardClickEvents(showcaseEl) {
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

// ===============================
// 🔴 ポップアップ・カスタムバー・テーマ切替・アナウンスバー
// ===============================

// ポップアップマップ
const popupMap = {
  themeButton: 'themePopup',
  styleButton: 'stylePopup',
  announcementButton: 'announcementPopup'
};

// 全ポップアップを閉じる
function closeAllPopups() {
  Object.values(popupMap).forEach(popupId => {
    const popup = document.getElementById(popupId);
    if (popup) {
      popup.classList.remove('active');
      popup.style.display = 'none';
    }
  });
}

// ボタンの真下中央に表示
function positionPopup(btn, popup) {
  if (!btn || !popup) return;

  popup.style.display = "block";
  popup.style.visibility = "hidden";

  const rect = btn.getBoundingClientRect();
  const popupWidth = popup.offsetWidth;
  const popupHeight = popup.offsetHeight;

  let left = rect.left;
  let top = rect.bottom + 2;

  left = Math.max(8, Math.min(left, window.innerWidth - popupWidth - 8));
  top = Math.min(top, window.innerHeight - popupHeight - 8);

  popup.style.position = "fixed";
  popup.style.left = left + "px";
  popup.style.top = top + "px";

  popup.style.visibility = "visible";
}

// DOMContentLoaded 後に実行
document.addEventListener("DOMContentLoaded", () => {
  // 全体クリックでポップアップを閉じる
  document.addEventListener('click', (e) => {
    const isButton = Object.keys(popupMap).some(id => {
      const el = document.getElementById(id);
      return el && el.contains(e.target);
    });
    const isPopup = Object.values(popupMap).some(id => {
      const el = document.getElementById(id);
      return el && el.contains(e.target);
    });

    if (!isButton && !isPopup) closeAllPopups();
  });

  // ポップアップボタン設定
  Object.entries(popupMap).forEach(([btnId, popupId]) => {
    const btn = document.getElementById(btnId);
    const popup = document.getElementById(popupId);
    if (!btn || !popup) return;

    btn.addEventListener('click', e => {
      e.stopPropagation();
      closeAllPopups();
      popup.classList.add('active');
      positionPopup(btn, popup);
    });

    popup.addEventListener('click', e => e.stopPropagation());
  });

  // =========================
  // テーマ切替（カード画像保持）
  // =========================
  const showcaseEl = document.getElementById("showcase");
  document.querySelectorAll('input[name="theme"]').forEach(radio => {
    radio.addEventListener('change', e => {
      if (!showcaseEl) return;
      const existingImages = Array.from(showcaseEl.querySelectorAll('.card img')).map(img => img.src);
      document.body.classList.toggle('theme-natural', e.target.value === 'natural');
      document.body.classList.toggle('theme-modern', e.target.value !== 'natural');
      showcaseEl.querySelectorAll('.card img').forEach((img, i) => {
        if (existingImages[i]) img.src = existingImages[i];
      });
    });
  });

  // =========================
  // カスタムカラー・ピッカー設定
  // =========================
  function createPicker(inputId, callback) {
    const picker = document.getElementById(inputId);
    if (!picker) return;
    picker.addEventListener('input', e => callback(e.target.value));
  }

  createPicker('fontColorPicker', color => document.documentElement.style.setProperty('--font-color', color));
  createPicker('bgPicker', color => document.documentElement.style.setProperty('--showcase-bg', color));
  createPicker('profileBgPicker', color => document.documentElement.style.setProperty('--profile-bg', color));
  createPicker('announcementBgPicker', color => {
    const bar = document.getElementById('announcementBar');
    if (bar) bar.style.background = color;
  });

  // フォント変更
  const fontSelect = document.getElementById('fontSelect');
  if (fontSelect) fontSelect.addEventListener('change', e => {
    document.documentElement.style.setProperty('--font-family', e.target.value);
  });
  
  /* ===============================
     Picker 関数
  =============================== */
  function createPicker(id, onSave) {
    const el = document.getElementById(id);
    if (!el) return null;

    const popup = el.closest('.popup');
    let wasHidden = false;
    if (popup && getComputedStyle(popup).display === 'none') {
      popup.style.display = 'block';
      wasHidden = true;
    }

    const picker = Pickr.create({
      el: `#${id}`,
      theme: 'nano',
      default: '#f6f6f6',
      components: {
        preview: true,
        hue: true,
        interaction: { hex: true, input: true, save: true }
      }
    });

    picker.on('save', color => {
      const hex = color.toHEXA().toString();
      onSave(hex);
      picker.hide();
    });

    picker.on('init', instance => {
      if (!instance || !instance.root) return;
      const btn = instance.root.querySelector('.pcr-button');
      if (btn) {
        btn.style.width = '24px';
        btn.style.height = '24px';
        btn.style.borderRadius = '6px';
      }
    });

    if (wasHidden && popup) popup.style.display = 'none';
    return picker;
  }

  /* ===============================
     Picker生成
  =============================== */

  createPicker('fontColorPicker', (color) => {
    document.documentElement.style.setProperty('--font-color', color);
  });

  createPicker('bgPicker', (color) => {
    document.documentElement.style.setProperty('--showcase-bg', color);
  });

  createPicker('profileBgPicker', (color) => {
    document.documentElement.style.setProperty('--profile-bg', color);
  });

  createPicker('announcementBgPicker', (color) => {
    const bar = document.getElementById('announcementBar');
    if (bar) bar.style.background = color;
  });

  /* ===============================
     フォローモーダル
  =============================== */

  const followingBtn = document.getElementById('followingBtn');
  const followersBtn = document.getElementById('followersBtn');
  const modal = document.getElementById('followModal');

  if (modal) {

    const modalTitle = modal.querySelector('.modal-title');
    const userList = modal.querySelector('.user-list');
    const closeBtn = modal.querySelector('.close-btn');

    const following = [
      { name: 'ユーザーA', img: 'https://via.placeholder.com/32' },
      { name: 'ユーザーB', img: 'https://via.placeholder.com/32' }
    ];

    const followers = [
      { name: 'ユーザーC', img: 'https://via.placeholder.com/32' },
      { name: 'ユーザーD', img: 'https://via.placeholder.com/32' }
    ];

    function showModal(type) {
      userList.innerHTML = '';
      const list = type === 'following' ? following : followers;

      modalTitle.textContent =
        type === 'following' ? 'フォロー中' : 'フォロワー';

      list.forEach(user => {
        const li = document.createElement('li');
        li.innerHTML = `
          <img src="${user.img}" alt="${user.name}">
          <span>${user.name}</span>
        `;
        userList.appendChild(li);
      });

      modal.style.display = 'block';
    }

    followingBtn?.addEventListener('click', () => showModal('following'));
    followersBtn?.addEventListener('click', () => showModal('followers'));
    closeBtn?.addEventListener('click', () => modal.style.display = 'none');
  }

  // ===============================
// ヘッダー・プロフィール画像
// ===============================
setupImageUpload(
  document.getElementById('headerImg'),
  document.getElementById('headerImgInput')
);

setupImageUpload(
  document.getElementById('avatarImg'),
  document.getElementById('avatarImgInput')
);

  // =========================
  // カスタムバー開閉
  // =========================
  const editToggle = document.getElementById('editToggle');
  const editItems = document.getElementById('editItems');
  if (editToggle && editItems) {
    editItems.classList.remove('active');
    editToggle.addEventListener('click', e => {
      e.stopPropagation();
      closeAllPopups();
      editItems.classList.toggle('active');
    });
  }

  // =========================
// アナウンスバー（スクロール）
// =========================
const announcementBar = document.getElementById('announcementBar');
const bannerText = announcementBar?.querySelector('.banner-text');
const bannerTextInput = document.getElementById('bannerTextInput');

if (announcementBar && bannerText && bannerTextInput) {
  let scrollInitialized = false;
  let pos = announcementBar.offsetWidth; // 文字の初期位置
  const speed = 1; // スクロール速度（px/frame）

  function scroll() {
    const textWidth = bannerText.offsetWidth;
    if (!textWidth) {
      if (!scrollInitialized) {
        scrollInitialized = true;
        setTimeout(scroll, 100); // 少し待つ
      }
      return;
    }
    pos -= speed;
    if (pos <= -textWidth) pos = announcementBar.offsetWidth;
    bannerText.style.left = pos + 'px';
    requestAnimationFrame(scroll);
  }

  setTimeout(scroll, 100);

  bannerTextInput.addEventListener('input', () => {
    bannerText.textContent = bannerTextInput.value;
    pos = announcementBar.offsetWidth;
  });

  window.addEventListener('resize', () => pos = announcementBar.offsetWidth);
}


  // =========================
  // カードクリックイベント呼び出し
  // =========================
  if (showcaseEl) setupCardClickEvents(showcaseEl);

  // =========================
  // データ読み込み
  // =========================
  if (showcaseEl) loadAppState();
});