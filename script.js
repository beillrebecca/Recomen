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
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <div class="image">
      <img src="${item.img || 'https://dummyimage.com/300x300/eeeeee/999999&text=📷'}" alt="">
      <span class="modern-clicks">${item.clicks || 0}</span>
    </div>

    <div class="card-name" contenteditable="true">
      ${item.name || "アイテム名"}
    </div>

    <div class="price-link-wrapper">
      <div class="card-price">${item.price || "¥0"}</div>
      <input 
        class="card-link-input"
        type="text"
        value="${item.link || ''}"
        placeholder="商品リンクを入力">
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
// ショーケース描画（追加ボタン込み）
// =========================
function renderShowcaseWithAddButton() {
  const showcase = document.getElementById("showcase");
  if (!showcase) return;

  showcase.innerHTML = "";

  items.forEach(item => {
    showcase.appendChild(createCard(item));
  });

  // 最後に追加ボタンを入れる
  showcase.innerHTML += `
    <div class="showcase-add-card-wrapper">
      <button id="addCardBtn" class="showcase-add-card-btn">
        ＋ 新しいアイテムを追加
      </button>
    </div>
  `;
}

// =========================
// 保存データ読み込み
// =========================
function loadAppState() {
  const saved = localStorage.getItem("recomenState");

  if (saved) {
    const state = JSON.parse(saved);
    items = state.items || [];
  } else {
    items = [
      {
        id: 1,
        name: "アイテム1",
        price: "¥0",
        link: "",
        img: "",
        liked: false,
        saved: false,
        clicks: 0
      }
    ];
  }

  renderShowcaseWithAddButton();
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

// =========================
// カードクリック操作
// =========================
function initCardClicks() {
  const showcaseEl = document.getElementById("showcase");
  if (!showcaseEl) return;

  const itemImgInput = document.getElementById("itemImgInput");
  if (itemImgInput && !itemImgInput.dataset.init) {
    itemImgInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const imgTag = document.querySelector(`.card.editing img`);
        if (imgTag) imgTag.src = ev.target.result;
      };
      reader.readAsDataURL(file);
      itemImgInput.value = "";
    });
    itemImgInput.dataset.init = 'true';
  }

  showcaseEl.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (!card) return;
    const index = Array.from(showcaseEl.children).indexOf(card);
    if (!items[index]) return;

    // ❤️ ハート
    const heart = e.target.closest(".icon-heart");
    if (heart) {
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
    if (save) {
      items[index].saved = !items[index].saved;
      save.classList.toggle("saved", items[index].saved);
      const path = save.querySelector("path");
      if (path) path.setAttribute("fill", items[index].saved ? "#000" : "none");
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
        items[index].link = finalLink;
      }
      return;
    }

    // 🖼 画像アップロード
    const imageEl = e.target.closest(".image");
    if (imageEl && itemImgInput) {
      card.classList.add('editing');
      itemImgInput.click();
      card.classList.remove('editing');
    }
  });
}

// =========================
// 共通画像アップロード
// =========================
function setupImageUpload(imgEl, inputEl) {
  if (!imgEl || !inputEl) return;
  imgEl.addEventListener('click', () => inputEl.click());
  inputEl.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => imgEl.src = ev.target.result;
    reader.readAsDataURL(file);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("JS読み込まれた");

  // =========================
  // 保存ボタン
  // =========================
  const saveBtn = document.getElementById("saveBtn");
  if (saveBtn) saveBtn.addEventListener("click", saveAppState_FULL);

  // =========================
  // データ読み込み
  // =========================
  loadAppState();

  // =========================
  // カードクリック操作
  // =========================
  initCardClicks();

  // =========================
  // カスタムバー + 編集項目表示
  // =========================
  const editToggle = document.getElementById('editToggle');
const editItems = document.getElementById('editItems');

if (editToggle && editItems) {

  editToggle.addEventListener('click', (e) => {
    e.stopPropagation();  // 編集ボタンクリックだけで閉じないように
    editItems.classList.toggle('active'); // activeクラスを付け外し
  });

  // 画面クリックで閉じる
  document.addEventListener('click', (e) => {
    if (!editItems.contains(e.target) && e.target !== editToggle) {
      editItems.classList.remove('active'); // activeを削除して閉じる
    }
  });
}

  // =========================
  // 編集項目ボタンのポップアップ管理
  // =========================
  const popupMap = {
    themeButton: 'themePopup',
    styleButton: 'stylePopup',
    announcementButton: 'announcementPopup'
  };

  Object.entries(popupMap).forEach(([btnId, popupId]) => {
    const btn = document.getElementById(btnId);
    const popup = document.getElementById(popupId);
    if (!btn || !popup) return;

    popup.style.display = 'none'; // 初期非表示

    btn.addEventListener('click', e => {
      e.stopPropagation();
      // 他のポップアップ閉じる
      Object.values(popupMap).forEach(pid => {
        const p = document.getElementById(pid);
        if (p && p !== popup) p.style.display = 'none';
      });
      // 自分のトグル
      popup.style.display = (popup.style.display === 'block') ? 'none' : 'block';
    });

    popup.addEventListener('click', e => e.stopPropagation());
  });

  // 画面クリックで全ポップアップ閉じる
  document.addEventListener('click', () => {
    Object.values(popupMap).forEach(pid => {
      const p = document.getElementById(pid);
      if (p) p.style.display = 'none';
    });
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
  // カスタムカラー・ピッカー
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

  // =========================
  // アナウンスバー（スクロール）
  // =========================
  const announcementBar = document.getElementById('announcementBar');
  const bannerText = announcementBar?.querySelector('.banner-text');
  const bannerTextInput = document.getElementById('bannerTextInput');

  if (announcementBar && bannerText && bannerTextInput) {
    let pos = announcementBar.offsetWidth;
    const speed = 1;

    function scroll() {
      const textWidth = bannerText.offsetWidth;
      pos -= speed;
      if (pos <= -textWidth) pos = announcementBar.offsetWidth;
      bannerText.style.left = pos + 'px';
      requestAnimationFrame(scroll);
    }
    scroll();

    bannerTextInput.addEventListener('input', () => {
      bannerText.textContent = bannerTextInput.value;
      pos = announcementBar.offsetWidth;
    });

    window.addEventListener('resize', () => pos = announcementBar.offsetWidth);
  }

  // =========================
  // フォローモーダル
  // =========================
  const modal = document.getElementById('followModal');
  const followingBtn = document.getElementById('followingBtn');
  const followersBtn = document.getElementById('followersBtn');

  if (modal) {
    const modalTitle = modal.querySelector('.modal-title');
    const userList = modal.querySelector('.user-list');
    const closeBtn = modal.querySelector('.close-btn');

    const following = [{name:'ユーザーA',img:'https://via.placeholder.com/32'}, {name:'ユーザーB',img:'https://via.placeholder.com/32'}];
    const followers = [{name:'ユーザーC',img:'https://via.placeholder.com/32'}, {name:'ユーザーD',img:'https://via.placeholder.com/32'}];

    function showModal(type){
      userList.innerHTML = '';
      const list = type==='following'?following:followers;
      modalTitle.textContent = type==='following'?'フォロー中':'フォロワー';
      list.forEach(user=>{
        const li = document.createElement('li');
        li.innerHTML = `<img src="${user.img}" alt="${user.name}"><span>${user.name}</span>`;
        userList.appendChild(li);
      });
      modal.style.display = 'block';
    }

    followingBtn?.addEventListener('click',()=>showModal('following'));
    followersBtn?.addEventListener('click',()=>showModal('followers'));
    closeBtn?.addEventListener('click',()=>modal.style.display='none');
  }

  // =========================
  // 共通画像アップロード
  // =========================
  setupImageUpload(document.getElementById('headerImg'), document.getElementById('headerImgInput'));
  setupImageUpload(document.getElementById('avatarImg'), document.getElementById('avatarImgInput'));
});