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

  // ダミーデータ（必須）
  let items = [
    {
      name: "テスト",
      price: "¥1000",
      link: "https://example.com",
      img: "",
      liked: false,
      saved: false
    }
  ];

  // =========================
  // inputイベント
  // =========================
  showcase.addEventListener("input", (e) => {
    console.log("input発火");

    const card = e.target.closest(".card");
    if (!card) return;

    const index = Array.from(showcase.children).indexOf(card);
    if (index < 0) return;

    if (e.target.classList.contains("card-name")) {
      items[index].name = e.target.innerText.trim();
    }

    if (e.target.classList.contains("card-price")) {
      items[index].price = e.target.innerText.trim();
    }

    if (e.target.classList.contains("link-display")) {
      let newLink = e.target.innerText.trim();
      if (!newLink.startsWith("http")) {
        newLink = "https://" + newLink;
      }
      items[index].link = newLink;
      e.target.href = newLink;
    }
  });

  // =========================
  // clickイベント
  // =========================
  showcase.addEventListener("click", (e) => {
    console.log("クリック検知");

    // ① 画像アップロード
    const imageEl = e.target.closest(".image");
    if (imageEl && itemImgInput) {
      const cardEl = imageEl.closest(".card");
      const imgEl = imageEl.querySelector("img");

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
      };

      itemImgInput.click();
      return;
    }

    // ② いいね
    const heart = e.target.closest(".icon-heart");
    if (heart) {
      const card = heart.closest(".card");
      const index = Array.from(showcase.children).indexOf(card);

      if (index >= 0) {
        items[index].liked = !items[index].liked;
        heart.classList.toggle("active");
      }
      return;
    }

    // ③ 保存
    const save = e.target.closest(".icon-save");
    if (save) {
      const card = save.closest(".card");
      const index = Array.from(showcase.children).indexOf(card);

      if (index >= 0) {
        items[index].saved = !items[index].saved;
        save.classList.toggle("active");
      }
      return;
    }
  });

});

// =========================
// ローカル保存 読み込み
// =========================
function loadAppState() {
  const saved = localStorage.getItem("recomenState");
  if (!saved) return;

  try {
    const state = JSON.parse(saved);

    // ヘッダー画像
    const header = document.getElementById("headerImg");
    if (header && state.headerImg) header.src = state.headerImg;

    // プロフィール画像
    const avatar = document.getElementById("avatarImg");
    if (avatar && state.avatarImg) avatar.src = state.avatarImg;

    // アナウンスバー背景色
    const bar = document.getElementById("announcementBar");
    if (bar && state.announcementBg) bar.style.backgroundColor = state.announcementBg;

    // アナウンスバー文字
    const bannerText = document.querySelector(".banner-text");
    if (bannerText && state.announcementText) bannerText.textContent = state.announcementText;

    // 背景カラー
    if (state.bgColor) document.body.style.backgroundColor = state.bgColor;

    // プロフィール背景
    const profileEl = document.querySelector('.profile');
    if (profileEl && state.profileBg) profileEl.style.backgroundColor = state.profileBg;

    // フォントカラー
    if (state.fontColor) document.body.style.color = state.fontColor;

    // テーマ
    if (state.theme) {
      document.body.classList.remove('theme-natural', 'theme-modern');
      document.body.classList.add(`theme-${state.theme}`);
    }

    // フォント
    if (state.fontFamily) {
      document.documentElement.style.setProperty('--font-family', state.fontFamily);
    }

    // プロフィール名前
    const profileNameEl = document.getElementById("profileName");
    if (profileNameEl && state.profileName) profileNameEl.textContent = state.profileName;

    // プロフィール紹介
    const profileBioEl = document.getElementById("profileBio");
    if (profileBioEl && state.profileBio) profileBioEl.textContent = state.profileBio;

    // アイテム配列
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