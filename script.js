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

// =========================
// カードクリック操作
// =========================
function initCardClicks() {
  const showcaseEl = document.getElementById("showcase");
  if (!showcaseEl) return;

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

// =========================
// DOMContentLoaded 前半処理
// =========================
document.addEventListener("DOMContentLoaded", () => {
  console.log("JS読み込まれた"); 

  // 保存ボタン
  const saveBtn = document.getElementById("saveBtn");
  if (saveBtn) saveBtn.addEventListener("click", saveAppState_FULL);

  // データ読み込み
  const showcaseEl = document.getElementById("showcase");
  if (showcaseEl) loadAppState();

  if (!showcaseEl) console.warn("#showcase が存在しません");

  // カードクリック操作
  if (showcaseEl) initCardClicks();
});

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
  ['themeButton', 'styleButton', 'announcementButton'].forEach(id => {
  const btn = document.getElementById(id);
  const popup = btn.querySelector('.popup');
  if (!btn || !popup) return;

  btn.addEventListener('click', e => {
    e.stopPropagation();
    // 他のpopupを閉じる
    document.querySelectorAll('.edit-item .popup').forEach(p => {
      if (p !== popup) p.classList.remove('active');
    });
    popup.classList.toggle('active');
  });
});

// 画面クリックで閉じる
document.addEventListener('click', () => {
  document.querySelectorAll('.edit-item .popup').forEach(p => p.classList.remove('active'));
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

  // =========================
  // カスタムバー開閉
  // =========================
  // 編集ボタン
const editToggle = document.getElementById('editToggle');
const editItems = document.getElementById('editItems');
const customBar = document.getElementById('customBar');

editToggle.addEventListener('click', e => {
  e.stopPropagation();
  editItems.classList.toggle('active');

  // カスタムバーも一緒に少し上にスライド
  if(editItems.classList.contains('active')){
    customBar.style.transform = 'translateY(-100px)'; // 上に100pxスライド
  } else {
    customBar.style.transform = 'translateY(0)'; // 元に戻す
  }
});

// 外側クリックで閉じる
document.addEventListener('click', () => {
  if(editItems.classList.contains('active')){
    editItems.classList.remove('active');
    customBar.style.transform = 'translateY(0)';
  }
});

  // =========================
  // アナウンスバー（スクロール）
  // =========================
  const announcementBar = document.getElementById('announcementBar');
  const bannerText = announcementBar?.querySelector('.banner-text');
  const bannerTextInput = document.getElementById('bannerTextInput');

  if (announcementBar && bannerText && bannerTextInput) {
    let scrollInitialized = false;
    let pos = announcementBar.offsetWidth;
    const speed = 1;

    function scroll() {
      const textWidth = bannerText.offsetWidth;
      if (!textWidth) {
        if (!scrollInitialized) {
          scrollInitialized = true;
          setTimeout(scroll, 100);
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

  setupImageUpload(document.getElementById('headerImg'), document.getElementById('headerImgInput'));
  setupImageUpload(document.getElementById('avatarImg'), document.getElementById('avatarImgInput'));
});

