alert("JS読み込まれてる！");

const showcase = document.getElementById("showcase");

if (showcase) {
  showcase.addEventListener("click", (e) => {

    // ❤️ ハートだけ反応させる
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

  });
}