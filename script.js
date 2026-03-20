alert("JS読み込まれてる！");

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

    if (img) img.src = item.img;
    if (name) name.textContent = item.name;
    if (link) {
      link.href = item.link;
      link.textContent = item.link;
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

    // 🔗 リンク編集
    const linkEl = e.target.closest(".link-display");
    const editBtn = e.target.closest(".edit-link-btn");

    if (linkEl || editBtn) {
      const card = e.target.closest(".card");
      const target = linkEl || card.querySelector(".link-display");

      const current = target.getAttribute("href") || "";

      const newLink = prompt("商品リンクを入力してね", current);

      if (newLink) {
        const finalLink = newLink.startsWith("http")
          ? newLink
          : "https://" + newLink;

        target.setAttribute("href", finalLink);
        target.textContent = finalLink;
      }

      console.log("リンク編集された");
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

      data.push({
        img,
        name,
        link
      });
    });

    localStorage.setItem("myItems", JSON.stringify(data));

    alert("保存した！");
    console.log("保存完了", data);
  });
}