alert("JSは読み込まれた！");
console.log("JSは読み込まれた！");

const editToggle = document.getElementById('editToggle');
console.log('editToggle:', editToggle);

// =========================
// items 初期化（最初は空）
// =========================
let items = [];

// =========================
// DOM読み込み後に初期化
// =========================
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM読み込みOK");

  const showcase = document.getElementById("showcase");
  const itemImgInput = document.getElementById("itemImgInput");

  if (!showcase) {
    console.error("showcaseが見つからない");
    return;
  }

  // =========================
  // 保存データ読み込み
  // =========================
  loadAppState();

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
  // 初期データ生成（必要な場合のみ）
  // =========================
  if (!items || items.length === 0) {
    for (let i = 1; i <= 12; i++) {
      items.push({
        name: "アイテム" + i,
        img: "https://dummyimage.com/300x300/eeeeee/999999&text=%F0%9F%93%B7",
        link: "商品リンク",
        clicks: 0,
        liked: false,
        saved: false
      });
    }
  }

  // =========================
  // カード描画（最適化版）
  // =========================
  function renderCards() {
    // 古いカードを消す
    showcase.innerHTML = "";

    // documentFragment にまとめて追加
    const fragment = document.createDocumentFragment();
    items.forEach(item => {
      const card = createCard(item);

      // 画像を遅延ロード
      const img = card.querySelector("img");
      if (img) img.loading = "lazy";

      fragment.appendChild(card);
    });

    showcase.appendChild(fragment);
  }

  renderCards();
});

  
  // =========================
  // ショーケース編集＆画像アップロード
  // =========================
  showcase.addEventListener("click", e => {
    const card = e.target.closest(".card");
    if (!card) return;
    const index = Array.from(showcase.children).indexOf(card);
    if (index < 0) return;

    // ハート
    const heart = e.target.closest(".icon-heart");
    if (heart) {
      heart.classList.toggle("liked");
      const fill = heart.classList.contains("liked") ? "red" : "none";
      const stroke = heart.classList.contains("liked") ? "red" : "#000";
      const path = heart.querySelector("path");
      if (path) {
        path.setAttribute("fill", fill);
        path.setAttribute("stroke", stroke);
      }
      items[index].liked = heart.classList.contains("liked");
      return;
    }

    // 保存アイコン
    const save = e.target.closest(".icon-save");
    if (save) {
      save.classList.toggle("saved");
      const path = save.querySelector("path");
      if (path) {
        path.setAttribute("fill", save.classList.contains("saved") ? "#000" : "none");
        path.setAttribute("stroke", "#000");
      }
      items[index].saved = save.classList.contains("saved");
      return;
    }

    // 商品リンク編集
    const editBtn = e.target.closest(".edit-link-btn");
    const linkEl = e.target.closest(".link-display");
    if (editBtn || linkEl) {
      const linkTarget = editBtn ? card.querySelector(".link-display") : linkEl;
      const newLink = prompt("商品リンクを入力してください", linkTarget.getAttribute("href"));
      if (newLink) {
        const finalLink = newLink.startsWith("http") ? newLink : "https://" + newLink;
        linkTarget.setAttribute("href", finalLink);
        linkTarget.textContent = finalLink;
        items[index].link = finalLink;
      }
      return;
    }

    // 画像アップロード
    const imageEl = e.target.closest(".image");
    if (!imageEl || !itemImgInput) return;
    const imgEl = imageEl.querySelector("img");
    itemImgInput.addEventListener("change", function handler(event) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        imgEl.src = ev.target.result;
        items[index].img = ev.target.result;
      };
      reader.readAsDataURL(file);
      itemImgInput.value = "";
      itemImgInput.removeEventListener("change", handler); // 一度きり
    });
    itemImgInput.click();
  });

  // 名前と値段の input 反映
  showcase.addEventListener("input", e => {
    const card = e.target.closest(".card");
    if (!card) return;
    const index = Array.from(showcase.children).indexOf(card);
    if (index < 0) return;

    if (e.target.classList.contains("card-name")) {
      items[index].name = e.target.textContent.trim();
    }

    if (e.target.classList.contains("card-price")) {
      items[index].price = e.target.textContent.trim();
    }
  });


  // =========================
// 保存ボタンクリック時にショーケース内容を反映して保存
// =========================
const saveBtn = document.getElementById("saveBtn");

if (saveBtn && showcase) {
  saveBtn.addEventListener("click", () => {
    // ショーケース内のカードをループ
    Array.from(showcase.children).forEach((card, index) => {
      if (!items[index]) return;

      const imgEl = card.querySelector("img");
      const nameEl = card.querySelector(".card-name, .modern-name");
      const priceEl = card.querySelector(".card-price");
      const linkEl = card.querySelector(".link-display");

      if (imgEl) items[index].img = imgEl.src;
      if (nameEl) items[index].name = nameEl.textContent.trim();
      if (priceEl) items[index].price = priceEl.textContent.trim();
      if (linkEl) items[index].link = linkEl.getAttribute("href") || linkEl.textContent.trim();
    });

    // 保存処理
    saveAppState();
    alert("保存しました！");
    console.log("ショーケース内容を反映して保存完了");
  });
}


/* =========================
   編集バー・ポップアップ改良版
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
    closeAllPopups(); // スライド中は全ポップアップを隠す
  });
}

// ポップアップ位置関数（チラつき防止版）
function positionPopup(btn, popup) {
  if (!btn || !popup) return;

  // 一旦非表示のままサイズを取得
  popup.style.visibility = 'hidden';
  popup.style.display = 'block';

  const popupWidth = popup.offsetWidth;
  const popupHeight = popup.offsetHeight;

  const btnRect = btn.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // 左右位置：ボタン中央
  let left = btnRect.left + (btnRect.width - popupWidth) / 2;
  left = Math.max(4, Math.min(left, viewportWidth - popupWidth - 4));

  // 上下位置：ボタン下、はみ出す場合は上に表示
  let top = btnRect.bottom + 6;
  if (top + popupHeight > viewportHeight - 4) {
    top = btnRect.top - popupHeight - 6;
    top = Math.max(4, top);
  }

  popup.style.left = `${left}px`;
  popup.style.top = `${top}px`;

  // 表示を戻す
  popup.style.visibility = '';
  popup.style.display = 'block';
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
});

// 画面空白タップで全ポップアップを閉じる
document.body.addEventListener('click', closeAllPopups);

// 画面リサイズ時にアクティブポップアップを再配置
window.addEventListener('resize', () => {
  Object.values(popupMap).forEach(popupId => {
    const popup = document.getElementById(popupId);
    if (popup && popup.classList.contains('active')) {
      const btnId = Object.keys(popupMap).find(key => popupMap[key] === popupId);
      const btn = document.getElementById(btnId);
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


// =========================
// ローカル保存 読み込み
// =========================
function loadAppState() {
  const saved = localStorage.getItem("recomenState");
  if (!saved) return;

  try {
    const state = JSON.parse(saved);

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

    if (state.items && Array.isArray(state.items)) items = state.items;

    console.log("保存データ読み込み完了");

  } catch (e) {
    console.error("読み込み失敗:", e);
  }
}

// =========================
// ローカル保存 保存処理
// =========================
function saveAppState() {
  try {
    const state = {
      items: items || [],

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
    console.log("全部保存完了");

  } catch (e) {
    console.error("保存失敗:", e);
  }
}


// =========================
// SVG アイコン
// =========================
function heartIcon(item) {
  return `
    <svg class="icon-heart ${item.liked ? 'active' : ''}" viewBox="0 0 24 24">
      <path d="M20.8 4.6a5 5 0 0 0-7.1 0L12 6.3l-1.7-1.7
        a5 5 0 0 0-7.1 7.1L12 21l8.8-9.3
        a5 5 0 0 0 0-7.1z"/>
    </svg>
  `;
}

function commentIcon() {
  return `
    <svg class="icon-comment" viewBox="0 0 24 24">
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7
        a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>
    </svg>
  `;
}

function shareIcon() {
  return `
    <svg class="icon-share" viewBox="0 0 24 24">
      <path d="M22 2L11 13"/>
      <path d="M22 2L15 22l-4-9-9-4z"/>
    </svg>
  `;
}

function saveIcon(item) {
  return `
    <svg class="icon-save ${item.saved ? 'active' : ''}" viewBox="0 0 24 24">
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

// ===============================
// アイテム画像アップロード用
// ===============================
function setupItemImageUpload(itemIndex) {
  const inputEl = document.getElementById('itemImgInput');
  if (!inputEl) return;

  inputEl.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 300;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = Math.round(height * maxSize / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round(width * maxSize / height);
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const smallDataUrl = canvas.toDataURL('image/jpeg', 0.8);

        // 配列に保存
        items[itemIndex].img = smallDataUrl;

        // カード再描画
        renderCards();
      };
      img.src = ev.target.result;
    };

    reader.readAsDataURL(file);
    inputEl.value = '';
  });
}


// ===============================
// アナウンスバー安全スクロール
// ===============================
const announcementToggle = document.getElementById('announcementToggle');
const bannerTextInput = document.getElementById('bannerTextInput');
const announcementBar = document.getElementById('announcementBar');
const bannerText = announcementBar?.querySelector('.banner-text');

if (announcementToggle && announcementBar && bannerText && bannerTextInput) {

  announcementBar.style.display = announcementToggle.checked ? 'flex' : 'none';

  announcementToggle.addEventListener('change', e => {
    announcementBar.style.display = e.target.checked ? 'flex' : 'none';
  });

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
    if (!textWidth) return;

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

  alert("JSは最後まで動いてる！");