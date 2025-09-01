const flashcard = document.getElementById("flashcard");
const flipBtn = document.getElementById("flipBtn");
let flipped = false;

flipBtn.addEventListener("click", () => {
  flipped = !flipped;
  flashcard.style.transform = flipped ? "rotateY(180deg)" : "rotateY(0deg)";
});
