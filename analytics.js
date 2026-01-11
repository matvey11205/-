const analytics = {
  totalSeconds: Number(localStorage.getItem("totalSeconds")) || 0,
  totalBreaks: Number(localStorage.getItem("totalBreaks")) || 0,
  lastBreak: localStorage.getItem("lastBreak") || "—",

  save() {
    localStorage.setItem("totalSeconds", this.totalSeconds);
    localStorage.setItem("totalBreaks", this.totalBreaks);
    localStorage.setItem("lastBreak", this.lastBreak);
  }
};

function updateAnalyticsUI() {
  document.getElementById("totalBreaks").textContent = analytics.totalBreaks;
  document.getElementById("totalTime").textContent =
    Math.floor(analytics.totalSeconds / 60);
  document.getElementById("lastBreak").textContent = analytics.lastBreak;
}
