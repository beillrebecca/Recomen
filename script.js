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
let currentCard = null;

function showLinkEditPopup(card) {
  const modal = document.getElementById("linkModal");
  const input = document.getElementById("linkModalInput");
  const btn = document.getElementById("linkModalSaveBtn");

  currentCard = card;

  const linkDisplay = card.querySelector(".link-display");
  input.value = linkDisplay ? linkDisplay.textContent : "";

  modal.classList.add("active");
  input.focus();

  btn.onclick = () => {
    let newLink = input.value.trim();
    if (newLink && !newLink.startsWith("http")) {
      newLink = "https://" + newLink;
    }

    if (linkDisplay) {
      linkDisplay.textContent = newLink || "リンクを入力";
      linkDisplay.href = newLink || "#";
    }

    const showcaseEl = document.getElementById("showcase");
    const cards = Array.from(showcaseEl.querySelectorAll(".card"));
    const index = cards.indexOf(currentCard);
    if (items[index]) items[index].link = newLink;

    modal.classList.remove("active");
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
  e.preventDefault(); // ページ遷移を止める

  const card = e.target.closest(".card");
  const popup = document.getElementById("linkEditPopup");
  
  // ポップアップを表示する関数がある場合
  if (typeof showLinkEditPopup === "function") {
    showLinkEditPopup(card);
  }

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
    clicks: parseInt(card.querySelector(".modern-clicks")?.textContent || "0"),
    fontColor: getComputedStyle(card.querySelector(".card-name"))?.color || ""
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
      fontColor: (() => {
      const profile = document.getElementById("profileName");
      if (profile) return getComputedStyle(profile).color;

      const card = document.querySelector(".card-name");
      if (card) return getComputedStyle(card).color;

      return "";
     })(),
     fontColorVar: (() => {
     const stats = document.querySelector(".profile-stats");
     if (stats) return getComputedStyle(stats).getPropertyValue('--font-color').trim();
     return "";
     })(),
  
     profileBg: getComputedStyle(document.getElementById('profileSection'))?.backgroundColor || "#ffffff",

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
      
      // =========================
// 🔴 スタイル復元
// =========================

// テーマ
if (state.theme) {
  document.body.classList.remove('theme-natural', 'theme-modern');
  document.body.classList.add(`theme-${state.theme}`);

  const radio = document.querySelector(`input[name="theme"][value="${state.theme}"]`);
  if (radio) radio.checked = true;
}

// ショーケース背景
if (state.showcaseBg) {
  const showcase = document.getElementById("showcase");
  if (showcase) showcase.style.backgroundColor = state.showcaseBg;
}

// フォント
if (state.fontFamily) {
  document.documentElement.style.setProperty('--font-family', state.fontFamily);

  const fontSelect = document.getElementById('fontSelect');
  if (fontSelect) fontSelect.value = state.fontFamily;
}

// フォントカラー
if (state.fontColor) {
  // プロフィール名・紹介文
  const profileName = document.getElementById('profileName');
  const profileBio = document.getElementById('profileBio');
  if (profileName) profileName.style.color = state.fontColor;
  if (profileBio) profileBio.style.color = state.fontColor;

  // カードの文字
  document.querySelectorAll('.card-name, .card-price').forEach(el => {
    if (el) el.style.color = state.fontColor;
  });
  
  items.forEach((item, index) => {
    const card = document.querySelectorAll(".card")[index];
    if (!card) return;
    const nameEl = card.querySelector(".card-name");
    const priceEl = card.querySelector(".card-price");
    if (nameEl) nameEl.style.color = item.fontColor || "";
    if (priceEl) priceEl.style.color = item.fontColor || "";
  });
}

// フォローフォロワー表示はCSS変数で制御
if (state.fontColorVar) {
  document.querySelectorAll('.profile-stats').forEach(el => {
    if (el) el.style.setProperty('--font-color', state.fontColorVar);
  });
}

// プロフィール背景
if (state.profileBg) {
  const profile = document.getElementById('profileSection');
  if (profile) {
    profile.style.backgroundColor = state.profileBg;
    profile.style.setProperty('--profile-bg', state.profileBg);
  }
}

// =========================
// 🔴 アナウンスバー復元
// =========================

const bar = document.getElementById("announcementBar");
const toggle = document.getElementById("announcementToggle");

// ON/OFF
if (bar && toggle) {
  toggle.checked = state.announcementVisible;

  // 👇 これだけでOK（表示もここで処理される）
  toggle.dispatchEvent(new Event('change'));
}

// テキスト
const bannerText = document.querySelector('#announcementBar .banner-text');
if (bannerText) {
  bannerText.textContent = state.announcementText || "";
}

// 背景色
if (state.announcementBg && bar) {
  bar.style.backgroundColor = state.announcementBg;
}

// 文字色
if (state.announcementFontColor && bannerText) {
  bannerText.style.color = state.announcementFontColor;
}


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
    if(profileName) profileName.style.setProperty('color', hex);
    if(profileBio) profileBio.style.setProperty('color', hex);

    // カード
    document.querySelectorAll('.card-name, .card-price').forEach(el => {
      el.style.setProperty('color', hex);
    });

    // フォロー/フォロワー表示（CSS変数を更新）
    document.querySelectorAll('.profile-stats').forEach(el => {
      el.style.setProperty('--font-color', hex);
    });
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
    },
    {
  el: '#profileBgPickerBox',
  apply: color => {
    const hex = color.toHEXA().toString();
    const profile = document.getElementById('profileSection');
    if (profile) {
      // !important を付けて強制的に背景色を上書き
      profile.style.setProperty('background-color', hex, 'important');
      state.profileBg = hex; // ←これを追加
    }
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
      position: 'top',
      closeOnScroll: false,
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

    // 保存
    pickr.on('save', color => {
      cfg.apply(color);
      pickr.hide();
    });

    // 👇 これを中に入れるのがポイント！！
    pickr.on('show', () => {
  const app = pickr.getRoot().app;
  if (!app) return;

  app.style.position = 'fixed';

  const rect = app.getBoundingClientRect();

  let top = rect.top;
  let left = rect.left;

  // 下にはみ出たら上へ
  if (rect.bottom > window.innerHeight) {
    top = window.innerHeight - rect.height - 8;
  }

  // 上にはみ出たら下へ
  if (top < 8) {
    top = 8;
  }

  // 左右も制御（←これ重要）
  if (left < 8) left = 8;
  if (left + rect.width > window.innerWidth) {
    left = window.innerWidth - rect.width - 8;
  }

  app.style.top = `${top}px`;
  app.style.left = `${left}px`;
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
// リンク編集モーダル：背景クリックで閉じる
// =========================
document.getElementById("linkModal").addEventListener("click", e => {
  if (e.target.id === "linkModal") {
    e.currentTarget.classList.remove("active");
  }
});
  
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

    // 👇 これ追加！！（Pickr開いてる時は何もしない）
    if (document.querySelector('.pcr-app')) return;

    const btnId = Object.keys(popups).find(key => popups[key] === popup.id);
    if (!btnId) return;

    const btn = document.getElementById(btnId);
    if (!btn) return;
    
    // フォントカラー再適用
    const saved = JSON.parse(localStorage.getItem("recomenState") || "{}");
    if (saved.fontColor) {
    document.querySelectorAll('.card-name, .card-price').forEach(el => {
    el.style.color = saved.fontColor;
  });
}

    showPopupAboveButton(popup, btn);
  });
});


});

