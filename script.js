window.onerror = function(msg, url, line) {
  alert("エラー発生👇\n" + msg + "\n行:" + line);
};

// ========================
// 🔴 データ本体（超重要）
// =========================
let items = [
  { id: 1, name: "アイテム1", price: "¥0", link: "", img: "", liked: false, saved: false, clicks: 0 },
  { id: 2, name: "アイテム2", price: "¥0", link: "", img: "", liked: false, saved: false, clicks: 0 },
  { id: 3, name: "アイテム3", price: "¥0", link: "", img: "", liked: false, saved: false, clicks: 0 },
  { id: 4, name: "アイテム4", price: "¥0", link: "", img: "", liked: false, saved: false, clicks: 0 }
];

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
// 🔗 カードリンク編集ポップアップ（新規追加）
// =========================
function showLinkEditPopupForCard(popupEl, buttonEl, card) {
  // 仮表示して高さを取得
  popupEl.style.visibility = 'hidden';
  popupEl.classList.add('active');

  const rect = buttonEl.getBoundingClientRect();
  const top = rect.top + window.scrollY - popupEl.offsetHeight - 8;
  const left = rect.left + window.scrollX + rect.width / 2 - popupEl.offsetWidth / 2;

  popupEl.style.top = `${top}px`;
  popupEl.style.left = `${left}px`;
  popupEl.style.visibility = 'visible';

  const input = popupEl.querySelector("input");
  const btn = popupEl.querySelector("button");
  const linkDisplay = card.querySelector(".link-display");

  input.value = linkDisplay ? linkDisplay.textContent : "";
  input.focus();

  // 既存のクリックイベントを削除してからセット
  btn.onclick = null;
  btn.onclick = () => {
    let newLink = input.value.trim();
    if (newLink && !newLink.startsWith("http")) newLink = "https://" + newLink;
    if (linkDisplay) linkDisplay.textContent = newLink || "リンクを入力";

    // items配列にも反映
    const showcaseEl = document.getElementById("showcase");
    const index = Array.from(showcaseEl.children).indexOf(card);
    if (items[index]) items[index].link = newLink;

    popupEl.classList.remove('active');
  };
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

      <!-- ポップアップ式リンク入力 -->
      <div class="link-wrapper">
        <a class="link-display" href="${item.link || '#'}" target="_blank">
         ${item.link || "リンクを入力"}
        </a>
        <button class="edit-link-btn">編集</button>
      </div>
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
// ショーケース描画
// =========================
function renderShowcaseLight() {
  const showcase = document.getElementById("showcase");
  if (!showcase) return;

  showcase.innerHTML = ""; // 念のためリセット

  items.forEach(item => showcase.appendChild(createCard(item)));

  // 「新しいアイテム追加」ボタン
  const addWrapper = document.createElement("div");
  addWrapper.className = "showcase-add-card-wrapper";
  const addBtn = document.createElement("button");
  addBtn.id = "addCardBtn";
  addBtn.className = "showcase-add-card-btn";
  addBtn.textContent = "＋ 新しいアイテムを追加";
  addWrapper.appendChild(addBtn);
  showcase.appendChild(addWrapper);


  addBtn.addEventListener("click", () => {
    const newItem = {
      id: Date.now(),
      name: `アイテム${items.length + 1}`,
      price: "¥0",
      link: "",
      img: "",
      liked: false,
      saved: false,
      clicks: 0
    };
    items.push(newItem);
    const newCard = createCard(newItem);
    showcase.insertBefore(newCard, addWrapper);
  });
}

// =========================
// カードクリック操作
// =========================
let activeCard = null;

function initCardClicks() {
  const showcaseEl = document.getElementById("showcase");
  if (!showcaseEl) return;

  const itemImgInput = document.getElementById("itemImgInput");
  if (!itemImgInput) return;

  // 画像アップロードイベントの初期化
  if (!itemImgInput.dataset.init) {
    itemImgInput.addEventListener('change', event => {
      const file = event.target.files[0];
      if (!file) return;

      if (!activeCard) {
        alert("画像を貼りたいカードを先にクリックしてください");
        itemImgInput.value = "";
        return;
      }

      const imgTag = activeCard.querySelector("img");
      if (!imgTag) {
        alert("カードに画像タグが見つかりません");
        itemImgInput.value = "";
        activeCard = null;
        return;
      }

      const reader = new FileReader();
      reader.onload = ev => {
        imgTag.src = ev.target.result;
      };
      reader.readAsDataURL(file);

      // リセット
      itemImgInput.value = "";
      activeCard = null;
    });
    itemImgInput.dataset.init = 'true';
  }

  // ショーケース内クリック処理
  showcaseEl.addEventListener("click", e => {
    
    if (e.target.closest('.pcr-app')) return;

    // 🖼 画像クリック
    const imageEl = e.target.closest(".image");
    if (imageEl) {
      e.stopPropagation();
      const card = imageEl.closest(".card");
      if (!card) return; // 念のため null チェック
      activeCard = card;

      // input ファイル選択を発火
      if (itemImgInput) itemImgInput.click();
      return;
    }


  // ❤️ ハート
  const heart = e.target.closest(".icon-heart");
  if (heart) {
    const path = heart.querySelector("path");

    heart.classList.toggle("liked");

    if (path) {
      if (heart.classList.contains("liked")) {
        path.setAttribute("fill", "red");
        path.setAttribute("stroke", "red");
      } else {
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", "#000");
      }
    }
    return;
  }

  // 💾 保存
  const save = e.target.closest(".icon-save");
  if (save) {
    const path = save.querySelector("path");

    save.classList.toggle("saved");

    if (path) {
      path.setAttribute("fill", save.classList.contains("saved") ? "#000" : "none");
    }
    return;
  }

  // 💰 価格
  const priceEl = e.target.closest(".card-price");
  if (priceEl) {
    const newPrice = prompt("価格を入力してね", priceEl.textContent);
    if (newPrice !== null) priceEl.textContent = newPrice;
    return;
  }
  
  // 🔗 リンク（表示テキストをタップ）
  const linkEl = e.target.closest(".link-display");
  if (linkEl) {
  e.preventDefault(); // ← ページ遷移を止める
  const card = e.target.closest(".card");
  showLinkEditPopup(card);
  return;
  }

  // 🔗 リンク
  const linkBtn = e.target.closest(".edit-link-btn");
  if (linkBtn) {
  e.stopPropagation();
  const card = e.target.closest(".card");
  showLinkEditPopup(card); // ← 正しい関数名
  return;
  }


  // ✏️ 名前
  const nameEl = e.target.closest(".card-name");
  if (nameEl) {
    nameEl.focus();
    return;
  }

});
}

// =========================
// ポップアップリンク編集（カードDOM版）
// =========================
function showLinkEditPopup(card) {
  const popup = document.getElementById("linkEditPopup");
  const input = popup.querySelector("input");
  const btn = popup.querySelector("button");

  // 現在のリンクを取得
  const linkDisplay = card.querySelector(".link-display");
  input.value = linkDisplay ? linkDisplay.textContent : "";

  // ポップアップ表示
  popup.classList.add('active');
  input.focus();

  btn.onclick = () => {
    let newLink = input.value.trim();
    if (newLink && !newLink.startsWith("http")) newLink = "https://" + newLink;

    // カード内表示
    if (linkDisplay) {
    linkDisplay.textContent = newLink || "リンクを入力";
    linkDisplay.href = newLink || "#"; // ←これ追加
    }

    // items 配列にも反映
    const showcaseEl = document.getElementById("showcase");
    const cards = Array.from(showcaseEl.querySelectorAll(".card"));
    const index = cards.indexOf(card);
    if (items[index]) items[index].link = newLink;

    // ポップアップ非表示
    popup.style.display = "none";
  };
}

// =========================
// 保存（アプリ全体）
// =========================
function saveAppState_FULL() {
  try {
    const showcase = document.getElementById("showcase");
    const cards = showcase.querySelectorAll(".card");

    items = Array.from(cards).map((card, index) => ({
      id: items[index]?.id || Date.now() + index,
      name: card.querySelector(".card-name")?.textContent.trim() || "アイテム名",
      price: card.querySelector(".card-price")?.textContent.trim() || "¥0",
      link: card.querySelector(".link-display")?.textContent || "",
      img: card.querySelector("img")?.src || "",
      liked: card.querySelector(".icon-heart")?.classList.contains("liked") || false,
      saved: card.querySelector(".icon-save")?.classList.contains("saved") || false,
      clicks: parseInt(card.querySelector(".modern-clicks")?.textContent || "0")
    }));

    const state = {
      // 🔴 アイテム系
      items,

      // 🔴 プロフィール系
      headerImg: document.getElementById("headerImg")?.src || null,
      avatarImg: document.getElementById("avatarImg")?.src || null,
      profileName: document.getElementById("profileName")?.textContent || "",
      profileBio: document.getElementById("profileBio")?.textContent || "",

      // 🔴 テーマ
      theme: document.querySelector('input[name="theme"]:checked')?.value || "natural",

      // 🔴 スタイル
      showcaseBg: document.getElementById("showcase")?.style.backgroundColor || "",
      fontFamily: document.documentElement.style.getPropertyValue('--font-family') || "",
      fontColor: document.getElementById("profileName")?.style.color || "",
      profileBg: document.getElementById("profileSection")?.style.backgroundColor || "",

      // 🔴 アナウンスバー
      announcementVisible: document.getElementById("announcementToggle")?.checked || false,
      announcementText: document.querySelector('#announcementBar .banner-text')?.textContent || "",
      announcementBg: document.getElementById("announcementBar")?.style.backgroundColor || "",
      announcementFontColor: document.querySelector('#announcementBar .banner-text')?.style.color || ""
    };

    localStorage.setItem("recomenState", JSON.stringify(state));
    alert("保存しました");
  } catch (e) {
    alert("保存に失敗しました");
    console.error(e);
  }
}

// =========================
// 保存データ読み込み（軽量版対応）
// =========================
function getDefaultItems() {
  return [
    { id: 1, name: "アイテム1", price: "¥0", link: "", img: "", liked: false, saved: false, clicks: 0 },
    { id: 2, name: "アイテム2", price: "¥0", link: "", img: "", liked: false, saved: false, clicks: 0 },
    { id: 3, name: "アイテム3", price: "¥0", link: "", img: "", liked: false, saved: false, clicks: 0 },
    { id: 4, name: "アイテム4", price: "¥0", link: "", img: "", liked: false, saved: false, clicks: 0 }
  ];
}

function loadAppState() {
  const saved = localStorage.getItem("recomenState");
  if (saved) {
    try {
      const state = JSON.parse(saved);
      items = (state.items && state.items.length > 0) ? state.items : getDefaultItems();
      document.getElementById("headerImg").src = state.headerImg || document.getElementById("headerImg").src;
      document.getElementById("avatarImg").src = state.avatarImg || document.getElementById("avatarImg").src;
      document.getElementById("profileName").textContent = state.profileName || "プロフィール名";
      document.getElementById("profileBio").textContent = state.profileBio || "プロフィール紹介";
    } catch (e) {
      console.error("保存データ読み込み失敗", e);
      items = getDefaultItems();
    }
  } else {
    items = getDefaultItems();
  }

  // 最低4枚確保
  while (items.length < 4) {
    items.push({
      id: Date.now() + items.length,
      name: `アイテム${items.length + 1}`,
      price: "¥0",
      link: "",
      img: "",
      liked: false,
      saved: false,
      clicks: 0
    });
  }

  renderShowcaseLight();
}

// =========================
// 共通関数（画像アップロード・カラーピッカー）
// =========================
function initPickr() {
  const pickrConfigs = [
    // ショーケース背景だけに適用
    { 
      el: '#bgPickerBox',
    apply: color => {
      const hex = color.toHEXA().toString();
      const showcase = document.getElementById('showcase');
      if(showcase) showcase.style.backgroundColor = hex;
    }
  },
  {
      el: '#fontColorPickerBox',
  apply: color => {
    const hex = color.toHEXA().toString();

    // プロフィール
    const profileName = document.getElementById('profileName');
    const profileBio = document.getElementById('profileBio');
    if(profileName) profileName.style.color = hex;
    if(profileBio) profileBio.style.color = hex;

    // フォローモーダル文字
    document.querySelectorAll('.followers-modal, .following-modal').forEach(modal => {
      modal.style.color = hex;
    });

    // アイテム名と値段
    document.querySelectorAll('.card-name, .card-price').forEach(el => {
      el.style.color = hex;
    });

    // ⚠️ ポップアップや他のUIには影響しない
      }
    },
  {
    el: '#announcementFontColorPickerBox',
    apply: color => {
      const hex = color.toHEXA().toString();
      const bannerText = document.querySelector('#announcementBar .banner-text');
      if (bannerText) bannerText.style.color = hex;
    }
  },
  {
  el: '#announcementBgPickerBox',
  apply: color => {
    const hex = color.toHEXA().toString();
    const banner = document.getElementById('announcementBar');
    if (banner) banner.style.backgroundColor = hex;
  }
}
];

  pickrConfigs.forEach(cfg => {
    const el = document.querySelector(cfg.el);
    if (!el) return;

 const pickr = Pickr.create({
  el: el,
  theme: 'nano',
  default: '#ffffff',
  
  position: 'top', // ← これ追加（超重要）

  closeOnScroll: false,

  // 👇 超重要（これでズレ防止）
  appendTo: document.body,

  components: {
    preview: true,
    opacity: true,
    hue: true,
    interaction: {
      hex: true,
      rgba: true,
      input: true,
      save: true
    }
  }
});

    pickr.on('save', color => {
      cfg.apply(color);
      pickr.hide();
    });
  });
}



// =========================
// 画像アップロード共通関数
// =========================
function setupImageUpload(imgEl, inputEl) {
  if (!imgEl || !inputEl) return;

  inputEl.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
      imgEl.src = ev.target.result;
    };
    reader.readAsDataURL(file);

    // 入力をリセット
    inputEl.value = "";
  });

  // 画像クリックでファイル選択を開く
  imgEl.addEventListener('click', () => inputEl.click());
}

// =========================
// DOMContentLoaded 初期化
// =========================
document.addEventListener("DOMContentLoaded", () => {
  console.log("JS読み込まれた");


  const fontSelect = document.getElementById('fontSelect');
  if (fontSelect) fontSelect.addEventListener('change', e => document.documentElement.style.setProperty('--font-family', e.target.value));

  setupImageUpload(document.getElementById('headerImg'), document.getElementById('headerImgInput'));
  setupImageUpload(document.getElementById('avatarImg'), document.getElementById('avatarImgInput'));

  loadAppState();
  initCardClicks();
  
// =========================
// カスタムバー編集開閉
// =========================
const editToggle = document.getElementById('editToggle');
const editItems = document.getElementById('editItems');

if (editToggle && editItems) {
  editToggle.addEventListener('click', e => {
    e.stopPropagation();

    // ポップアップ閉じる
    document.querySelectorAll('.popup').forEach(p => p.classList.remove('active'));

    if (editItems.classList.contains('active')) {
      editItems.classList.remove('active');
      editItems.style.maxHeight = '0';
    } else {
      editItems.classList.add('active');
      editItems.style.maxHeight = editItems.scrollHeight + 'px';
    }
  });
}

// 共通関数：ボタンの真上にポップアップ表示
function showPopupAboveButton(popupEl, buttonEl) {
  popupEl.style.visibility = 'hidden';
  popupEl.classList.add('active');

  const rect = buttonEl.getBoundingClientRect();
  let top = rect.top - popupEl.offsetHeight - 8; // ボタンの上に8px余白
  let left = rect.left + rect.width / 2 - popupEl.offsetWidth / 2;
  
  // 👇 これ追加（超重要）
  if (top < 8) {
    top = rect.bottom + 8; // 下に出す
  }


  // 画面端に収める
  const minLeft = 8; // 左端の余白
  const maxLeft = window.innerWidth - popupEl.offsetWidth - 8; // 右端の余白
  if (left < minLeft) left = minLeft;
  if (left > maxLeft) left = maxLeft;

  popupEl.style.position = 'fixed';
  popupEl.style.top = `${top}px`;
  popupEl.style.left = `${left}px`;
  popupEl.style.visibility = 'visible';
}

// ポップアップ開閉処理（テーマ・スタイル・アナウンス）
const popups = {
  themeButton: 'themePopup',
  styleButton: 'stylePopup',
  announcementButton: 'announcementPopup'
};

Object.keys(popups).forEach(btnId => {
  const btn = document.getElementById(btnId);
  const popup = document.getElementById(popups[btnId]);
  if (!btn || !popup) return;

  btn.addEventListener('click', e => {
    e.stopPropagation();

    // 他のポップアップを閉じる
    document.querySelectorAll('.popup').forEach(p => {
      if (p !== popup) p.classList.remove('active');
    });

    // 今クリックしたボタンの真上に表示
    showPopupAboveButton(popup, btn);

    // ❌ この部分を削除
    // if (editItems.classList.contains('active')) {
    //   editItems.classList.remove('active');
    //   editItems.style.maxHeight = '0';
    // }
  });
});

// ※ 外クリックで閉じる処理は削除！
// ショーケースや他の部分を触ってもポップアップは閉じない


  // アナウンスバー入力反映
  const bannerInput = document.getElementById('bannerTextInput');
  const bannerSpan = document.querySelector('#announcementBar .banner-text');
  if(bannerInput && bannerSpan){
    bannerInput.addEventListener('input', e => {
      bannerSpan.textContent = e.target.value;
    });
  }
  
  // =========================
// テーマ切替
// =========================
document.querySelectorAll('input[name="theme"]').forEach(radio => {
  radio.addEventListener('change', e => {
    const theme = e.target.value;

    // 一旦リセット
    document.body.classList.remove('theme-natural', 'theme-modern');

    // 適用
    document.body.classList.add(`theme-${theme}`);
  });
});

// 初期テーマ（まだ何も付いてない時だけ）
if (!document.body.classList.contains('theme-natural') &&
    !document.body.classList.contains('theme-modern')) {
  document.body.classList.add('theme-natural');
}


  // =========================
// 保存ボタンイベント
// =========================
const saveBtn = document.getElementById("saveBtn");
if (saveBtn) {
  saveBtn.addEventListener("click", () => {
    saveAppState_FULL();
  });
}

initPickr();  // カラーピッカーを初期化

window.addEventListener('scroll', () => {
  document.querySelectorAll('.popup.active').forEach(popup => {
    const btnId = Object.keys(popups).find(key => popups[key] === popup.id);
    if (!btnId) return;

    const btn = document.getElementById(btnId);
    if (!btn) return;

    showPopupAboveButton(popup, btn);
  });
});



});

