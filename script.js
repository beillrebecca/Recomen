// =========================
// 🔴 データ本体（超重要）
// =========================
items = [
  {
    id: 1,
    name: "アイテム1",
    price: "¥0",
    link: "",
    img: "",
    liked: false,
    saved: false,
    clicks: 0
  },
  {
    id: 2,
    name: "アイテム2",
    price: "¥0",
    link: "",
    img: "",
    liked: false,
    saved: false,
    clicks: 0
  },
  {
    id: 3,
    name: "アイテム3",
    price: "¥0",
    link: "",
    img: "",
    liked: false,
    saved: false,
    clicks: 0
  },
  {
    id: 4,
    name: "アイテム4",
    price: "¥0",
    link: "",
    img: "",
    liked: false,
    saved: false,
    clicks: 0
  }
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
// ショーケース描画（追加ボタン込み）
// =========================
function renderShowcaseWithAddButton() {
  const showcase = document.getElementById("showcase");
  if (!showcase) return;

  showcase.innerHTML = "";

  items.forEach(item => {
    showcase.appendChild(createCard(item));
  });

  // 最後に追加ボタンを入れる
  showcase.innerHTML += `
    <div class="showcase-add-card-wrapper">
      <button id="addCardBtn" class="showcase-add-card-btn">
        ＋ 新しいアイテムを追加
      </button>
    </div>
  `;
}

// =========================
// 保存データ読み込み
// =========================
function loadAppState() {
  const saved = localStorage.getItem("recomenState");

  if (saved) {
    try {
      const state = JSON.parse(saved);

      if (state.items && state.items.length > 0) {
        items = state.items;
      } else {
        items = getDefaultItems();
      }
      
      document.getElementById("headerImg").src =
      state.headerImg || document.getElementById("headerImg").src;

      document.getElementById("avatarImg").src =
      state.avatarImg || document.getElementById("avatarImg").src;

      document.getElementById("profileName").textContent =
      state.profileName || "プロフィール名";

      document.getElementById("profileBio").textContent =
      state.profileBio || "プロフィール紹介";

    } catch (e) {
      console.error("保存データ読み込み失敗", e);
      items = getDefaultItems();
    }

  } else {
    items = getDefaultItems();
  }

  // 最低4枚にする
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

  renderShowcaseWithAddButton();
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
      link: card.querySelector(".card-link-input")?.value || "",
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
// 共通関数
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
// DOMContentLoaded 内にまとめて初期化
// =========================
document.addEventListener("DOMContentLoaded", () => {
  console.log("JS読み込まれた");

  // カラーピッカー初期化
  initColorPickers();

  // フォント変更
  const fontSelect = document.getElementById('fontSelect');
  if (fontSelect) fontSelect.addEventListener('change', e => document.documentElement.style.setProperty('--font-family', e.target.value));

  // 共通画像アップロード
  setupImageUpload(document.getElementById('headerImg'), document.getElementById('headerImgInput'));
  setupImageUpload(document.getElementById('avatarImg'), document.getElementById('avatarImgInput'));

  // 保存ボタン
  const saveBtn = document.getElementById("saveBtn");
  if(saveBtn) saveBtn.addEventListener("click", saveAppState_FULL);

  // データ読み込み
  loadAppState();

  // カードクリック操作
  initCardClicks();

  // カスタムバー + 編集項目表示
  initEditToggleAndPopups();

  // テーマ切替
  initThemeSwitch();

  // アナウンスバースクロール
  initAnnouncementBar();

  // フォローモーダル
  initFollowModal();
});


// =========================
// カードクリック操作
// =========================
let activeCard = null; // 画像を貼るカードを保持

function initCardClicks() {
  const showcaseEl = document.getElementById("showcase");
  if (!showcaseEl) return;

  const itemImgInput = document.getElementById("itemImgInput");
  if (itemImgInput && !itemImgInput.dataset.init) {
    // 画像選択時の処理は一度だけ登録
    itemImgInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (!file || !activeCard) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        const imgTag = activeCard.querySelector("img");
        if (imgTag) imgTag.src = ev.target.result;
      };
      reader.readAsDataURL(file);

      itemImgInput.value = "";
      activeCard = null; // 次回に備えてリセット
    });
    itemImgInput.dataset.init = 'true';
  }

  showcaseEl.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (!card) return;
    const index = Array.from(showcaseEl.children).indexOf(card);
    if (!items[index]) return;

    // ❤️ ハート
    const heart = e.target.closest(".icon-heart");
    if (heart) {
      items[index].liked = !items[index].liked;
      heart.classList.toggle("liked", items[index].liked);
      const path = heart.querySelector("path");
      if (path) {
        path.setAttribute("fill", items[index].liked ? "red" : "none");
        path.setAttribute("stroke", items[index].liked ? "red" : "#000");
      }
      return;
    }

    // 💾 保存アイコン
    const save = e.target.closest(".icon-save");
    if (save) {
      items[index].saved = !items[index].saved;
      save.classList.toggle("saved", items[index].saved);
      const path = save.querySelector("path");
      if (path) path.setAttribute("fill", items[index].saved ? "#000" : "none");
      return;
    }

    // 🖼 画像アップロード
    if (e.target.closest(".image") && itemImgInput) {
      activeCard = card;     // クリックしたカードを保持
      itemImgInput.click();  // ファイル選択ダイアログを開く
      return;
    }

    // ✏️ アイテム名編集
    const nameEl = e.target.closest(".card-name");
    if (nameEl) {
      nameEl.focus(); // contenteditableなのでフォーカスで編集可能
      return;
    }

    // 💰 値段編集
    const priceEl = e.target.closest(".card-price");
    if (priceEl) {
      const newPrice = prompt("価格を入力してね", priceEl.textContent);
      if (newPrice !== null) {
        priceEl.textContent = newPrice;
        items[index].price = newPrice;
      }
      return;
    }

    // 🔗 商品リンク → ポップアップで編集
    const linkEl = e.target.closest(".card-link-input");
    if (linkEl) {
      showLinkEditPopup(index);
      return;
    }
  });
}

// ポップアップ表示関数（商品リンク編集）
function showLinkEditPopup(index) {
  const item = items[index];
  const popup = document.getElementById("linkEditPopup");
  const input = popup.querySelector("input");
  const btn = popup.querySelector("button");

  input.value = item.link || "";
  popup.style.display = "block";
  input.focus();

  btn.onclick = () => {
    let newLink = input.value.trim();
    if (newLink && !newLink.startsWith("http")) {
      newLink = "https://" + newLink;
    }

    item.link = newLink;

    // カード内に反映
    const card = document.getElementById("showcase").children[index];
    const linkInput = card.querySelector(".card-link-input");
    if (linkInput) linkInput.value = newLink;

    popup.style.display = "none";
  };
}

  // =========================
  // 保存ボタン
  // =========================
  const saveBtn = document.getElementById("saveBtn");
  if (saveBtn) saveBtn.addEventListener("click", saveAppState_FULL);

  // =========================
  // データ読み込み
  // =========================
  loadAppState();

  // =========================
  // カードクリック操作
  // =========================
  initCardClicks();

  // =========================
  // カスタムバー + 編集項目表示
  // =========================
  const editToggle = document.getElementById('editToggle');
const editItems = document.getElementById('editItems');

if (editToggle && editItems) {

  editToggle.addEventListener('click', (e) => {
    e.stopPropagation();  // 編集ボタンクリックだけで閉じないように
    editItems.classList.toggle('active'); // activeクラスを付け外し
  });

  
  // 画面クリックで閉じる
document.addEventListener("click", (e) => {
  const target = e.target;
  if (
    target.closest("#editItems") || 
    target.closest("#editToggle") ||
    Object.keys(popupMap).some(id => target.closest("#" + id)) ||
    Object.values(popupMap).some(id => target.closest("#" + id)) ||
    target.closest("#showcase")
  ) return;
  
  closeAllPopups();
  editItems?.classList.remove("active");
});

  // =========================
// 編集項目ボタンのポップアップ管理（位置固定版）
// =========================
const popupMap = {
  themeButton: "themePopup",
  styleButton: "stylePopup",
  announcementButton: "announcementPopup"
};

function closeAllPopups() {
  Object.values(popupMap).forEach((popupId) => {
    const popup = document.getElementById(popupId);
    if (popup) {
      popup.style.display = "none";
      popup.classList.remove("active");
    }
  });
}

function positionPopup(btn, popup) {
  popup.style.display = "block";
  popup.style.visibility = "hidden";

  const rect = btn.getBoundingClientRect();
  const popupWidth = popup.offsetWidth;
  const popupHeight = popup.offsetHeight;

  let left = rect.left;
  let top = rect.bottom + 6;

  left = Math.max(8, Math.min(left, window.innerWidth - popupWidth - 8));
  top = Math.min(top, window.innerHeight - popupHeight - 8);

  popup.style.left = left + "px";
  popup.style.top = top + "px";

  popup.style.visibility = "visible";
}

Object.entries(popupMap).forEach(([btnId, popupId]) => {
  const btn = document.getElementById(btnId);
  const popup = document.getElementById(popupId);
  if (!btn || !popup) return;

  btn.addEventListener('click', e => {
  e.stopPropagation();

  Object.values(popupMap).forEach(pid => {
    const p = document.getElementById(pid);
    if (p) {
      p.classList.remove("active");
      p.style.display = "none";
    }
  });

  popup.classList.add("active");
  positionPopup(btn, popup);
});

  popup.addEventListener("click", (e) => e.stopPropagation());
});

// 画面クリックで閉じる
document.addEventListener("click", () => {
  closeAllPopups();
});

  // =========================
  // テーマ切替（カード画像保持）
  // =========================
  const showcaseEl = document.getElementById("showcase");
  document.querySelectorAll('input[name="theme"]').forEach(radio => {
    radio.addEventListener('change', e => {
      if (!showcaseEl) return;
      const existingImages = Array.from(showcaseEl.querySelectorAll('.card img')).map(img => img.src);
      document.body.classList.toggle('theme-natural', e.target.value === 'natural');
      document.body.classList.toggle('theme-modern', e.target.value !== 'natural');
      showcaseEl.querySelectorAll('.card img').forEach((img, i) => {
        if (existingImages[i]) img.src = existingImages[i];
      });
    });
  });


  // =========================
  // アナウンスバー（スクロール）
  // =========================
  const announcementBar = document.getElementById('announcementBar');
  const bannerText = announcementBar?.querySelector('.banner-text');
  const bannerTextInput = document.getElementById('bannerTextInput');

  if (announcementBar && bannerText && bannerTextInput) {
    let pos = announcementBar.offsetWidth;
    const speed = 1;

    function scroll() {
      const textWidth = bannerText.offsetWidth;
      pos -= speed;
      if (pos <= -textWidth) pos = announcementBar.offsetWidth;
      bannerText.style.left = pos + 'px';
      requestAnimationFrame(scroll);
    }
    scroll();

    bannerTextInput.addEventListener('input', () => {
      bannerText.textContent = bannerTextInput.value;
      pos = announcementBar.offsetWidth;
    });

    window.addEventListener('resize', () => pos = announcementBar.offsetWidth);
  }


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
  // 共通画像アップロード
  // =========================
  setupImageUpload(document.getElementById('headerImg'), document.getElementById('headerImgInput'));
  setupImageUpload(document.getElementById('avatarImg'), document.getElementById('avatarImgInput'));
});