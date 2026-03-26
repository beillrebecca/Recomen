alert("JS読み込まれてる！");

// =========================
// 🔴 データ本体（超重要）
// =========================
let items = [];

// =========================
// SVG アイコン生成（状態反映版）
// =========================
function heartIcon(item) {
  return `
    <svg class="icon-heart ${item.liked ? 'active' : ''}" viewBox="0 0 24 24" stroke-width="1.3"
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
    <svg class="icon-save ${item.saved ? 'active' : ''}" viewBox="0 0 24 24" stroke-width="1.3"
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
  const saved = localStorage.getItem("recomenState");
  if (!saved) return;

  try {
    const state = JSON.parse(saved);

    // ヘッダー・アバター
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
    if (state.theme) {
      document.body.classList.remove('theme-natural', 'theme-modern');
      document.body.classList.add(`theme-${state.theme}`);
    }
    if (state.fontFamily) {
      document.documentElement.style.setProperty('--font-family', state.fontFamily);
    }

    // プロフィール情報
    const profileNameEl = document.getElementById("profileName");
    if (profileNameEl && state.profileName) profileNameEl.textContent = state.profileName;

    const profileBioEl = document.getElementById("profileBio");
    if (profileBioEl && state.profileBio) profileBioEl.textContent = state.profileBio;

    // ⭐ カード再生成（重要）
    const showcase = document.getElementById("showcase");
    if (showcase && state.items) {
      items = state.items;
      showcase.innerHTML = "";
      state.items.forEach(item => {
        const card = createCard(item);
        showcase.appendChild(card);
      });
    }

    console.log("保存データ読み込み完了");

  } catch (e) {
    console.error("読み込み失敗", e);
  }
}

// =========================
// 保存（アプリ全体）
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
    alert("保存しました！");
      
  } catch (e) {
    console.error("❌【saveAppState_FULL】保存失敗:", e);
    alert("保存に失敗しました");
  }
}

// =========================
// カード操作（クリックイベント一括処理）
// =========================
const showcaseEl = document.getElementById("showcase");

if (showcaseEl) {
  showcaseEl.addEventListener("click", (e) => {

    // ❤️ ハート
    const heart = e.target.closest(".icon-heart");
    if (heart) {
      heart.classList.toggle("liked");
      const path = heart.querySelector("path");
      if (path) {
        if (heart.classList.contains("liked")) {
          path.setAttribute("fill", "red");
          path.setAttribute("stroke", "red");
        } else {
          path.setAttribute("fill", "none");
          path.setAttribute("stroke", "#000");
        }
      }
      const card = heart.closest(".card");
      const index = Array.from(showcaseEl.children).indexOf(card);
      if (items[index]) items[index].liked = heart.classList.contains("liked");
      console.log("ハート押された");
      return;
    }

    // 💾 保存アイコン
    const save = e.target.closest(".icon-save");
    if (save) {
      save.classList.toggle("saved");
      const path = save.querySelector("path");
      if (path) {
        path.setAttribute("fill", save.classList.contains("saved") ? "#000" : "none");
        path.setAttribute("stroke", "#000");
      }
      const card = save.closest(".card");
      const index = Array.from(showcaseEl.children).indexOf(card);
      if (items[index]) items[index].saved = save.classList.contains("saved");
      console.log("保存押された");
      return;
    }

    // 🔗 リンク編集
    const linkEl = e.target.closest(".link-display");
    const editBtn = e.target.closest(".edit-link-btn");
    if (linkEl || editBtn) {
      const card = e.target.closest(".card");
      const target = card.querySelector(".link-display");
      const current = target.getAttribute("href") || "";
      const newLink = prompt("商品リンクを入力してね", current);
      if (newLink) {
        const finalLink = newLink.startsWith("http") ? newLink : "https://" + newLink;
        target.setAttribute("href", finalLink);
        target.textContent = finalLink;
        console.log("リンク編集された:", Array.from(showcaseEl.children).indexOf(card));
      }
      return;
    }

    // 🖼 画像アップロード（軽量＋保存対応）
    const imageEl = e.target.closest(".image");
    if (imageEl) {
      const img = imageEl.querySelector("img");
      const input = document.getElementById("itemImgInput");
      if (!img || !input) return;

      input.onchange = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
          const image = new Image();
          image.onload = () => {
            const canvas = document.createElement("canvas");
            const maxSize = 200;
            let w = image.width;
            let h = image.height;

            if (w > h && w > maxSize) { h *= maxSize / w; w = maxSize; }
            else if (h >= w && h > maxSize) { w *= maxSize / h; h = maxSize; }

            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(image, 0, 0, w, h);
            const compressed = canvas.toDataURL("image/jpeg", 0.6);

            img.src = compressed;

            const index = Array.from(showcaseEl.children).indexOf(imageEl.closest(".card"));
            if (items[index]) items[index].img = compressed;
            console.log("画像変更（軽量＋保存対応）", index);
          };
          image.src = ev.target.result;
        };
        reader.readAsDataURL(file);
        input.value = "";
      };

      input.click();
      return;
    }
  });
}

// =========================
// 💾 保存ボタン
// =========================
document.getElementById("saveBtn")?.addEventListener("click", saveAppState_FULL);

// =========================
// カスタムバー開閉
// =========================
const editToggle = document.getElementById('editToggle');
const editItems = document.getElementById('editItems');
if (editToggle && editItems) {
  editItems.classList.remove('active'); // 初期閉じ
  editToggle.addEventListener('click', (e) => {
    e.stopPropagation(); // ← 超重要
    closeAllPopups();
    editItems.classList.toggle('active');
  });
}

// =========================
// ポップアップ設定
// =========================
const popupMap = {
  themeButton: 'themePopup',
  styleButton: 'stylePopup',
  announcementButton: 'announcementPopup'
};

document.addEventListener("DOMContentLoaded", () => {
  
  document.addEventListener('click', (e) => {
  const isButton = Object.keys(popupMap).some(id => {
    const el = document.getElementById(id);
    return el && el.contains(e.target);
  });

  const isPopup = Object.values(popupMap).some(id => {
    const el = document.getElementById(id);
    return el && el.contains(e.target);
  });

  if (!isButton && !isPopup) {
    closeAllPopups();
  }
});



  // =========================
  // テーマ切替（カード画像保持）
  // =========================
  document.querySelectorAll('input[name="theme"]').forEach(radio => {
    radio.addEventListener('change', e => {
      const existingImages = Array.from(showcaseEl.querySelectorAll('.card img')).map(img => img.src);
      document.body.classList.toggle('theme-natural', e.target.value === 'natural');
      document.body.classList.toggle('theme-modern', e.target.value !== 'natural');
      showcaseEl.querySelectorAll('.card img').forEach((img, i) => {
        if (existingImages[i]) img.src = existingImages[i];
      });
    });
  });

  // =========================
  // Picker生成
  // =========================
  //createPicker('fontColorPicker', (color) => document.documentElement.style.setProperty('--font-color', color));
  //createPicker('bgPicker', (color) => document.documentElement.style.setProperty('--showcase-bg', color));
  //createPicker('profileBgPicker', (color) => document.documentElement.style.setProperty('--profile-bg', color));
  //createPicker('announcementBgPicker', (color) => {
    //const bar = document.getElementById('announcementBar');
    //if (bar) bar.style.background = color;
  //});

  // =========================
  // フォント変更
  // =========================
  document.getElementById('fontSelect')?.addEventListener('change', e => {
    document.documentElement.style.setProperty('--font-family', e.target.value);
  });

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
  // ポップアップ処理
  // =========================
  Object.entries(popupMap).forEach(([btnId, popupId]) => {
  const btn = document.getElementById(btnId);
  const popup = document.getElementById(popupId);
  if (!btn || !popup) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();

    const isActive = popup.classList.contains('active');
    closeAllPopups();

    if (!isActive) {

  popup.classList.add('active');
  popup.style.display = 'block';

  positionPopup(btn, popup);

  }
});

  popup.addEventListener('click', e => e.stopPropagation());
});


  // =========================
  // アナウンスバー（スクロール）
  // =========================
  const announcementToggle = document.getElementById('announcementToggle');
  const bannerTextInput = document.getElementById('bannerTextInput');
  const announcementBar = document.getElementById('announcementBar');
  const bannerText = announcementBar?.querySelector('.banner-text');

  if (announcementToggle && announcementBar && bannerText && bannerTextInput) {
    let pos = announcementBar.offsetWidth;
    const speed = 1.0;

    function scroll() {
      const textWidth = bannerText.offsetWidth;
      if (!textWidth) { requestAnimationFrame(scroll); return; }
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
});

// ===============================
// ポップアップ用関数
// ===============================
function closeAllPopups() {
  Object.values(popupMap).forEach(popupId => {
    const popup = document.getElementById(popupId);
    if (popup) {
  popup.classList.remove('active');
  popup.style.display = 'none';
}
  });
}

// ボタンの真下中央に表示する
function positionPopup(btn, popup) {
  if (!btn || !popup) return;

  popup.style.visibility = "hidden";
  popup.style.display = "block";

  const rect = btn.getBoundingClientRect();
  const popupWidth = popup.offsetWidth;
  const popupHeight = popup.offsetHeight;

  // 中央寄せ
  let left = rect.left + rect.width / 2 - popupWidth / 2;

  // 上に表示
  let top = rect.bottom + 10;

  // はみ出し防止
  left = Math.max(8, Math.min(left, window.innerWidth - popupWidth - 8));

  popup.style.position = "fixed";
  popup.style.left = left + "px";
  popup.style.top = top + "px";

  popup.style.visibility = "visible";
}

// ===============================
// 画像アップロード共通処理
// ===============================
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

// ===============================
// ヘッダー・プロフィール画像
// ===============================
setupImageUpload(document.getElementById('headerImg'), document.getElementById('headerImgInput'));
setupImageUpload(document.getElementById('avatarImg'), document.getElementById('avatarImgInput'));