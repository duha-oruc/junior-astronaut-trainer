let state = { power: 80, oxygen: 80, shield: 70 };

function updateUI() {
  ["power", "oxygen", "shield"].forEach((key) => {
    const val = Math.max(0, Math.min(100, state[key]));
    state[key] = val;
    document.getElementById(`val-${key}`).innerText = `${val}%`;
    document.getElementById(`bar-${key}`).style.width = `${val}%`;
  });
}

function checkFailure(customMsg) {
  if (state.power <= 0 || state.oxygen <= 0 || state.shield <= 0) {
    document.getElementById("rock-grid").classList.add("hidden");
    document.getElementById("phase-badge").innerText = "MISSION ABORTED";
    document.getElementById("nasa-tag").innerText = "CRITICAL SYSTEM WARNING";
    document.getElementById("event-title").innerText = "⚠️ Mission Aborted!";
    document.getElementById("event-desc").innerText =
      customMsg || "One of your critical resources hit 0%, triggering an emergency abort capsule return.";
    document.getElementById("choices-container").innerHTML =
      `<button class="choice-btn" onclick="startMission()">LET'S TRY AGAIN 😻</button>`;
    return true;
  }
  return false;
}

// PHASE 1: OUTBOUND SPACE TRANSIT
function startMission() {
  state = { power: 80, oxygen: 80, shield: 70 };
  currentScene = "outbound";
  updateUI();
  document.getElementById("rock-grid").classList.add("hidden");
  document.getElementById("phase-badge").innerText = "PHASE 1/3: LUNAR TRANSIT";

  const crisis = OUTBOUND_CRISES[Math.floor(Math.random() * OUTBOUND_CRISES.length)];
  renderCrisis(crisis, (feedback) => {
    showTransition(feedback, "Land on the Moon 🌑", startMoonSurfaceTask);
  });
}

// PHASE 2: LUNAR SURFACE ROCK COLLECTION
function startMoonSurfaceTask() {
  currentScene = "moon";
  document.getElementById("phase-badge").innerText = "PHASE 2/3: LUNAR SURFACE";
  document.getElementById("nasa-tag").innerText = MOON_MISSION.nasaTag;
  document.getElementById("event-title").innerText = MOON_MISSION.title;
  document.getElementById("event-desc").innerText = MOON_MISSION.desc;
  document.getElementById("choices-container").innerHTML = "";

  const rockGrid = document.getElementById("rock-grid");
  rockGrid.innerHTML = "";
  rockGrid.classList.remove("hidden");

  MOON_MISSION.rocks.forEach((rock) => {
    const card = document.createElement("div");
    card.className = "rock-card";
    card.innerHTML = `
      <span class="rock-icon">${rock.icon}</span>
      <div class="rock-name">${rock.name}</div>
      <div class="rock-clue">${rock.clue}</div>
    `;
    card.onclick = () => handleRockClick(rock);
    rockGrid.appendChild(card);
  });
}

function handleRockClick(rock) {
  if (rock.isTarget) {
    document.getElementById("rock-grid").classList.add("hidden");
    showTransition(rock.successMsg, "Launch Return to Earth 🌍", startReturnPhase);
  } else {
    state.oxygen -= 10;
    state.power -= 5;
    updateUI();
    document.getElementById("event-desc").innerText = `❌ ${rock.wrongMsg}`;
    checkFailure("You ran out of oxygen while searching the lunar surface!");
  }
}

// PHASE 3: EARTH RETURN CRISIS
function startReturnPhase() {
  currentScene = "return";
  document.getElementById("phase-badge").innerText = "PHASE 3/3: EARTH RETURN";
  const crisis = RETURN_CRISES[Math.floor(Math.random() * RETURN_CRISES.length)];
  renderCrisis(crisis, (feedback) => {
    document.getElementById("phase-badge").innerText = "MISSION ACCOMPLISHED";
    document.getElementById("nasa-tag").innerText = "NASA MISSION REPORT: SUCCESS";
    document.getElementById("event-title").innerText = "🏆 Great Job, Junior Astronaut!";
    document.getElementById("event-desc").innerText =
      `${feedback} You delivered the lunar sample to NASA scientists! Final Stats — Power: ${state.power}%, Oxygen: ${state.oxygen}%, Shield: ${state.shield}%`;
    document.getElementById("choices-container").innerHTML =
      `<button class="choice-btn" onclick="startMission()">LET'S TRY AGAIN 😻</button>`;
  });
}

function renderCrisis(crisis, onSuccess) {
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
      state.power += choice.effects.power;
      state.oxygen += choice.effects.oxygen;
      state.shield += choice.effects.shield;
      updateUI();
      if (!checkFailure()) {
        onSuccess(choice.feedback);
      }
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