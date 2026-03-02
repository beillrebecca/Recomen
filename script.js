console.log("Recomen JS 起動");

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM読み込みOK");

  const showcase = document.getElementById("showcase");
  console.log("showcase:", showcase);
  let items = [];

for (let i = 1; i <= 12; i++) {
  items.push({
    name: "アイテム" + i,
    img: "https://dummyimage.com/300x300/eeeeee/999999&text=%F0%9F%93%B7",
    link: "商品リンク",
    clicks: 0
  });
}

console.log("items準備完了", items);

function renderCards() {
  if (!showcase) return;

  showcase.innerHTML = "";

  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="image">
        <img src="${item.img}" alt="">
      </div>

      <div class="card-name">
        ${item.name}
      </div>

      <div class="price-link-wrapper">
        <a class="link-display" href="${item.link}" target="_blank">
          ${item.link}
        </a>
      </div>
    `;

    showcase.appendChild(card);
  });
}

renderCards();
});