alert("JS読み込まれてる！");

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

// 📦 読み込み
const saved = localStorage.getItem("myItems");

if (saved) {
  const data = JSON.parse(saved);

  const cards = document.querySelectorAll("#showcase .card");

  data.forEach((item, i) => {
    const card = cards[i];
    if (!card) return;

    const img = card.querySelector("img");
    const name = card.querySelector(".card-name");
    const link = card.querySelector(".link-display");
    const heart = card.querySelector(".icon-heart");
    const saveIcon = card.querySelector(".icon-save");

    // 🖼 画像
    if (img) img.src = item.img;

    // 📝 名前
    if (name) name.textContent = item.name;

    // 🔗 リンク
    if (link) {
      link.href = item.link;
      link.textContent = item.link;
    }

    // ❤️ ハート復元
    if (heart && item.liked) {
      heart.classList.add("liked");
      const path = heart.querySelector("path");
      if (path) {
        path.setAttribute("fill", "red");
        path.setAttribute("stroke", "red");
      }
    }

    // 💾 保存復元
    if (saveIcon && item.saved) {
      saveIcon.classList.add("saved");
      const path = saveIcon.querySelector("path");
      if (path) {
        path.setAttribute("fill", "#000");
        path.setAttribute("stroke", "#000");
      }
    }

  });

  console.log("読み込み完了");
}

const showcase = document.getElementById("showcase");

// =========================
// カード操作
// =========================
if (showcase) {
  showcase.addEventListener("click", (e) => {

    // ❤️ ハート
    const heart = e.target.closest(".icon-heart");

    if (heart) {
      heart.classList.toggle("liked");

      const path = heart.querySelector("path");

      if (path) {
        if (heart.classList.contains("liked")) {
          path.setAttribute("fill", "red");
          path.setAttribute("stroke", "red");
        } else {
          path.setAttribute("fill", "none");
          path.setAttribute("stroke", "#000");
        }
      }

      console.log("ハート押された");
      return;
    }

    // 💾 保存アイコン
    const save = e.target.closest(".icon-save");

    if (save) {
      save.classList.toggle("saved");

      const path = save.querySelector("path");

      if (path) {
        if (save.classList.contains("saved")) {
          path.setAttribute("fill", "#000");
        } else {
          path.setAttribute("fill", "none");
        }
        path.setAttribute("stroke", "#000");
      }

      console.log("保存押された");
      return;
    }

    // 🔗 リンク編集（修正版）
const linkEl = e.target.closest(".link-display");
const editBtn = e.target.closest(".edit-link-btn");

if (linkEl || editBtn) {
  const card = e.target.closest(".card");

  // 👇 何番目のカードか取得（重要）
  const cards = Array.from(showcase.children);
  const index = cards.indexOf(card);

  const target = card.querySelector(".link-display");

  const current = target.getAttribute("href") || "";

  const newLink = prompt("商品リンクを入力してね", current);

  if (newLink) {
    const finalLink = newLink.startsWith("http")
      ? newLink
      : "https://" + newLink;

    target.setAttribute("href", finalLink);
    target.textContent = finalLink;

    console.log("リンク編集された:", index);
  }

  return;
  }

    // 🖼 画像アップロード（軽量化版）
const imageEl = e.target.closest(".image");

if (imageEl) {
  const img = imageEl.querySelector("img");
  const input = document.getElementById("itemImgInput");

  if (!input || !img) return;

  input.onchange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (ev) => {
      const image = new Image();

      image.onload = () => {
        const canvas = document.createElement("canvas");
        const maxSize = 200; // ← サイズ制限（ここが重要）

        let w = image.width;
        let h = image.height;

        if (w > h) {
          if (w > maxSize) {
            h = h * (maxSize / w);
            w = maxSize;
          }
        } else {
          if (h > maxSize) {
            w = w * (maxSize / h);
            h = maxSize;
          }
        }

        canvas.width = w;
        canvas.height = h;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, w, h);

        // 🔥 圧縮（超重要）
        const compressed = canvas.toDataURL("image/jpeg", 0.6);

        img.src = compressed;
      };

      image.src = ev.target.result;
    };

    reader.readAsDataURL(file);

    input.value = "";
  };

  input.click();

  console.log("画像変更（軽量版）");
  return;
  }

  });
}

// =========================
// 💾 保存ボタン（←外に出した）
// =========================
const saveBtn = document.getElementById("saveBtn");

if (saveBtn && showcase) {
  saveBtn.addEventListener("click", () => {

    const data = [];

    const cards = showcase.querySelectorAll(".card");

    cards.forEach(card => {
      const img = card.querySelector("img")?.src || "";
      const name = card.querySelector(".card-name")?.textContent || "";
      const link = card.querySelector(".link-display")?.href || "";
      const liked = card.querySelector(".icon-heart")?.classList.contains("liked") || false;
      const saved = card.querySelector(".icon-save")?.classList.contains("saved") || false;
      
      data.push({
        img,
        name,
        link,
        liked,
        saved
      });
    });

    localStorage.setItem("myItems", JSON.stringify(data));

    alert("保存した！");
    console.log("保存完了", data);
  });
}

// =========================
// カスタムバー開閉（これが足りない）
// =========================
const editToggle = document.getElementById('editToggle');
const editItems = document.getElementById('editItems');

if (editToggle && editItems) {
  editItems.classList.remove('active'); // 初期閉じ

  editToggle.addEventListener('click', (e) => {
    e.stopPropagation(); // ← 超重要
    editItems.classList.toggle('active');
  });
}

// =========================
// ポップアップ土台（安全版）
// =========================

document.addEventListener("DOMContentLoaded", () => {

  const popupMap = {
    themeButton: 'themePopup',
    styleButton: 'stylePopup',
    announcementButton: 'announcementPopup'
  };
  
  document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // テーマ切替（カード画像保持版）
  // =========================
  const themeRadios = document.querySelectorAll('input[name="theme"]');

  themeRadios.forEach(radio => {
    radio.addEventListener('change', e => {
      const showcase = document.getElementById('showcase');
      if (!showcase) return;

      // 画像保持
      const existingImages = Array.from(
        showcase.querySelectorAll('.card img')
      ).map(img => img.src);

      // テーマ切替
      if (e.target.value === 'natural') {
        document.body.classList.remove('theme-modern');
        document.body.classList.add('theme-natural');
      } else {
        document.body.classList.remove('theme-natural');
        document.body.classList.add('theme-modern');
      }

      // 画像復元
      const cardImgs = showcase.querySelectorAll('.card img');
      cardImgs.forEach((img, i) => {
        if (existingImages[i]) img.src = existingImages[i];
      });
    });
  });

  // =========================
  // フォント変更
  // =========================
  const fontSelect = document.getElementById('fontSelect');

  if (fontSelect) {
    fontSelect.addEventListener('change', e => {
      document.documentElement.style.setProperty('--font-family', e.target.value);
    });
  }

});

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

  // 全部閉じる
  function closeAllPopups() {
    Object.values(popupMap).forEach(popupId => {
      const popup = document.getElementById(popupId);
      if (popup) {
        popup.classList.remove('active');
        popup.style.display = 'none';
      }
    });
  }

  // 🔥 位置調整関数（編集バー直下版）
  function positionPopup(btn, popup) {
  if (!btn || !popup) return;

  // 一旦表示（サイズ取得のため）
  popup.style.display = "block";
  popup.style.visibility = "hidden";

  const rect = btn.getBoundingClientRect();
  const popupWidth = popup.offsetWidth;

  // 🔥 横：ボタン中央
  let left = rect.left + rect.width / 2 - popupWidth / 2;

  // 🔥 縦：ボタンの真下
  let top = rect.bottom - 44;

  // 🔥 画面内に収める（右はみ出し防止）
  left = Math.max(8, Math.min(left, window.innerWidth - popupWidth - 8));

  // 🔥 最終反映
  popup.style.position = "fixed";
  popup.style.left = left + "px";
  popup.style.top = top + "px";

  popup.style.visibility = "visible";
}

  // ボタン処理
  Object.entries(popupMap).forEach(([btnId, popupId]) => {
    const btn = document.getElementById(btnId);
    const popup = document.getElementById(popupId);

    console.log(btnId, btn);

    if (!btn || !popup) return;

    btn.addEventListener('click', (e) => {
  e.stopPropagation();

  const isActive = popup.classList.contains('active');

  closeAllPopups();

  if (!isActive) {
    popup.classList.add('active');
    popup.style.display = "block";

    // 👇 これが超重要
    requestAnimationFrame(() => {
      positionPopup(btn, popup);
    });
  }
});

    popup.addEventListener('click', e => e.stopPropagation());
  });

  document.body.addEventListener('click', closeAllPopups);

});


// ===============================
// アナウンスバー安全スクロール（修正版）
// ===============================
document.addEventListener("DOMContentLoaded", () => {

  const announcementToggle = document.getElementById('announcementToggle');
  const bannerTextInput = document.getElementById('bannerTextInput');
  const announcementBar = document.getElementById('announcementBar');
  const bannerText = announcementBar?.querySelector('.banner-text');

  if (!announcementToggle || !announcementBar || !bannerText || !bannerTextInput) {
    console.warn("アナウンスバー要素が見つからない");
    return;
  }

  // 初期表示
  announcementBar.style.display = announcementToggle.checked ? 'flex' : 'none';

  announcementToggle.addEventListener('change', e => {
    announcementBar.style.display = e.target.checked ? 'flex' : 'none';
  });

  // スタイル
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
    if (!textWidth) {
      requestAnimationFrame(scroll);
      return;
    }

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

});

