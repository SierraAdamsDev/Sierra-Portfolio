const tabs = document.querySelectorAll(".tab");
const sections = document.querySelectorAll(".section");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    tabs.forEach(t => t.setAttribute("aria-selected", "false"));
    tab.setAttribute("aria-selected", "true");

    sections.forEach(s => s.classList.remove("active"));
    document.getElementById(tab.dataset.target).classList.add("active");
  });
});


// Visitor counter
const key = "y2k_visits";
const visits = Number(localStorage.getItem(key) || 0) + 1;
localStorage.setItem(key, visits);
document.getElementById("visitCount").textContent =
  String(visits).padStart(6, "0");

// Mood
const moods = ["curious", "building", "soft but focused", "shipping"];
document.getElementById("mood").textContent =
  moods[Math.floor(Math.random() * moods.length)];



// Sparkles
document.getElementById("sparkleBtn")?.addEventListener("click", () => {
  for (let i = 0; i < 15; i++) {
    const s = document.createElement("div");
    s.textContent = "✨";
    s.style.position = "fixed";
    s.style.left = Math.random() * 100 + "vw";
    s.style.top = "-20px";
    s.style.fontSize = "18px";
    document.body.appendChild(s);

    s.animate([
      { transform: "translateY(0)", opacity: 1 },
      { transform: "translateY(110vh)", opacity: 0 }
    ], { duration: 1200 });

    setTimeout(() => s.remove(), 1200);
  }
});


// Music
const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicToggle");

if (music && musicBtn) {
  music.volume = 0.3;

  let isPlaying = false;

  musicBtn.addEventListener("click", () => {
    if (!isPlaying) {
      music.play();
      musicBtn.textContent = "🎵 Music: ON";
    } else {
      music.pause();
      musicBtn.textContent = "🎵 Music: OFF";
    }
    isPlaying = !isPlaying;
  });
}

