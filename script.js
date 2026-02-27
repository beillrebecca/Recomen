document.addEventListener('DOMContentLoaded', () => {

  /* =========================
     データ
  ========================= */
  const items = [];
  for (let i = 1; i <= 12; i++) {
    items.push({
      name: 'アイテム' + i,
      img: 'https://dummyimage.com/300x300/eeeeee/999999&text=%F0%9F%93%B7',
      link: '商品リンク',
      clicks: 0
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
      <div class="card-price">¥0</div>
      <a class="link-display" href="${item.link}" target="_blank">${item.link}</a>
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
   カード描画
========================= */
function renderCards() {
  if (!showcase) return;

  console.log("itemsの中身", items);

  // 古いカードを消す
  showcase.innerHTML = '';

  // 現在のテーマ
  const theme = document.body.classList.contains('theme-modern') ? 'modern' : 'natural';

  // 新しいカードを追加
  items.forEach(item => {
    const card = createCard(item, theme);
    showcase.appendChild(card);
  });
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
  

 // ポップアップ位置関数はここで一度だけ定義
function positionPopup(btn, popup) {
  if (!btn || !popup) return;

  popup.style.display = 'block'; // 一旦表示してサイズを取得

  const popupWidth = popup.offsetWidth;
  const popupHeight = popup.offsetHeight;

  const btnRect = btn.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // 左右位置：ボタンの中央に揃える
  let left = btnRect.left + (btnRect.width - popupWidth) / 2;

  // 画面左にはみ出さないよう調整
  if (left < 4) left = 4;
  // 画面右にはみ出さないよう調整
  if (left + popupWidth > viewportWidth - 4) left = viewportWidth - popupWidth - 4;

  // 上下位置：ボタンの真下
  let top = btnRect.bottom + 6;

  // 画面下にはみ出す場合はボタンの上に表示
  if (top + popupHeight > viewportHeight - 4) {
    top = btnRect.top - popupHeight - 6;
  }

  popup.style.left = `${left}px`;
  popup.style.top = `${top}px`;

  // active クラスで表示を制御
  if (!popup.classList.contains('active')) {
    popup.style.display = 'none';
  }
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

    renderCards(); // 再描画

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
  function setupImageUpload(imgEl, inputEl) {
    if (!imgEl || !inputEl) return;

    imgEl.addEventListener('click', () => inputEl.click());


    inputEl.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(ev) {
        imgEl.src = ev.target.result;
      };
      reader.readAsDataURL(file);

      // クリアして次回に備える
      inputEl.value = '';
    });
  }

  // ヘッダーとプロフィール画像
  setupImageUpload(
    document.getElementById('headerImg'),
    document.getElementById('headerImgInput')
  );

  setupImageUpload(
    document.getElementById('avatarImg'),
    document.getElementById('avatarImgInput')
  );

  // すでにある input
const itemImgInput = document.getElementById('itemImgInput');

// showcase のクリックをまとめて処理
showcase.addEventListener('click', (e) => {

  // 画像エリア以外は無視
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

  /* ===============================
     アナウンスバー
  =============================== */
  const announcementToggle = document.getElementById('announcementToggle');
  const bannerTextInput = document.getElementById('bannerTextInput');
  const announcementBar = document.getElementById('announcementBar');
  const bannerText = announcementBar?.querySelector('.banner-text');

  if (announcementToggle && announcementBar) {
    announcementToggle.addEventListener('change', e => {
      announcementBar.style.display = e.target.checked ? 'flex' : 'none';
    });
    announcementBar.style.display = announcementToggle.checked ? 'flex' : 'none';
  }

  if (announcementBar && bannerText && bannerTextInput) {
    announcementBar.style.display = 'flex';
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

    bannerText.textContent = bannerTextInput.value;

    let pos = announcementBar.offsetWidth;
    let speed = 1.0;

    function startScroll() {
      const textWidth = bannerText.offsetWidth;
      function scroll() {
        pos -= speed;
        if (pos <= -textWidth) pos = announcementBar.offsetWidth;
        bannerText.style.left = pos + 'px';
        requestAnimationFrame(scroll);
      }
      scroll();
    }

    window.requestAnimationFrame(startScroll);

    bannerTextInput.addEventListener('input', () => {
      bannerText.textContent = bannerTextInput.value;
      pos = announcementBar.offsetWidth;
    });

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

// フォロー/フォロワー文字色反映（Pickr）
createPicker('fontColorPicker', (hex) => {
  document.documentElement.style.setProperty('--font-color', hex);

  // profile-stats の子要素にも直接 color を反映
  const statsItems = document.querySelectorAll('.profile-stats .stat-item, .profile-stats .stat-item strong');
  statsItems.forEach(el => {
    el.style.color = hex;
  });
});

// 2. 背景色
createPicker('bgPicker', (color) => {
  document.documentElement.style.setProperty('--showcase-bg', color);
});
// 3. フォントカラー（トップバーには影響させない）
createPicker('fontColorPicker', (color) => {
  document.documentElement.style.setProperty('--font-color', color);
});

// 4. プロフィール背景色
createPicker('profileBgPicker', (color) => {
  document.documentElement.style.setProperty('--profile-bg', color);
});

// 5. アナウンスバー背景色
createPicker('announcementBgPicker', (color) => {
  const bar = document.getElementById('announcementBar');
  if(bar) bar.style.background = color;
});

  /* ===============================
   フォロー / フォロワーモーダル制御
   （プロフィール画面用）
=============================== */
const followingBtn = document.getElementById('followingBtn');
const followersBtn = document.getElementById('followersBtn');
const modal = document.getElementById('followModal');
const modalTitle = modal.querySelector('.modal-title');
const userList = modal.querySelector('.user-list');
const closeBtn = modal.querySelector('.close-btn');

// 仮データ
const following = [
  { name: 'ユーザーA', img: 'https://via.placeholder.com/32' },
  { name: 'ユーザーB', img: 'https://via.placeholder.com/32' }
];

const followers = [
  { name: 'ユーザーC', img: 'https://via.placeholder.com/32' },
  { name: 'ユーザーD', img: 'https://via.placeholder.com/32' }
];

// モーダル表示関数
function showModal(type) {
  userList.innerHTML = '';
  let list = type === 'following' ? following : followers;
  modalTitle.textContent = type === 'following' ? 'フォロー中' : 'フォロワー';
  list.forEach(user => {
    const li = document.createElement('li');
    li.innerHTML = `<img src="${user.img}" alt="${user.name}"><span>${user.name}</span>`;
    userList.appendChild(li);
  });
  modal.style.display = 'block';
}

// ボタンクリックでモーダル表示
followingBtn.addEventListener('click', () => showModal('following'));
followersBtn.addEventListener('click', () => showModal('followers'));

// モーダル閉じるボタン
closeBtn.addEventListener('click', () => modal.style.display = 'none');


// 全ポップアップ閉じるイベント
document.addEventListener('click', closeAllPopups);
});
