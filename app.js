const posters = [
  {
    owner: "Alice",
    career: "Accountant",
    zh: "會計師",
    pdf: "assets/posters/alice.pdf",
    thumb: "assets/thumbs/alice.pdf.png",
  },
  {
    owner: "Alina",
    career: "Air Catering Quality Control Specialist",
    zh: "航空餐食品管專員",
    pdf: "assets/posters/alina.pdf",
    thumb: "assets/thumbs/alina.pdf.png",
  },
  {
    owner: "Ann",
    career: "Izakaya Chef",
    zh: "居酒屋廚師",
    pdf: "assets/posters/ann.pdf",
    thumb: "assets/thumbs/ann.pdf.png",
  },
  {
    owner: "Celine",
    career: "Bridal Makeup Artist",
    zh: "新娘秘書",
    pdf: "assets/posters/celine.pdf",
    thumb: "assets/thumbs/celine.pdf.png",
  },
  {
    owner: "Melody",
    career: "Equipment Engineer",
    zh: "設備工程師",
    pdf: "assets/posters/melody.pdf",
    thumb: "assets/thumbs/melody.pdf.png",
  },
  {
    owner: "Patty",
    career: "Veterinarian",
    zh: "獸醫",
    pdf: "assets/posters/patty.pdf",
    thumb: "assets/thumbs/patty.pdf.png",
  },
  {
    owner: "Phoebe",
    career: "Elementary School Teacher",
    zh: "國小教師",
    pdf: "assets/posters/phoebe.pdf",
    thumb: "assets/thumbs/phoebe.pdf.png",
  },
  {
    owner: "Sydney",
    career: "APR Engineer",
    zh: "APR 後端工程師",
    pdf: "assets/posters/sydney.pdf",
    thumb: "assets/thumbs/sydney.pdf.png",
  },
  {
    owner: "譚芯",
    career: "Bridal Makeup Artist",
    zh: "新娘秘書",
    pdf: "assets/posters/tan-xin.pdf",
    thumb: "assets/thumbs/tan-xin.pdf.png",
  },
  {
    owner: "李采恩",
    career: "Elementary School Teacher",
    zh: "國小教師",
    pdf: "assets/posters/tsai-en-li.pdf",
    thumb: "assets/thumbs/tsai-en-li.pdf.png",
  },
];

const missions = [
  "找到一張海報，說出這份職業最需要的一項技能。",
  "選一張最想深入了解的海報，向作者問一個問題。",
  "找出兩個工作時間最不一樣的職業。",
  "選一份看起來最有挑戰的職業，說明理由。",
  "找出一張有證照或學歷要求的海報。",
  "選一份你以前沒想過的職業，分享一個新發現。",
  "和隊友各選一張海報，比較兩份工作的優點。",
  "找出一張最需要溝通能力的海報。",
];

let currentPoster = null;
let round = 0;
let score = 0;
let streak = 0;
let answered = false;
let quizOrder = [];

const quizPoster = document.querySelector("#quiz-poster");
const posterMask = document.querySelector("#poster-mask");
const roundLabel = document.querySelector("#round-label");
const answers = document.querySelector("#answers");
const result = document.querySelector("#result");
const scoreEl = document.querySelector("#score");
const streakEl = document.querySelector("#streak");
const startBtn = document.querySelector("#start-btn");
const nextBtn = document.querySelector("#next-btn");
const missionBtn = document.querySelector("#mission-btn");
const missionText = document.querySelector("#mission-text");
const posterGrid = document.querySelector("#poster-grid");
const search = document.querySelector("#search");
const dialog = document.querySelector("#poster-dialog");
const posterFrame = document.querySelector("#poster-frame");
const posterLink = document.querySelector("#poster-link");
const dialogTitle = document.querySelector("#dialog-title");
const dialogOwner = document.querySelector("#dialog-owner");
const closeDialog = document.querySelector("#close-dialog");
const scoreForm = document.querySelector("#score-form");
const teamName = document.querySelector("#team-name");
const leaderboardList = document.querySelector("#leaderboard-list");

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function setView(viewName) {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.view === viewName);
  });
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.toggle("is-active", view.id === `${viewName}-view`);
  });
}

function makeChoices(answer) {
  const uniqueCareers = [...new Map(posters.map((poster) => [poster.career, poster])).values()];
  const distractors = shuffle(uniqueCareers.filter((poster) => poster.career !== answer.career)).slice(0, 3);
  return shuffle([answer, ...distractors]);
}

function renderQuestion() {
  if (round >= quizOrder.length) {
    result.textContent = `完成！本輪得分 ${score} 分。`;
    nextBtn.disabled = true;
    startBtn.textContent = "再玩一次";
    posterMask.classList.add("is-hidden");
    return;
  }

  currentPoster = quizOrder[round];
  answered = false;
  quizPoster.src = currentPoster.thumb;
  quizPoster.alt = `${currentPoster.owner} 的職業海報`;
  posterMask.classList.remove("is-hidden");
  roundLabel.textContent = `Round ${round + 1} / ${quizOrder.length}`;
  result.textContent = "選出正確職業後，海報會完整揭曉。";
  nextBtn.disabled = true;
  answers.innerHTML = "";

  makeChoices(currentPoster).forEach((choice) => {
    const button = document.createElement("button");
    button.className = "answer";
    button.type = "button";
    button.textContent = `${choice.zh} · ${choice.career}`;
    button.addEventListener("click", () => checkAnswer(button, choice));
    answers.append(button);
  });
}

function startGame() {
  quizOrder = shuffle(posters).slice(0, 10);
  round = 0;
  score = 0;
  streak = 0;
  updateScore();
  startBtn.textContent = "重新開始";
  renderQuestion();
}

function checkAnswer(button, choice) {
  if (answered) return;
  answered = true;
  posterMask.classList.add("is-hidden");

  const isCorrect = choice.career === currentPoster.career;
  if (isCorrect) {
    streak += 1;
    score += 10 + Math.min(streak - 1, 5) * 2;
    result.textContent = `答對了！作者：${currentPoster.owner}`;
    button.classList.add("correct");
  } else {
    streak = 0;
    result.textContent = `答案是 ${currentPoster.zh} · ${currentPoster.career}，作者：${currentPoster.owner}`;
    button.classList.add("wrong");
  }

  [...answers.children].forEach((answerButton) => {
    if (answerButton.textContent.includes(currentPoster.career)) {
      answerButton.classList.add("correct");
    }
  });

  updateScore();
  nextBtn.disabled = false;
}

function nextQuestion() {
  round += 1;
  renderQuestion();
}

function updateScore() {
  scoreEl.textContent = score;
  streakEl.textContent = streak;
}

function renderGallery(items = posters) {
  posterGrid.innerHTML = "";
  items.forEach((poster) => {
    const card = document.createElement("article");
    card.className = "poster-card";
    card.innerHTML = `
      <button type="button">
        <img src="${poster.thumb}" alt="${poster.owner} 的 ${poster.zh} 海報">
        <span class="poster-info">
          <strong>${poster.zh}</strong>
          <span>${poster.career}</span>
          <span>${poster.owner}</span>
        </span>
      </button>
    `;
    card.querySelector("button").addEventListener("click", () => openPoster(poster));
    posterGrid.append(card);
  });
}

function openPoster(poster) {
  dialogOwner.textContent = poster.owner;
  dialogTitle.textContent = `${poster.zh} · ${poster.career}`;
  posterFrame.src = poster.pdf;
  posterLink.href = poster.pdf;
  dialog.showModal();
}

function randomMission() {
  const mission = missions[Math.floor(Math.random() * missions.length)];
  const poster = posters[Math.floor(Math.random() * posters.length)];
  missionText.textContent = `${mission} 指定海報：${poster.owner} / ${poster.zh}`;
}

function getBoard() {
  return JSON.parse(localStorage.getItem("careerPosterBoard") || "[]");
}

function setBoard(board) {
  localStorage.setItem("careerPosterBoard", JSON.stringify(board));
}

function renderBoard() {
  const board = getBoard().sort((a, b) => b.score - a.score).slice(0, 8);
  leaderboardList.innerHTML = "";
  board.forEach((entry) => {
    const li = document.createElement("li");
    li.textContent = `${entry.name}：${entry.score} 分`;
    leaderboardList.append(li);
  });
}

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => setView(tab.dataset.view));
});

startBtn.addEventListener("click", startGame);
nextBtn.addEventListener("click", nextQuestion);
missionBtn.addEventListener("click", randomMission);

search.addEventListener("input", () => {
  const keyword = search.value.trim().toLowerCase();
  const filtered = posters.filter((poster) => {
    return [poster.owner, poster.career, poster.zh].some((value) => value.toLowerCase().includes(keyword));
  });
  renderGallery(filtered);
});

closeDialog.addEventListener("click", () => dialog.close());
dialog.addEventListener("close", () => {
  posterFrame.src = "";
});

scoreForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = teamName.value.trim();
  if (!name) return;
  const board = getBoard();
  board.push({ name, score, at: Date.now() });
  setBoard(board);
  teamName.value = "";
  renderBoard();
  setView("board");
});

document.querySelector("#reset-score").addEventListener("click", () => {
  score = 0;
  streak = 0;
  updateScore();
});

document.querySelector("#clear-board").addEventListener("click", () => {
  setBoard([]);
  renderBoard();
});

renderGallery();
renderBoard();
startGame();
