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