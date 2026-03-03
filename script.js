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

    // ⭐ テーマ復元（追加）
    if (state.theme) {
      document.body.classList.remove('theme-natural', 'theme-modern');
      document.body.classList.add(`theme-${state.theme}`);
    }

    // ⭐ フォント復元（追加）
    if (state.fontFamily) {
      document.documentElement.style.setProperty('--font-family', state.fontFamily);
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
// 保存機能（強化版）
// =========================
function saveAppState() {

  const state = {
    items: items,

    // ヘッダー画像
    headerImg: document.getElementById('headerImg')?.src || null,

    // プロフィール画像
    avatarImg: document.getElementById('avatarImg')?.src || null,

    // アナウンスバー背景色
    announcementBg: document.getElementById('announcementBar')?.style.background || null,

    // アナウンス文字
    announcementText: document.querySelector('.banner-text')?.textContent || "",

    // テーマ
    theme: document.body.classList.contains('theme-natural')
      ? 'natural'
      : 'modern',

    // フォント
    fontFamily: getComputedStyle(document.documentElement)
      .getPropertyValue('--font-family')
  };

  localStorage.setItem("recomenState", JSON.stringify(state));
  console.log("全部保存完了");
}

// =========================
// 保存ボタン
// =========================
const saveBtn = document.getElementById("saveBtn");

if (saveBtn) {
  saveBtn.addEventListener("click", () => {
    saveAppState();
    alert("保存しました");
  });
}

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

/* =========================
   編集バー・ポップアップ最適化版
========================= */

const editToggle = document.getElementById('editToggle');
const editItems = document.getElementById('editItems');

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

// 編集バーの開閉
if (editToggle && editItems) {
  editItems.classList.remove('active'); // 初期は閉じる

  editToggle.addEventListener('click', e => {
    e.stopPropagation();
    editItems.classList.toggle('active');

    // スライド中は全ポップアップを隠す
    Object.values(popupMap).forEach(popupId => {
      const popup = document.getElementById(popupId);
      if (popup) popup.style.display = 'none';
    });
  });
}

 // ポップアップ位置関数
 function positionPopup(btn, popup) {
  if (!btn || !popup) return;

  const popupWidth = popup.offsetWidth;
  const popupHeight = popup.offsetHeight;

  const rect = btn.getBoundingClientRect();
  const GAP = -4;

  // 🔥 ボタン中心を正確に使う
  const centerX = rect.left + rect.width / 2;

  let left = centerX - popupWidth / 2;
  let top  = rect.bottom + GAP;

  // 画面はみ出し防止
  left = Math.max(4, Math.min(left, window.innerWidth - popupWidth - 4));

  if (top + popupHeight > window.innerHeight - 4) {
    top = rect.top - popupHeight - GAP;
  }

  popup.style.left = `${Math.round(left)}px`;
  popup.style.top  = `${Math.round(top)}px`;
}

// 各ボタンのポップアップ表示
Object.entries(popupMap).forEach(([btnId, popupId]) => {
  const btn = document.getElementById(btnId);
  const popup = document.getElementById(popupId);
  if (!btn || !popup) return;

  btn.addEventListener('click', e => {
    e.stopPropagation();

    const isActive = popup.classList.contains('active');
    closeAllPopups();

    if (!isActive) {
      popup.classList.add('active');
      popup.style.display = 'block';   // ← ここ追加（表示をここで統一）
      positionPopup(btn, popup);
    }
  });

  popup.addEventListener('click', e => e.stopPropagation());

  window.addEventListener('resize', () => {
    if (popup.classList.contains('active')) {
      positionPopup(btn, popup);
    }
  });
});

// =========================
// テーマ切替（カード画像保持版）
// =========================
const themeRadios = document.querySelectorAll('input[name="theme"]');
themeRadios.forEach(radio => {
  radio.addEventListener('change', e => {
    const showcase = document.getElementById('showcase');
    if (!showcase) return;

    // カード内の既存画像を保持
    const existingImages = Array.from(showcase.querySelectorAll('.card img')).map(img => img.src);

    // ボディクラス切替
    if (e.target.value === 'natural') {
      document.body.classList.remove('theme-modern');
      document.body.classList.add('theme-natural');
    } else {
      document.body.classList.remove('theme-natural');
      document.body.classList.add('theme-modern');
    }


    // 再描画後に画像を復元（カードはそのまま）
    const cardImgs = showcase.querySelectorAll('.card img');
    cardImgs.forEach((img, i) => {
      if (existingImages[i]) img.src = existingImages[i];
    });
  });
});

// フォント変更でもカード再描画する場合も同様に対応
const fontSelect = document.getElementById('fontSelect');
if (fontSelect) {
  fontSelect.addEventListener('change', e => {
    document.documentElement.style.setProperty('--font-family', e.target.value);
  });
}

// ===============================
// 画像アップロード 共通関数
// ===============================
function setupImageUpload(imgEl, inputEl, onSave) {
  if (!imgEl || !inputEl) return;

  imgEl.addEventListener('click', () => inputEl.click());

  inputEl.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      imgEl.src = ev.target.result;

      // 保存処理（必要な場合だけ）
      if (onSave) onSave(ev.target.result);
    };

    reader.readAsDataURL(file);
    inputEl.value = '';
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

// ===============================
// ショーケース画像アップロード
// ===============================
const itemImgInput = document.getElementById('itemImgInput');

if (showcase && itemImgInput) {
  showcase.addEventListener('click', (e) => {
    const imageEl = e.target.closest('.image');
    if (!imageEl) return;

    const cardEl = imageEl.closest('.card');
    const imgEl = imageEl.querySelector('img');
    if (!imgEl) return;

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
      itemImgInput.value = '';
    };

    itemImgInput.click();
  });
  }
  
  /* ===============================
   アナウンスバー
=============================== */

const announcementToggle = document.getElementById('announcementToggle');
const bannerTextInput = document.getElementById('bannerTextInput');
const announcementBar = document.getElementById('announcementBar');
const bannerText = announcementBar?.querySelector('.banner-text');

if (announcementToggle && announcementBar) {

  // 初期表示状態
  announcementBar.style.display =
    announcementToggle.checked ? 'flex' : 'none';

  // ON/OFF切り替え
  announcementToggle.addEventListener('change', e => {
    announcementBar.style.display =
      e.target.checked ? 'flex' : 'none';
  });
}

if (announcementBar && bannerText && bannerTextInput) {

  // スタイル初期化（安全に）
  announcementBar.style.alignItems = 'center';
  announcementBar.style.overflow = 'hidden';
  announcementBar.style.position = 'relative';
  announcementBar.style.height = '40px';
  announcementBar.style.padding = '0 10px';

  bannerText.style.position = 'absolute';
  bannerText.style.whiteSpace = 'nowrap';
  bannerText.style.top = '50%';
  bannerText.style.transform = 'translateY(-50%)';
  bannerText.style.fontSize = '16px';
  bannerText.style.lineHeight = '1';

  // 初期テキスト反映
  bannerText.textContent = bannerTextInput.value;

  let pos = announcementBar.offsetWidth;
  const speed = 1.0;

  function startScroll() {
    const textWidth = bannerText.offsetWidth;

    function scroll() {
      pos -= speed;

      if (pos <= -textWidth) {
        pos = announcementBar.offsetWidth;
      }

      bannerText.style.left = pos + 'px';
      requestAnimationFrame(scroll);
    }

    scroll();
  }

  requestAnimationFrame(startScroll);

  // テキスト変更時
  bannerTextInput.addEventListener('input', () => {
    bannerText.textContent = bannerTextInput.value;
    pos = announcementBar.offsetWidth;
  });

  // リサイズ対応
  window.addEventListener('resize', () => {
    pos = announcementBar.offsetWidth;
  });
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

  picker.on('init', () => {
    const btn = picker.root.querySelector('.pcr-button');
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
   Picker生成例（関数外で呼び出す）
=============================== */

// 1. フォントカラー
createPicker('fontColorPicker', (color) => {
  document.documentElement.style.setProperty('--font-color', color);
});

// 2. ショーケース背景色
createPicker('bgPicker', (color) => {
  document.documentElement.style.setProperty('--showcase-bg', color);
});

// 3. プロフィール背景色
createPicker('profileBgPicker', (color) => {
  document.documentElement.style.setProperty('--profile-bg', color);
});

// 4. アナウンスバー背景色
createPicker('announcementBgPicker', (color) => {
  const bar = document.getElementById('announcementBar');
  if (bar) bar.style.background = color;
});

/* ===============================
   フォロー / フォロワーモーダル制御
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

});

alert("JSは最後まで動いてる！");