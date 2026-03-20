alert("JSは読み込まれた！");
console.log("JSは読み込まれた！");


document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM読み込みOK");

  const showcase = document.getElementById("showcase");
  const itemImgInput = document.getElementById("itemImgInput");

  console.log('showcase:', showcase);
  console.log('itemImgInput:', itemImgInput);

  if (!showcase) {
    console.error("showcase が見つからない");
    return;
  }

  if (!itemImgInput) {
    console.warn("itemImgInput が見つからない");
  }
});
