// ====== Elements ======
const card = document.getElementById('flashcard');
const front = document.getElementById('front');
const back = document.getElementById('back');
const flipBtn = document.getElementById('flipBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const rightBtn = document.getElementById('rightBtn');
const wrongBtn = document.getElementById('wrongBtn');
const boxIndicator = document.getElementById('boxIndicator');
const progressBar = document.getElementById('progressBar');

let flipped = false;
let currentIndex = 0;

// ====== Flashcards ======
const flashcards = [
  { q: "What is JavaScript?", a: "A programming language that makes websites interactive." },
  { q: "What is HTML?", a: "The standard markup language for creating web pages." },
  { q: "What is CSS?", a: "A style sheet language used to design web pages." },
  { q: "What does DOM stand for?", a: "Document Object Model." }
];

// ====== Leitner boxes ======
let leitnerBoxes = JSON.parse(localStorage.getItem("leitnerBoxes")) || Array(flashcards.length).fill(0);
let boxes = [[], [], [], []];
flashcards.forEach((_, index) => boxes[leitnerBoxes[index]].push(index));

// ====== Save progress ======
function saveProgress() {
  localStorage.setItem("leitnerBoxes", JSON.stringify(leitnerBoxes));
}

// ====== Update UI ======
function updateUI() {
  // Box indicator
  boxIndicator.textContent = `Box: ${leitnerBoxes[currentIndex]}/3`;

  // Progress bar (percentage of cards mastered)
  const mastered = leitnerBoxes.filter(b => b === 3).length;
  const percent = (mastered / flashcards.length) * 100;
  progressBar.style.width = `${percent}%`;
}

// ====== Render card ======
function renderCard() {
  const cardData = flashcards[currentIndex];
  front.textContent = cardData.q;
  back.textContent = cardData.a;
  flipped = false;
  card.classList.remove('is-flipped');
  updateUI();
}

// ====== Flip card ======
function toggleFlip() {
  flipped = !flipped;
  card.classList.toggle('is-flipped', flipped);
}

// ====== Show next card from queue ======
function showNext() {
  let boxIndex = boxes.findIndex(b => b.length > 0);
  if (boxIndex === -1) return; // all boxes empty
  currentIndex = boxes[boxIndex][0];
  renderCard();
}

// ====== Show previous card (simple circular) ======
function showPrev() {
  currentIndex = (currentIndex - 1 + flashcards.length) % flashcards.length;
  renderCard();
}

// ====== Mark right ======
function markRight() {
  let oldBox = leitnerBoxes[currentIndex];
  let newBox = Math.min(oldBox + 1, 3);

  boxes[oldBox] = boxes[oldBox].filter(i => i !== currentIndex);
  boxes[newBox].push(currentIndex);

  leitnerBoxes[currentIndex] = newBox;
  saveProgress();
  showNext();
}

// ====== Mark wrong ======
function markWrong() {
  let oldBox = leitnerBoxes[currentIndex];

  boxes[oldBox] = boxes[oldBox].filter(i => i !== currentIndex);
  boxes[0].push(currentIndex);

  leitnerBoxes[currentIndex] = 0;
  saveProgress();
  showNext();
}

// ====== Event listeners ======
flipBtn.addEventListener('click', toggleFlip);
nextBtn.addEventListener('click', showNext);
prevBtn.addEventListener('click', showPrev);
rightBtn.addEventListener('click', markRight);
wrongBtn.addEventListener('click', markWrong);
card.addEventListener('click', toggleFlip);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowRight') { e.preventDefault(); showNext(); }
  if (e.code === 'ArrowLeft') { e.preventDefault(); showPrev(); }
  if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); toggleFlip(); }
  if (e.code === 'KeyY') markRight();
  if (e.code === 'KeyN') markWrong();
});

// ====== Init ======
showNext();
