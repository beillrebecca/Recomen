console.log("JS START");

window.onerror = function (msg, url, line, col, error) {
  alert("JSエラー発生:\n" + msg + "\n行:" + line);
};

alert("JS動いてるよ");

document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('DOMContentLoaded', () => {

alert("DOM読み込み成功");

const showcase = document.getElementById('showcase');
alert("showcaseは: " + showcase);

});

const showcase = document.getElementById('showcase');

/* =========================
     データ
  ========================= */
  let items = [];
  for (let i = 1; i <= 12; i++) {
    items.push({
      name: 'アイテム' + i,
      img: 'https://dummyimage.com/300x300/eeeeee/999999&text=%F0%9F%93%B7',
      link: '商品リンク',
      clicks: 0
    });
  }
  
 /* =========================
     ローカル保存 読み込み
  ========================= */

  function loadAppState() {
    const saved = localStorage.getItem('recomenState');
    if (!saved) return;

    const state = JSON.parse(saved);

    // ヘッダー画像
    if (state.headerImg) {
      const header = document.getElementById('headerImg');
      if (header) header.src = state.headerImg;
    }

    // プロフィール画像
    if (state.avatarImg) {
      const avatar = document.getElementById('avatarImg');
      if (avatar) avatar.src = state.avatarImg;
    }

    // アナウンスバー背景
    if (state.announcementBg) {
      const bar = document.getElementById('announcementBar');
      if (bar) bar.style.background = state.announcementBg;
    }

    // アナウンス文字
    if (state.announcementText) {
      const text = document.querySelector('.banner-text');
      if (text) text.textContent = state.announcementText;
    }

    // カードデータ
    if (state.items && Array.isArray(state.items)) {
      items = state.items;
    }
  }

  /* =========================
     保存機能
  ========================= */

  function saveAppState() {
    const state = {
      items: items,
      headerImg: document.getElementById('headerImg')?.src || '',
      avatarImg: document.getElementById('avatarImg')?.src || '',
      announcementText: document.querySelector('.banner-text')?.textContent || '',
      announcementBg: document.getElementById('announcementBar')?.style.background || ''
    };

    localStorage.setItem('recomenState', JSON.stringify(state));
  }

  const saveBtn = document.getElementById('saveBtn');

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      saveAppState();
      alert('保存しました');
    });
  }

/* =========================
     カード描画
  ========================= */

  function renderCards() {
    if (!showcase) return;

    showcase.innerHTML = '';

    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card';

      card.innerHTML = `
        <div class="image">
          <img src="${item.img}" alt="">
        </div>

        <div class="card-name">
          ${item.name}
        </div>

        <div class="price-link-wrapper">
          <a class="link-display" href="${item.link}" target="_blank">
            ${item.link}
          </a>
        </div>
      `;

      showcase.appendChild(card);
    });
  }


  /* =========================
     SVG アイコン
  ========================= */
  function heartIcon() {
    return `<svg class="icon-heart" viewBox="0 0 24 24" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20.8 4.6 a5 5 0 0 0-7.1 0L12 6.3l-1.7-1.7 a5 5 0 0 0-7.1 7.1L12 21l8.8-9.3 a5 5 0 0 0 0-7.1z"/>
    </svg>`;
  }

  function commentIcon() {
    return `<svg viewBox="0 0 24 24"><path d="M21 15a4 4 0 01-4 4H8l-5 3V7a4 4 0 014-4h10a4 4 0 014 4z"/></svg>`;
  }

  function shareIcon() {
    return `<svg viewBox="0 0 24 24"><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4z"/></svg>`;
  }

  function saveIcon() {
    return `<svg class="icon-save" viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>`;
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
      <span class="modern-clicks">${item.clicks}</span>
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
         target="_blank"
         contenteditable="true">
         ${item.link}
      </a>
    </div>

    <div class="card-actions">
      ${heartIcon()}
      ${commentIcon()}
      ${shareIcon()}
      ${saveIcon()}
    </div>

    <button class="edit-link-btn" style="display:none;">編集</button>
  `;

    return card;
}

 /* =========================
     実行順
  ========================= */

  loadAppState();
  renderCards();

});

if (showcase) {
  showcase.addEventListener('click', e => {
    console.log("クリック検出");
  });
}


