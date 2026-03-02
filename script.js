document.body.style.background = "yellow";
alert("外部JSからこんにちは");
console.log("script開始");

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM OK");
});