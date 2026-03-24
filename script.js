alert("JS読み込まれてる！");

// =========================
// 🔴 データ本体（超重要）
// =========================
let items = [];

// =========================
// カード作成
// =========================
function createCard(item) {
  const card = document.createElement('div');
  card.className = 'card';

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
  // SVG アイコン（状態反映版）
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

// =========================
// ローカル保存 読み込み
// =========================
function loadAppState() {
  const saved = localStorage.getItem("recomenState");
  if (!saved) return;

  try {
    const state = JSON.parse(saved);

    // =========================
    // UI系
    // =========================

    const header = document.getElementById("headerImg");
    if (header && state.headerImg) header.src = state.headerImg;

    const avatar = document.getElementById("avatarImg");
    if (avatar && state.avatarImg) avatar.src = state.avatarImg;

    const bar = document.getElementById("announcementBar");
    if (bar && state.announcementBg) bar.style.backgroundColor = state.announcementBg;

    const bannerText = document.querySelector(".banner-text");
    if (bannerText && state.announcementText) bannerText.textContent = state.announcementText;

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

    const profileNameEl = document.getElementById("profileName");
    if (profileNameEl && state.profileName) profileNameEl.textContent = state.profileName;

    const profileBioEl = document.getElementById("profileBio");
    if (profileBioEl && state.profileBio) profileBioEl.textContent = state.profileBio;


// =========================
    // ⭐ カード再生成（重要）
    // =========================
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
// 🔴【保存：アプリ全体】saveAppState（完全版）
// =========================
function saveAppState_FULL() {
  try {
    const state = {
      items: items || [],

      // 画像
      headerImg: document.getElementById('headerImg')?.src || null,
      avatarImg: document.getElementById('avatarImg')?.src || null,

      // アナウンスバー
      announcementBg: document.getElementById('announcementBar')?.style.backgroundColor || null,
      announcementText: document.querySelector('.banner-text')?.textContent || "",

      // 背景・プロフィール・フォント
      bgColor: document.body.style.backgroundColor || null,
      profileBg: document.querySelector('.profile')?.style.backgroundColor || null,
      fontColor: document.body.style.color || null,

      // テーマ・フォント
      theme: document.body.classList.contains('theme-natural') ? 'natural' : 'modern',
      fontFamily: getComputedStyle(document.documentElement).getPropertyValue('--font-family') || null,

      // プロフィール情報
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
// カード操作
// =========================
const showcase = document.getElementById("showcase");
if (showcase) {
  showcase.addEventListener("click", (e) => {

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
  const cards = Array.from(showcase.children);
  const index = cards.indexOf(card);

  if (items[index]) {
    items[index].liked = heart.classList.contains("liked");
  }


      console.log("ハート押された");
      return;
    }

    // 💾 保存アイコン
    const save = e.target.closest(".icon-save");

    if (save) {
      save.classList.toggle("saved");

      const path = save.querySelector("path");

      if (path) {
        if (save.classList.contains("saved")) {
          path.setAttribute("fill", "#000");
        } else {
          path.setAttribute("fill", "none");
        }
        path.setAttribute("stroke", "#000");
      }
      
      const card = save.closest(".card");
  const cards = Array.from(showcase.children);
  const index = cards.indexOf(card);

  if (items[index]) {
    items[index].saved = save.classList.contains("saved");
  }


      console.log("保存押された");
      return;
    }

    // 🔗 リンク編集（修正版）
const linkEl = e.target.closest(".link-display");
const editBtn = e.target.closest(".edit-link-btn");

if (linkEl || editBtn) {
  const card = e.target.closest(".card");

  // 👇 何番目のカードか取得（重要）
  const cards = Array.from(showcase.children);
  const index = cards.indexOf(card);

  const target = card.querySelector(".link-display");

  const current = target.getAttribute("href") || "";

  const newLink = prompt("商品リンクを入力してね", current);

  if (newLink) {
    const finalLink = newLink.startsWith("http")
      ? newLink
      : "https://" + newLink;

    target.setAttribute("href", finalLink);
    target.textContent = finalLink;

    console.log("リンク編集された:", index);
  }

  return;
  }

    // 🖼 画像アップロード（軽量化版）
const imageEl = e.target.closest(".image");

if (imageEl) {
  const img = imageEl.querySelector("img");
  const input = document.getElementById("itemImgInput");

  if (!input || !img) return;

  input.onchange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (ev) => {
      const image = new Image();

      image.onload = () => {
        const canvas = document.createElement("canvas");
        const maxSize = 200; // ← サイズ制限（ここが重要）

        let w = image.width;
        let h = image.height;

        if (w > h) {
          if (w > maxSize) {
            h = h * (maxSize / w);
            w = maxSize;
          }
        } else {
          if (h > maxSize) {
            w = w * (maxSize / h);
            h = maxSize;
          }
        }

        canvas.width = w;
        canvas.height = h;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, w, h);

        // 🔥 圧縮（超重要）
        const compressed = canvas.toDataURL("image/jpeg", 0.6);

        img.src = compressed;
      };

      image.src = ev.target.result;
    };

    reader.readAsDataURL(file);

    input.value = "";
  };

  input.click();

  console.log("画像変更（軽量版）");
  return;
  }

  });
}

// =========================
// 💾 保存ボタン（完全版）
// =========================
const saveBtn = document.getElementById("saveBtn");

if (saveBtn) {
  saveBtn.addEventListener("click", () => {
    saveAppState_FULL(); // ←これだけ！
  });
}

// =========================
// カスタムバー開閉（これが足りない）
// =========================
const editToggle = document.getElementById('editToggle');
const editItems = document.getElementById('editItems');

if (editToggle && editItems) {
  editItems.classList.remove('active'); // 初期閉じ

  editToggle.addEventListener('click', (e) => {
    e.stopPropagation(); // ← 超重要
    editItems.classList.toggle('active');
  });
}

// =========================
// ポップアップ設定（外に出す）
// =========================
const popupMap = {
  themeButton: 'themePopup',
  styleButton: 'stylePopup',
  announcementButton: 'announcementPopup'
};

document.addEventListener("DOMContentLoaded", () => {
  

  // =========================
  // テーマ切替（カード画像保持版）
  // =========================
  const themeRadios = document.querySelectorAll('input[name="theme"]');

  themeRadios.forEach(radio => {
    radio.addEventListener('change', e => {
      const showcase = document.getElementById('showcase');
      if (!showcase) return;

      // 画像保持
      const existingImages = Array.from(
        showcase.querySelectorAll('.card img')
      ).map(img => img.src);

      // テーマ切替
      if (e.target.value === 'natural') {
        document.body.classList.remove('theme-modern');
        document.body.classList.add('theme-natural');
      } else {
        document.body.classList.remove('theme-natural');
        document.body.classList.add('theme-modern');
      }

      // 画像復元
      const cardImgs = showcase.querySelectorAll('.card img');
      cardImgs.forEach((img, i) => {
        if (existingImages[i]) img.src = existingImages[i];
      });
    });
  });

  // =========================
  // フォント変更
  // =========================
  const fontSelect = document.getElementById('fontSelect');

  if (fontSelect) {
    fontSelect.addEventListener('change', e => {
      document.documentElement.style.setProperty('--font-family', e.target.value);
    });
  }

});

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

  // 全部閉じる
  function closeAllPopups() {
    Object.values(popupMap).forEach(popupId => {
      const popup = document.getElementById(popupId);
      if (popup) {
        popup.classList.remove('active');
        popup.style.display = 'none';
      }
    });
  }

  // 🔥 位置調整関数（編集バー直下版）
  function positionPopup(btn, popup) {
  if (!btn || !popup) return;

  // 一旦表示（サイズ取得のため）
  popup.style.display = "block";
  popup.style.visibility = "hidden";

  const rect = btn.getBoundingClientRect();
  const popupWidth = popup.offsetWidth;

  // 🔥 横：ボタン中央
  let left = rect.left + rect.width / 2 - popupWidth / 2;

  // 🔥 縦：ボタンの真下
  let top = rect.bottom - 44;

  // 🔥 画面内に収める（右はみ出し防止）
  left = Math.max(8, Math.min(left, window.innerWidth - popupWidth - 8));

  // 🔥 最終反映
  popup.style.position = "fixed";
  popup.style.left = left + "px";
  popup.style.top = top + "px";

  popup.style.visibility = "visible";
}

  // ボタン処理
  Object.entries(popupMap).forEach(([btnId, popupId]) => {
    const btn = document.getElementById(btnId);
    const popup = document.getElementById(popupId);

    console.log(btnId, btn);

    if (!btn || !popup) return;

    btn.addEventListener('click', (e) => {
  e.stopPropagation();

  const isActive = popup.classList.contains('active');

  closeAllPopups();

  if (!isActive) {
    popup.classList.add('active');
    popup.style.display = "block";

    // 👇 これが超重要
    requestAnimationFrame(() => {
      positionPopup(btn, popup);
    });
  }
});

    popup.addEventListener('click', e => e.stopPropagation());
  });

  document.body.addEventListener('click', closeAllPopups);

});


// ===============================
// アナウンスバー安全スクロール（修正版）
// ===============================
document.addEventListener("DOMContentLoaded", () => {

  const announcementToggle = document.getElementById('announcementToggle');
  const bannerTextInput = document.getElementById('bannerTextInput');
  const announcementBar = document.getElementById('announcementBar');
  const bannerText = announcementBar?.querySelector('.banner-text');

  if (!announcementToggle || !announcementBar || !bannerText || !bannerTextInput) {
    console.warn("アナウンスバー要素が見つからない");
    return;
  }

  // 初期表示
  announcementBar.style.display = announcementToggle.checked ? 'flex' : 'none';

  announcementToggle.addEventListener('change', e => {
    announcementBar.style.display = e.target.checked ? 'flex' : 'none';
  });

  // スタイル
  announcementBar.style.position = 'relative';
  announcementBar.style.overflow = 'hidden';
  announcementBar.style.height = '40px';
  announcementBar.style.alignItems = 'center';
  announcementBar.style.padding = '0 10px';

  bannerText.style.position = 'absolute';
  bannerText.style.whiteSpace = 'nowrap';
  bannerText.style.top = '50%';
  bannerText.style.transform = 'translateY(-50%)';
  bannerText.style.left = '0px';

  bannerText.textContent = bannerTextInput.value;

  let pos = announcementBar.offsetWidth;
  const speed = 1.0;

  function scroll() {
    const textWidth = bannerText.offsetWidth;
    if (!textWidth) {
      requestAnimationFrame(scroll);
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

// ===============================
// 画像アップロード共通処理
// ===============================
function setupImageUpload(imgEl, inputEl) {
  if (!imgEl || !inputEl) return;

  imgEl.addEventListener('click', () => {
    inputEl.click();
  });

  inputEl.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (ev) => {
      imgEl.src = ev.target.result;
    };

    reader.readAsDataURL(file);
  });
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


  window.addEventListener('resize', () => {
    pos = announcementBar.offsetWidth;
  });

});

