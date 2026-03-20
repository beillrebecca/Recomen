alert("JS読み込まれてる！");

const showcase = document.getElementById("showcase");

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

    // 💾 保存 ← ★ここに追加！！
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
  
  // 🖼 画像アップロード
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
      img.src = ev.target.result;
    };

    reader.readAsDataURL(file);

    input.value = ""; // リセット
  };

  input.click();

  console.log("画像変更");
  return;
  }
  
  // 💾 保存ボタン
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

  });
}