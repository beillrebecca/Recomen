console.log("JS START");

window.onerror = function (msg, url, line, col, error) {
  alert("JSエラー発生:\n" + msg + "\n行:" + line);
};

alert("JS動いてるよ");

document.addEventListener('DOMContentLoaded', () => {

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


  /* =========================
     編集されたら items を更新
  ========================= */

  // 商品名
  card.querySelector('.card-name').addEventListener('input', e => {
    item.name = e.target.innerText.trim();
    saveAppState();
  });

  // 値段
  card.querySelector('.card-price').addEventListener('input', e => {
    item.price = e.target.innerText.trim();
    saveAppState();
  });

  // 商品リンク
  card.querySelector('.link-display').addEventListener('input', e => {
    const newLink = e.target.innerText.trim();
    item.link = newLink;
    e.target.href = newLink; // クリック先も更新
    saveAppState();
  });

  return card;
}


renderCards(); // 初期描画

// =========================
// ショーケースクリック処理（名前編集＆画像アップロード両立）
// =========================
if (showcase) {
  showcase.addEventListener('click', e => {

    // --- ハートアイコン ---
    const heart = e.target.closest('.icon-heart');
    if (heart) {
      heart.classList.toggle('liked');
      const path = heart.querySelector('path');
      path.setAttribute('fill', heart.classList.contains('liked') ? 'red' : 'none');
      path.setAttribute('stroke', heart.classList.contains('liked') ? 'red' : '#000');
      heart.classList.remove('pop');
      void heart.offsetWidth;
      heart.classList.add('pop');
      return;
    }

    // --- 保存アイコン ---
    const save = e.target.closest('.icon-save');
    if (save) {
      save.classList.toggle('saved');
      const path = save.querySelector('path');
      path.setAttribute('fill', save.classList.contains('saved') ? '#000' : 'none');
      path.setAttribute('stroke', '#000');
      save.classList.remove('pop');
      void save.offsetWidth;
      save.classList.add('pop');
      return;
    }

    // --- 編集ボタン ---
    const editBtn = e.target.closest('.edit-link-btn');
    if (editBtn) {
      e.stopPropagation();
      const card = editBtn.closest('.card');
      const linkEl = card.querySelector('.link-display');
      const currentLink = linkEl.getAttribute('href');
      const newLink = prompt('商品リンクを入力してください', currentLink);
      if (newLink) {
        linkEl.setAttribute('href', newLink);
        linkEl.textContent = newLink;
      }
      return;
    }

    // --- 商品リンククリック ---
    const linkEl = e.target.closest('.link-display');
    if (linkEl) {
      e.preventDefault();
      const card = linkEl.closest('.card');
      const editBtn = card.querySelector('.edit-link-btn');

      // 編集ボタンを一時表示（ポップアップ代わり）
      editBtn.style.display = 'inline-block';
      editBtn.style.position = 'absolute';
      editBtn.style.top = linkEl.offsetTop + linkEl.offsetHeight + 4 + 'px';
      editBtn.style.left = linkEl.offsetLeft + 'px';

      const currentLink = linkEl.getAttribute('href');
      const newLink = prompt('商品リンクを入力してください', currentLink);
      if (newLink) {
        linkEl.setAttribute('href', newLink);
        linkEl.textContent = newLink;
      }

      editBtn.style.display = 'none';
      return;
    }

     // --- 名前編集をクリックした場合はアップロード処理を止める ---
  const nameEl = e.target.closest('.card-name, .modern-name');
  if (nameEl) {
    // 名前部分にクリックが来たらここで処理を止める
    return; 
  }

  // --- 画像クリック（名前以外） ---
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
      if (index >= 0) items[index].img = ev.target.result;
    };
    reader.readAsDataURL(file);

    itemImgInput.value = '';
  };

  itemImgInput.click();
});
}

// =========================
// 名前編集の反映
// =========================
showcase.addEventListener('input', (e) => {
  const nameEl = e.target.closest('.card-name, .modern-name');
  if (!nameEl) return;

  const cardEl = nameEl.closest('.card');
  const index = Array.from(showcase.children).indexOf(cardEl);

  if (index >= 0) {
    items[index].name = nameEl.textContent.trim();
  }
});



}
});

console.log("SCRIPT END");
