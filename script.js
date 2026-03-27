alert("JS読み込まれた！");

let items = [];

function renderCards() {
  const showcase = document.getElementById("showcase");
  if (!showcase) return;
  showcase.innerHTML = "";
  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    card.textContent = item.name || "アイテム名";
    showcase.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  items = [
    {id:1, name:"テストアイテムA"},
    {id:2, name:"テストアイテムB"}
  ];
  renderCards();

  const saveBtn = document.getElementById("saveBtn");
  saveBtn.addEventListener("click", () => alert("保存ボタン押された！"));
});