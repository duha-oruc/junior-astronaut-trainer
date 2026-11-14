let timeLeft = 60;
let timerInterval = null;
let prepStepIndex = 0;
let lastReturnIdx = -1;

function updateTimerUI() {
  timeLeft = Math.max(0, timeLeft);
  const timerEl = document.getElementById("main-timer");
  const panelEl = document.getElementById("timer-panel");

  if (timerEl) timerEl.innerText = `${timeLeft}s`;

  if (panelEl) {
    if (timeLeft <= 15 && timerInterval !== null) {
      panelEl.classList.add("critical");
    } else {
      panelEl.classList.remove("critical");
    }
  }
}

function startCountdown() {
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerUI();

    if (timeLeft <= 0) {
      stopCountdown();
      abortMission("Time's up! Your oxygen reserve hit 0 seconds before completing the mission.");
    }
  }, 1000);
}

function stopCountdown() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  const panelEl = document.getElementById("timer-panel");
  if (panelEl) panelEl.classList.remove("critical");
}

function pickUniqueRandom(list, lastIndex) {
  if (list.length <= 1) return { item: list[0], index: 0 };
  let idx;
  do {
    idx = Math.floor(Math.random() * list.length);
  } while (idx === lastIndex);
  return { item: list[idx], index: idx };
}

function abortMission(reason) {
  document.getElementById("rock-checklist-panel").classList.add("hidden");
  stopCountdown();
  surfaceRocks = [];
  hoveredRock = null;
  document.getElementById("phase-badge").innerText = "MISSION ABORTED";
  document.getElementById("nasa-tag").innerText = "OXYGEN DEPLETED";
  document.getElementById("event-title").innerText = "⚠️ Out of Time / Oxygen!";
  document.getElementById("event-desc").innerText = reason;
  document.getElementById("choices-container").innerHTML =
    `<button class="choice-btn" onclick="startMission()">Retry Mission 🔄</button>`;
}

// BAŞLANGIÇ: DÜNYA FIRLATMA RAMPASINDA HAZIRLIK ADIMLARI
function startMission() {
  document.getElementById("rock-checklist-panel").classList.add("hidden");
  stopCountdown();
  timeLeft = 60;
  prepStepIndex = 0;
  surfaceRocks = [];
  hoveredRock = null;
  currentScene = "earth"; // Dünya'da açık hava sahnesi
  updateTimerUI();
  startCountdown();

  runPrelaunchStep();
}

function runPrelaunchStep() {
  if (prepStepIndex >= PRELAUNCH_CHECKS.length) {
    startOutboundTransit();
    return;
  }

  const check = PRELAUNCH_CHECKS[prepStepIndex];
  document.getElementById("phase-badge").innerText = `PRE-LAUNCH CHECK (${prepStepIndex + 1}/3)`;
  document.getElementById("nasa-tag").innerText = check.nasaTag;
  document.getElementById("event-title").innerText = check.title;
  document.getElementById("event-desc").innerText = check.desc;

  const container = document.getElementById("choices-container");
  container.innerHTML = "";

  check.choices.forEach((choice) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.innerText = choice.text;
    btn.onclick = () => {
      timeLeft += choice.timeBonus;
      updateTimerUI();

      prepStepIndex++;
      const nextLabel =
        prepStepIndex < PRELAUNCH_CHECKS.length ? "Next Pre-Launch Check ➡️" : "Liftoff to the Moon! 🚀";
      showTransition(choice.feedback, nextLabel, runPrelaunchStep);
    };
    container.appendChild(btn);
  });
}

// AŞAMA 1: FIRLATMA VE AY'A YOLCULUK
function startOutboundTransit() {
  currentScene = "outbound";

  document.getElementById("phase-badge").innerText = "PHASE 1/3: LUNAR TRANSIT";
  document.getElementById("nasa-tag").innerText = "NASA ARTEMIS TRAJECTORY";
  document.getElementById("event-title").innerText = "🚀 Liftoff! En Route to the Moon";
  document.getElementById("event-desc").innerText =
    `Your mission clock is ticking (${timeLeft}s oxygen left)! Proceed quickly to lunar landing.`;

  const container = document.getElementById("choices-container");
  container.innerHTML = `<button class="choice-btn" onclick="startMoonSurfaceTask()">Land on the Moon 🌑</button>`;
}

let targetRocksList = []; // { name, icon, collected }

function renderChecklistUI() {
  const ul = document.getElementById("rock-checklist");
  ul.innerHTML = "";
  targetRocksList.forEach((item) => {
    const li = document.createElement("li");
    if (item.collected) li.classList.add("done");
    li.innerText = `${item.collected ? "☑️" : "⬜"} ${item.icon} ${item.name}`;
    ul.appendChild(li);
  });
}

// AŞAMA 2: AY YÜZEYİ KUŞBAKIŞI TAŞ TOPLAMA
function startMoonSurfaceTask() {
  currentScene = "moon";

  // 6 taş arasından rastgele 3 veya 4 hedef taş seç
  const targetCount = Math.random() < 0.5 ? 3 : 4;
  const shuffledPool = [...MOON_MISSION.allRocks].sort(() => Math.random() - 0.5);
  const selectedTargets = shuffledPool.slice(0, targetCount);

  targetRocksList = selectedTargets.map((r) => ({
    name: r.name,
    icon: r.icon,
    collected: false
  }));

  document.getElementById("phase-badge").innerText = `PHASE 2/3: COLLECT ${targetCount} SAMPLES`;
  document.getElementById("nasa-tag").innerText = MOON_MISSION.nasaTag;
  document.getElementById("event-title").innerText = MOON_MISSION.title;
  document.getElementById("event-desc").innerText = MOON_MISSION.desc;
  document.getElementById("choices-container").innerHTML = "";

  // Sol görev listesini göster
  document.getElementById("rock-checklist-panel").classList.remove("hidden");
  renderChecklistUI();

  // 6 taşı kuşbakışı zemine yerleştir
  setupTopDownMoon(MOON_MISSION.allRocks, targetNamesSet);
}

function handleRockCollect(rock) {
  if (rock.isTarget) {
    rock.collected = true;
    nearbyRock = null;

    // Listede işaretle
    const targetItem = targetRocksList.find((t) => t.name === rock.name);
    if (targetItem) targetItem.collected = true;
    renderChecklistUI();

    const remaining = targetRocksList.filter((t) => !t.collected).length;

    if (remaining === 0) {
      // Tüm hedef taşlar toplandı!
      document.getElementById("rock-checklist-panel").classList.add("hidden");
      surfaceRocks = [];
      showTransition(
        "All target samples collected! Ready to launch back to Earth.",
        "Launch Return to Earth 🌍",
        startReturnPhase
      );
    } else {
      document.getElementById("event-desc").innerText =
        `✅ Collected ${rock.name}! ${remaining} sample(s) remaining on your checklist.`;
    }
  } else {
    // Listede olmayan yanlış taş
    rock.collected = true;
    nearbyRock = null;
    timeLeft -= 6;
    updateTimerUI();
    document.getElementById("event-desc").innerText =
      `❌ ${rock.name} is NOT on your mission checklist! (-6s Oxygen)`;

    if (timeLeft <= 0) {
      abortMission("Collecting the wrong minerals drained your remaining oxygen!");
    }
  }
}

// AŞAMA 3: DÜNYA'YA DÖNÜŞ KRİZİ
function startReturnPhase() {
  currentScene = "return";
  document.getElementById("phase-badge").innerText = "PHASE 3/3: EARTH RETURN";

  const picked = pickUniqueRandom(RETURN_CRISES, lastReturnIdx);
  lastReturnIdx = picked.index;
  const crisis = picked.item;

  if (typeof liveNasaData !== "undefined" && liveNasaData.isLive) {
    crisis.nasaTag = `🔴 LIVE NASA TELEMETRY (${liveNasaData.solarFlareDate})`;
    crisis.desc += ` [LIVE DATA: NASA DONKI recorded a Class ${liveNasaData.solarFlareClass} solar flare & asteroid ${liveNasaData.nearestAsteroidName} passing at ${liveNasaData.nearestAsteroidSpeed} km/h!]`;
  }

  document.getElementById("nasa-tag").innerText = crisis.nasaTag;
  document.getElementById("event-title").innerText = crisis.title;
  document.getElementById("event-desc").innerText = crisis.desc;

  const container = document.getElementById("choices-container");
  container.innerHTML = "";

  crisis.choices.forEach((choice) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.innerText = choice.text;
    btn.onclick = () => {
      timeLeft += choice.timeDelta;
      updateTimerUI();

      if (timeLeft <= 0) {
        abortMission("Your oxygen ran out during Earth re-entry!");
        return;
      }

      stopCountdown();
      document.getElementById("phase-badge").innerText = "MISSION ACCOMPLISHED";
      document.getElementById("nasa-tag").innerText = "NASA MISSION REPORT: SUCCESS";
      document.getElementById("event-title").innerText = "🏆 Great Job, Junior Astronaut!";
      document.getElementById("event-desc").innerText =
        `${choice.feedback} You delivered the lunar sample safely with ${timeLeft} seconds of oxygen to spare!`;
      document.getElementById("choices-container").innerHTML =
        `<button class="choice-btn" onclick="startMission()">Play Again 🔄</button>`;
    };
    container.appendChild(btn);
  });
}

function showTransition(message, btnText, nextStepFn) {
  document.getElementById("event-desc").innerText = `✅ ${message}`;
  const container = document.getElementById("choices-container");
  container.innerHTML = "";

  const btn = document.createElement("button");
  btn.className = "choice-btn";
  btn.innerText = btnText;
  btn.onclick = nextStepFn;
  container.appendChild(btn);
}