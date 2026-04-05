const tabLinks = document.querySelectorAll(".tabLink");
const contentSections = document.querySelectorAll(".contentSection");

tabLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    const target = link.dataset.target;
    if (!target) return;

    tabLinks.forEach((item) => item.classList.remove("active"));
    link.classList.add("active");

    contentSections.forEach((section) => section.classList.remove("active"));
    const activeSection = document.getElementById(target);
    if (activeSection) {
      activeSection.classList.add("active");
    }
  });
});

/* Visitor counter */
const visitEl = document.getElementById("visitCount");
if (visitEl) {
  const key = "y2k_visits";
  const visits = Number(localStorage.getItem(key) || 0) + 1;
  localStorage.setItem(key, visits);
  visitEl.textContent = String(visits).padStart(6, "0");
}

/* Mood */
const moodEl = document.getElementById("mood");
if (moodEl) {
  const moods = ["curious", "building", "soft but focused", "shipping"];
  moodEl.textContent = moods[Math.floor(Math.random() * moods.length)];
}

/* Sparkles */
const sparkleBtn = document.getElementById("sparkleBtn");
if (sparkleBtn) {
  sparkleBtn.addEventListener("click", () => {
    for (let i = 0; i < 15; i++) {
      const sparkle = document.createElement("div");
      sparkle.className = "sparkle";
      sparkle.textContent = "✨";
      sparkle.style.position = "fixed";
      sparkle.style.left = Math.random() * 100 + "vw";
      sparkle.style.top = "-20px";
      sparkle.style.fontSize = "18px";
      document.body.appendChild(sparkle);

      sparkle.animate(
        [
          { transform: "translateY(0)", opacity: 1 },
          { transform: "translateY(110vh)", opacity: 0 }
        ],
        { duration: 1200 }
      );

      setTimeout(() => sparkle.remove(), 1200);
    }
  });
}

/* Music toggle */
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