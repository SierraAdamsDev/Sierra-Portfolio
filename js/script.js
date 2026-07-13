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


const thoughts = [
  "Lowkey plotting something",
  "This could have been an email",
  "Still building... just quieter",
  "Systems > Chaos",
  "This site changes when I feel like it",
  "Somebody schedule the meeting and then cancel it",
  "Currently resisting unnecessary complexity",
  "Teaching by day, building by night",
  "Not everything needs a committee",
  "Quietly working on something good",
  "Soft but focused",
  "Yes, this is the portfolio",
  "I probably have another idea already",
  "Trying not to make another project before finishing the current one",
  "This felt easier in my head",
  "One thing about me... I will redesign it",
  "Normal about systems. very normal.",
  "Thinking about land again",
  "DocReady is on my mind",
  "Building first, explaining later",
  "I support fewer meetings and better ideas",
  "Still not doing things the boring way",
  "If it feels clunky, I'm fixing it",
  "Professional, but make it weird",
  "Respectfully... this needed to look better"
];

document.getElementById("thoughtBtn")?.addEventListener("click", () => {
  const t = thoughts[Math.floor(Math.random() * thoughts.length)];
  document.getElementById("thoughtText").textContent = t;

});

document.getElementById("themeToggle")?.addEventListener("click", () => {
  document.body.classList.toggle("altTheme");
});

const trailBtn = document.getElementById("trailToggle");
let trailOn = false;

document.addEventListener("mousemove", (e) => {
  if (!trailOn) return;

  const dot = document.createElement("div");
  dot.textContent = "•";
  dot.classList.add("cursorDot");

  dot.style.left = e.clientX + "px";
  dot.style.top = e.clientY + "px";

  document.body.appendChild(dot);

  setTimeout(() => dot.remove(), 400);
});

trailBtn?.addEventListener("click", () => {
  trailOn = !trailOn;
  trailBtn.textContent = trailOn
    ? "🖱 Cursor Trail: ON"
    : "🖱 Cursor Trail: OFF";
});

const searchInput = document.getElementById("siteSearch");
const searchBtn = document.getElementById("searchBtn");
const searchScope = document.getElementById("searchScope");
const searchMessage = document.getElementById("searchMessage");

function clearHighlights() {
  document.querySelectorAll(".searchHighlight").forEach((mark) => {
    const parent = mark.parentNode;
    parent.replaceChild(document.createTextNode(mark.textContent), mark);
    parent.normalize();
  });
}

function activateTab(targetId) {
  tabLinks.forEach((item) => item.classList.remove("active"));
  contentSections.forEach((section) => section.classList.remove("active"));

  const matchingTab = document.querySelector(`.tabLink[data-target="${targetId}"]`);
  const matchingSection = document.getElementById(targetId);

  if (matchingTab) matchingTab.classList.add("active");
  if (matchingSection) matchingSection.classList.add("active");
}

function highlightFirstMatch(container, query) {
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      if (
        node.parentElement &&
        ["SCRIPT", "STYLE"].includes(node.parentElement.tagName)
      ) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  const lowerQuery = query.toLowerCase();
  let node;

  while ((node = walker.nextNode())) {
    const text = node.nodeValue;
    const lowerText = text.toLowerCase();
    const index = lowerText.indexOf(lowerQuery);

    if (index !== -1) {
      const before = text.slice(0, index);
      const match = text.slice(index, index + query.length);
      const after = text.slice(index + query.length);

      const span = document.createElement("span");
      span.className = "searchHighlight";
      span.textContent = match;

      const fragment = document.createDocumentFragment();
      if (before) fragment.appendChild(document.createTextNode(before));
      fragment.appendChild(span);
      if (after) fragment.appendChild(document.createTextNode(after));

      node.parentNode.replaceChild(fragment, node);
      return span;
    }
  }

  return null;
}

function runSearch() {
  const query = searchInput.value.trim();
  const scope = searchScope.value;

  clearHighlights();
  searchMessage.textContent = "";

  if (!query) {
    searchMessage.textContent = "Type something to search.";
    return;
  }

  let sectionsToSearch = [];

  if (scope === "all") {
    sectionsToSearch = Array.from(contentSections);
  } else {
    const section = document.getElementById(scope);
    if (section) sectionsToSearch = [section];
  }

  for (const section of sectionsToSearch) {
    const text = section.textContent.toLowerCase();
    if (text.includes(query.toLowerCase())) {
      activateTab(section.id);

      const matchEl = highlightFirstMatch(section, query);
      if (matchEl) {
        matchEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      searchMessage.textContent = `Found "${query}" in ${section.id}.`;
      return;
    }
  }

  searchMessage.textContent = `No results found for "${query}".`;
}

searchBtn?.addEventListener("click", runSearch);

searchInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    runSearch();
  }
});

/* Dev Diary GitHub Feed */
const devDiaryFeed = document.getElementById("devDiaryFeed");

async function loadDevDiary() {
  if (!devDiaryFeed) return;

  try {
    const response = await fetch("https://api.github.com/users/SierraAdamsDev/events/public");

    if (!response.ok) {
      throw new Error("GitHub activity could not be loaded.");
    }

    const events = await response.json();

    const usefulEvents = events
      .filter((event) => event.type === "PushEvent" || event.type === "CreateEvent")
      .slice(0, 4);

    if (!usefulEvents.length) {
      devDiaryFeed.innerHTML = `
        <p class="tinyNote">No recent public GitHub activity found.</p>
      `;
      return;
    }

    devDiaryFeed.innerHTML = usefulEvents
      .map((event) => {
        const repoName = event.repo.name.replace("SierraAdamsDev/", "");
        const eventDate = new Date(event.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric"
        });

        let title = "Updated a project";
        let detail = repoName;

        if (event.type === "PushEvent") {
          const commit = event.payload.commits?.[0];
          title = commit?.message || "Pushed new code";
          detail = `Pushed to ${repoName}`;
        }

        if (event.type === "CreateEvent") {
          title = `Created ${event.payload.ref_type}`;
          detail = repoName;
        }

        return `
          <div class="diaryEntry">
            <div class="diaryEntryTitle">${title}</div>
            <div class="diaryEntryMeta">${detail} · ${eventDate}</div>
            <a href="https://github.com/${event.repo.name}" target="_blank" rel="noopener">
              Open repo →
            </a>
          </div>
        `;
      })
      .join("");
  } catch (error) {
    devDiaryFeed.innerHTML = `
      <p class="tinyNote">GitHub activity is taking a break right now.</p>
    `;
  }
}

loadDevDiary();