let seconds = 0;
let restUntil = Number(localStorage.getItem("restUntil")) || 0;

const timerEl = document.getElementById("timer");
const box = document.getElementById("exerciseBox");
const startBtn = document.getElementById("startExerciseBtn");
const skipBtn = document.getElementById("skipExerciseBtn");
const progressBar = document.getElementById("progressBar");
const progressContainer = document.querySelector(".progress-container");
const intervalInput = document.getElementById("breakInterval");

/* ===== статистика ===== */
const totalBreaksEl = document.getElementById("totalBreaks");
const totalTimeEl = document.getElementById("totalTime");
const lastBreakEl = document.getElementById("lastBreak");

intervalInput.value = localStorage.getItem("breakInterval") || 45;

/* ==========================
   УПРАЖНЕНИЯ (ПОДРОБНЫЕ)
========================== */
const exercises = [
  {
    title: "🔄 Круговые движения глазами",
    text: `Сядьте ровно и расслабьте плечи.
Медленно вращайте глазами по кругу.

1. 5 кругов по часовой стрелке
2. 5 кругов против часовой стрелки
3. Двигайтесь плавно, без рывков

Упражнение улучшает кровообращение глаз.`
  },
  {
    title: "📏 Фокусировка вдаль и вблизи",
    text: `Вытяните палец перед собой.

1. Смотрите на палец 3 секунды
2. Переведите взгляд вдаль на 5 секунд
3. Повторите 10 раз

Тренирует фокусировку зрения.`
  },
  {
    title: "👁 Частое моргание",
    text: `Быстро моргайте 15 секунд.
Закройте глаза на 5 секунд.
Повторите 3 раза.

Уменьшает сухость глаз.`
  },
  {
    title: "🧘 Пальминг",
    text: `Разотрите ладони до тепла.
Накройте закрытые глаза.
Не давите.
30–40 секунд спокойного дыхания.`
  },
  {
    title: "⬅➡ Перевод взгляда",
    text: `Медленно смотрите влево и вправо.
Задержка по 2 секунды.
Повторите 10 раз.`
  },
  {
    title: "⬆⬇ Вверх и вниз",
    text: `Переводите взгляд вверх и вниз.
Задержка по 2 секунды.
Повторите 10 раз.`
  },
  {
    title: "🔢 Рисование цифр",
    text: `Медленно «рисуйте» глазами цифры от 1 до 5.
Затем обратно.
Без напряжения.`
  },
  {
    title: "🌬 Дыхание с закрытыми глазами",
    text: `Закройте глаза.
Медленный вдох носом.
Медленный выдох ртом.
5–7 циклов.`
  }
];

/* ==========================
   ВСПОМОГАТЕЛЬНОЕ
========================== */
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function formatTime(ms) {
  const s = Math.ceil(ms / 1000);
  const m = Math.floor(s / 60);
  return m > 0 ? `${m} мин ${s % 60} сек` : `${s} сек`;
}

/* ==========================
   СТАТИСТИКА
========================== */
function updateStats() {
  totalBreaksEl.textContent = analytics.totalBreaks;
  totalTimeEl.textContent = Math.floor(analytics.totalSeconds / 60);
  lastBreakEl.textContent = analytics.lastBreak;
}

/* ==========================
   ТАЙМЕР АКТИВНОСТИ
========================== */
setInterval(() => {
  seconds++;
  analytics.totalSeconds++;
  timerEl.textContent =
    String(Math.floor(seconds / 60)).padStart(2, "0") +
    ":" +
    String(seconds % 60).padStart(2, "0");

  analytics.save();
  updateStats();
}, 1000);

/* ==========================
   УВЕДОМЛЕНИЕ
========================== */
function scheduleNotification(ms) {
  if (!("Notification" in window)) return;

  if (Notification.permission === "default") {
    Notification.requestPermission();
  }

  if (Notification.permission !== "granted") return;

  setTimeout(() => {
    navigator.serviceWorker.ready.then(reg => {
      reg.showNotification("👀 Пора сделать перерыв", {
        body: "Разминка для глаз снова доступна",
        vibrate: [200, 100, 200]
      });
    });
  }, ms);
}

/* ==========================
   ЛОГИКА УПРАЖНЕНИЙ
========================== */
let shuffled = [];
let index = 0;
let timeout;

function showExercise(i) {
  const ex = shuffled[i];

  box.innerHTML = `<h3>${ex.title}</h3><pre>${ex.text}</pre>`;
  box.classList.remove("hidden");
  box.classList.add("show");

  skipBtn.classList.remove("hidden");
  progressContainer.classList.remove("hidden");
  progressBar.style.width = `${((i + 1) / shuffled.length) * 100}%`;

  timeout = setTimeout(nextExercise, 25000);
}

function nextExercise() {
  clearTimeout(timeout);
  index++;
  index < shuffled.length ? showExercise(index) : finishSession();
}

function finishSession() {
  box.classList.add("hidden");
  box.classList.remove("show");
  skipBtn.classList.add("hidden");
  progressContainer.classList.add("hidden");

  analytics.totalBreaks++;
  analytics.lastBreak = new Date().toLocaleString();
  analytics.save();
  updateStats();

  const intervalMs = intervalInput.value * 60000;
  restUntil = Date.now() + intervalMs;
  localStorage.setItem("restUntil", restUntil);

  scheduleNotification(intervalMs);
}

/* ==========================
   СОБЫТИЯ
========================== */
startBtn.onclick = () => {
  const now = Date.now();

  if (now < restUntil) {
    alert(
      `Рано 🙂 Дайте глазам отдохнуть.\n` +
      `Следующая разминка будет доступна через ${formatTime(restUntil - now)}`
    );
    return;
  }

  shuffled = shuffle(exercises);
  index = 0;
  showExercise(index);
};

skipBtn.onclick = nextExercise;
intervalInput.onchange = () =>
  localStorage.setItem("breakInterval", intervalInput.value);

/* стартовое обновление */
updateStats();
