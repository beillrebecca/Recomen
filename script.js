let items = [
  {id:1, name:'テストA', price:'¥1000', link:'#', img:'', liked:false, saved:false, clicks:0}
];

function renderCards() {
  const showcase = document.getElementById("showcase");
  showcase.innerHTML = "";
  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    card.textContent = `${item.name} - ${item.price}`;
    showcase.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderCards();
});