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
        <span class="link-display">${item.link || "リンクを入力"}</span>
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
  if (!itemImgInput.dataset.init) {
    itemImgInput.addEventListener('change', event => {
      const file = event.target.files[0];
      if (!file || !activeCard) return;

      const reader = new FileReader();
      reader.onload = ev => {
        const imgTag = activeCard.querySelector("img");
        if (imgTag) imgTag.src = ev.target.result;
      };
      reader.readAsDataURL(file);

      itemImgInput.value = "";
      activeCard = null;
    });
    itemImgInput.dataset.init = 'true';
  }

  showcaseEl.addEventListener("click", e => {

  // 🖼 画像
  if (e.target.closest(".image")) {
    e.stopPropagation();
    activeCard = e.target.closest(".card");
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

  // 🔗 リンク
  const linkBtn = e.target.closest(".edit-link-btn");
  if (linkBtn) {
    const card = e.target.closest(".card");
    showLinkEditPopup(card);
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
  popup.style.display = "block";
  input.focus();

  btn.onclick = () => {
    let newLink = input.value.trim();
    if (newLink && !newLink.startsWith("http")) newLink = "https://" + newLink;

    // カード内表示
    if (linkDisplay) linkDisplay.textContent = newLink || "リンクを入力";

    // items 配列にも反映
    const showcaseEl = document.getElementById("showcase");
    const index = Array.from(showcaseEl.children).indexOf(card);
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
      items,
      headerImg: document.getElementById("headerImg")?.src || null,
      avatarImg: document.getElementById("avatarImg")?.src || null,
      profileName: document.getElementById("profileName")?.textContent || "",
      profileBio: document.getElementById("profileBio")?.textContent || ""
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
function setupImageUpload(imgEl, inputEl) {
  if (!imgEl || !inputEl) return;
  imgEl.addEventListener('click', () => inputEl.click());
  inputEl.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => imgEl.src = ev.target.result;
    reader.readAsDataURL(file);
  });
}

function initColorPickers() {
  const colors = ["#ffffff","#f28b82","#fbbc04","#fff475","#ccff90","#a7ffeb","#cbf0f8","#aecbfa","#d7aefb","#fdcfe8","#e6c9a8","#e8eaed"];
  const pickers = ["bgPicker","fontColorPicker","profileBgPicker","announcementBgPicker"];
  pickers.forEach(pickerId => {
    const container = document.getElementById(pickerId);
    if (!container) return;
    container.innerHTML = "";
    container.classList.add("color-picker");
    colors.forEach(color => {
      const div = document.createElement("div");
      div.style.backgroundColor = color;
      div.addEventListener("click", () => {
        container.querySelectorAll("div").forEach(d => d.classList.remove("selected"));
        div.classList.add("selected");
        applyColor(pickerId, color);
      });
      container.appendChild(div);
    });
  });
}

function applyColor(pickerId, color) {
  switch(pickerId){
    case "bgPicker": document.body.style.backgroundColor = color; break;
    case "fontColorPicker": document.body.style.color = color; break;
    case "profileBgPicker": const profile=document.getElementById("profileSection"); if(profile) profile.style.backgroundColor=color; break;
    case "announcementBgPicker": const banner=document.getElementById("announcementBar"); if(banner) banner.style.backgroundColor=color; break;
  }
}

// =========================
// カスタムバー編集開閉
// =========================
const editToggle = document.getElementById('editToggle');
const editItems = document.getElementById('editItems');

if (editToggle && editItems) {
  editToggle.addEventListener('click', e => {
    e.stopPropagation();
    if (editItems.classList.contains('active')) {
      editItems.classList.remove('active');
      editItems.style.maxHeight = '0';
    } else {
      editItems.classList.add('active');
      editItems.style.maxHeight = editItems.scrollHeight + 'px';
    }
  });

  document.addEventListener("click", e => {
    if (!e.target.closest("#editItems") && !e.target.closest("#editToggle")) {
      editItems.classList.remove("active");
      editItems.style.maxHeight = '0';
    }
  });
}

// =========================
// DOMContentLoaded 初期化
// =========================
document.addEventListener("DOMContentLoaded", () => {
  console.log("JS読み込まれた");

  initColorPickers();

  const fontSelect = document.getElementById('fontSelect');
  if (fontSelect) fontSelect.addEventListener('change', e => document.documentElement.style.setProperty('--font-family', e.target.value));

  setupImageUpload(document.getElementById('headerImg'), document.getElementById('headerImgInput'));
  setupImageUpload(document.getElementById('avatarImg'), document.getElementById('avatarImgInput'));

  loadAppState();
  initCardClicks();

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
      // 他のポップアップは閉じる
      document.querySelectorAll('.popup').forEach(p => { if(p!==popup) p.style.display='none'; });
      // トグル表示
      popup.style.display = (popup.style.display==='block') ? 'none' : 'block';
    });
  });

  // ポップアップ外クリックで閉じる
  document.addEventListener('click', e => {
    if(!e.target.closest('.popup') && !Object.keys(popups).some(id => e.target.closest('#'+id))) {
      document.querySelectorAll('.popup').forEach(p => p.style.display='none');
    }
  });

  // アナウンスバー入力反映
  const bannerInput = document.getElementById('bannerTextInput');
  const bannerSpan = document.querySelector('#announcementBar .banner-text');
  if(bannerInput && bannerSpan){
    bannerInput.addEventListener('input', e => {
      bannerSpan.textContent = e.target.value;
    });
  }
});