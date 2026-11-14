const canvas = document.getElementById("space-canvas");
const ctx = canvas.getContext("2d");

let currentScene = "earth";
let animFrame = 0;
let stars = [];

let surfaceRocks = [];
let nearbyRock = null;
let craters = [];

const astronaut = { x: 0, y: 0, speed: 4.5, radius: 16 };
const keysPressed = {};

// Yedek taş listesi (scenarios.js yüklenmese bile taşların kesin çizilmesini sağlar)
const DEFAULT_ROCKS = [
  { icon: "🌑", name: "Metallic Ilmenite", color: "#1e293b", clue: "Dark titanium-iron oxide mineral used to produce lunar oxygen." },
  { icon: "🪨", name: "White Anorthosite", color: "#e2e8f0", clue: "Light-colored ancient highland crust rock rich in calcium." },
  { icon: "🧱", name: "Orange Glass Regolith", color: "#fb923c", clue: "Volcanic glass beads formed by ancient lunar fire fountains." },
  { icon: "🏔️", name: "Impact Breccia", color: "#94a3b8", clue: "Sharp rock fragments welded together by meteorite impacts." },
  { icon: "🌋", name: "Mare Basalt", color: "#475569", clue: "Dark, heavy volcanic lava rock from ancient lunar seas." },
  { icon: "💎", name: "Green Olivine", color: "#4ade80", clue: "Crystalline magnesium-iron silicate from the Moon's deep mantle." }
];

const rocketImg = new Image();
rocketImg.src = "assets/rocket.png";

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  stars = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 0.5
  }));
}

window.addEventListener("resize", resizeCanvas);

window.addEventListener("keydown", (e) => {
  keysPressed[e.key.toLowerCase()] = true;

  if (e.key === "Enter" && currentScene === "moon" && nearbyRock && !nearbyRock.collected) {
    e.preventDefault();
    if (typeof handleRockCollect === "function") {
      handleRockCollect(nearbyRock);
    }
  }
});

window.addEventListener("keyup", (e) => {
  keysPressed[e.key.toLowerCase()] = false;
});

function setupTopDownMoon(allRocksList, targetNamesSet) {
  const w = canvas.width || window.innerWidth;
  const h = canvas.height || window.innerHeight;

  astronaut.x = w * 0.45;
  astronaut.y = h * 0.24;
  nearbyRock = null;

  craters = [
    { x: w * 0.18, y: h * 0.30, r: 40 },
    { x: w * 0.65, y: h * 0.26, r: 46 },
    { x: w * 0.22, y: h * 0.58, r: 35 },
    { x: w * 0.62, y: h * 0.56, r: 42 }
  ];

  // Sağdaki checklist ve alttaki metin kutusuyla çakışmayan güvenli koordinatlar
  const spots = [
    { rx: 0.22, ry: 0.25 },
    { rx: 0.56, ry: 0.25 },
    { rx: 0.20, ry: 0.43 },
    { rx: 0.58, ry: 0.43 },
    { rx: 0.30, ry: 0.60 },
    { rx: 0.50, ry: 0.60 }
  ];

  const shuffledSpots = [...spots].sort(() => Math.random() - 0.5);
  const source =
    Array.isArray(allRocksList) && allRocksList.length > 0
      ? allRocksList
      : (typeof MOON_MISSION !== "undefined" && MOON_MISSION.allRocks) || DEFAULT_ROCKS;

  surfaceRocks = source.map((rock, i) => ({
    ...rock,
    x: w * shuffledSpots[i % shuffledSpots.length].rx,
    y: h * shuffledSpots[i % shuffledSpots.length].ry,
    radius: 26,
    isTarget: targetNamesSet ? targetNamesSet.has(rock.name) : false,
    collected: false
  }));
}

function updateAstronautMovement() {
  if (currentScene !== "moon") return;

  let dx = 0;
  let dy = 0;
  if (keysPressed["w"] || keysPressed["arrowup"]) dy -= 1;
  if (keysPressed["s"] || keysPressed["arrowdown"]) dy += 1;
  if (keysPressed["a"] || keysPressed["arrowleft"]) dx -= 1;
  if (keysPressed["d"] || keysPressed["arrowright"]) dx += 1;

  if (dx !== 0 && dy !== 0) {
    dx *= 0.707;
    dy *= 0.707;
  }

  astronaut.x += dx * astronaut.speed;
  astronaut.y += dy * astronaut.speed;

  astronaut.x = Math.max(36, Math.min(canvas.width - 36, astronaut.x));
  astronaut.y = Math.max(95, Math.min(canvas.height - 210, astronaut.y));

  nearbyRock = null;
  let closestDist = 70;

  for (const rock of surfaceRocks) {
    if (rock.collected) continue;
    const dist = Math.hypot(astronaut.x - rock.x, astronaut.y - rock.y);
    if (dist < closestDist) {
      closestDist = dist;
      nearbyRock = rock;
    }
  }
}

function drawRocket(x, y, angle = 0, showFlame = true) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.scale(1.3, 1.3);

  if (rocketImg.complete && rocketImg.naturalWidth > 0) {
    ctx.drawImage(rocketImg, -24, -24, 48, 48);
  } else {
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(-10, -18, 20, 36);

    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.moveTo(0, -32);
    ctx.lineTo(-10, -18);
    ctx.lineTo(10, -18);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#3b82f6";
    ctx.beginPath();
    ctx.moveTo(-10, 6);
    ctx.lineTo(-20, 20);
    ctx.lineTo(-10, 18);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(10, 6);
    ctx.lineTo(20, 20);
    ctx.lineTo(10, 18);
    ctx.fill();

    if (showFlame) {
      const flameH = 12 + Math.sin(animFrame * 0.4) * 6;
      ctx.fillStyle = "#facc15";
      ctx.beginPath();
      ctx.moveTo(-6, 18);
      ctx.lineTo(6, 18);
      ctx.lineTo(0, 18 + flameH);
      ctx.fill();
    }
  }
  ctx.restore();
}

function drawTopDownRock(rock) {
  if (!rock || rock.collected) return;
  const isNear = nearbyRock === rock;

  ctx.save();
  ctx.translate(rock.x, rock.y);

  // Yaklaşınca parlayan mavi tarama halkası
  if (isNear) {
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(0, 0, rock.radius + 10 + Math.sin(animFrame * 0.15) * 2, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Gölge
  ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
  ctx.beginPath();
  ctx.arc(4, 5, rock.radius, 0, Math.PI * 2);
  ctx.fill();

  // Çokgen Kaya Gövdesi
  ctx.fillStyle = rock.color || "#64748b";
  ctx.strokeStyle = "#f8fafc";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-22, 6);
  ctx.lineTo(-16, -16);
  ctx.lineTo(4, -22);
  ctx.lineTo(22, -10);
  ctx.lineTo(18, 12);
  ctx.lineTo(-6, 18);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Taşın ikonu
  ctx.font = "20px 'Segoe UI Emoji', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(rock.icon || "🪨", 0, 0);

  ctx.restore();
}

function drawTopDownAstronaut() {
  ctx.save();
  ctx.translate(astronaut.x, astronaut.y);

  ctx.fillStyle = "#cbd5e1";
  ctx.fillRect(-11, -13, 22, 10);

  ctx.fillStyle = "#f8fafc";
  ctx.strokeStyle = "#1e293b";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, astronaut.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#38bdf8";
  ctx.beginPath();
  ctx.arc(0, 4, 10, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.fill();

  ctx.restore();
}

function drawRockInfoBox(rock) {
  if (!rock || rock.collected) return;

  const boxWidth = 280;
  const boxHeight = 86;
  let boxX = rock.x - boxWidth / 2;
  let boxY = rock.y - rock.radius - boxHeight - 18;

  boxX = Math.max(16, Math.min(canvas.width - boxWidth - 16, boxX));
  if (boxY < 95) boxY = rock.y + rock.radius + 18;

  ctx.save();
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "rgba(15, 23, 42, 0.95)";
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#f8fafc";
  ctx.font = "bold 14px 'Segoe UI', sans-serif";
  ctx.fillText(`${rock.icon} ${rock.name}`, boxX + 12, boxY + 22);

  ctx.fillStyle = "#cbd5e1";
  ctx.font = "12px 'Segoe UI', sans-serif";
  const words = rock.clue.split(" ");
  let line1 = "";
  let line2 = "";
  words.forEach((w) => {
    if ((line1 + w).length < 40) line1 += w + " ";
    else line2 += w + " ";
  });
  ctx.fillText(line1.trim(), boxX + 12, boxY + 41);
  if (line2) ctx.fillText(line2.trim(), boxX + 12, boxY + 56);

  ctx.fillStyle = "#4ade80";
  ctx.font = "bold 11px 'Segoe UI', sans-serif";
  ctx.fillText("Press [ENTER] to collect sample", boxX + 12, boxY + 74);

  ctx.restore();
}

function drawCloud(cx, cy, scale = 1) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  ctx.beginPath();
  ctx.arc(0, 0, 24, 0, Math.PI * 2);
  ctx.arc(22, -6, 28, 0, Math.PI * 2);
  ctx.arc(48, 0, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawScene() {
  animFrame++;
  const w = canvas.width;
  const h = canvas.height;
  const centerY = h * 0.42;

  ctx.clearRect(0, 0, w, h);

  if (currentScene === "earth") {
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.56);
    skyGrad.addColorStop(0, "#0284c7");
    skyGrad.addColorStop(1, "#bae6fd");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "#fde047";
    ctx.beginPath();
    ctx.arc(w * 0.78, h * 0.16, 36, 0, Math.PI * 2);
    ctx.fill();

    const drift = (animFrame * 0.25) % (w + 200);
    drawCloud((drift - 100) % w, h * 0.18, 1.1);
    drawCloud(((drift + w * 0.45) % w), h * 0.25, 0.85);

    const groundY = h * 0.54;
    ctx.fillStyle = "#16a34a";
    ctx.fillRect(0, groundY, w, h - groundY);

    const padX = w * 0.5;
    ctx.fillStyle = "#475569";
    ctx.fillRect(padX - 90, groundY - 12, 180, 16);
    ctx.fillStyle = "#dc2626";
    ctx.fillRect(padX - 58, groundY - 115, 14, 103);
    ctx.fillStyle = "#94a3b8";
    ctx.fillRect(padX - 44, groundY - 85, 30, 6);

    drawRocket(padX, groundY - 38, 0, false);
    requestAnimationFrame(drawScene);
    return;
  }

  if (currentScene === "moon") {
    // Eğer taşlar henüz oluşturulmadıysa otomatik oluştur (kesin çözüm)
    if (surfaceRocks.length === 0) {
      const targetSet =
        typeof targetRocksList !== "undefined"
          ? new Set(targetRocksList.map((t) => t.name))
          : new Set(["Metallic Ilmenite", "Impact Breccia", "White Anorthosite"]);
      setupTopDownMoon(DEFAULT_ROCKS, targetSet);
    }

    ctx.fillStyle = "#334155";
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = "rgba(148, 163, 184, 0.08)";
    ctx.lineWidth = 1;
    for (let gx = 0; gx < w; gx += 60) {
      ctx.beginPath();
      ctx.moveTo(gx, 0);
      ctx.lineTo(gx, h);
      ctx.stroke();
    }
    for (let gy = 0; gy < h; gy += 60) {
      ctx.beginPath();
      ctx.moveTo(0, gy);
      ctx.lineTo(w, gy);
      ctx.stroke();
    }

    craters.forEach((c) => {
      ctx.fillStyle = "#1e293b";
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 3;
      ctx.stroke();
    });

    // İniş Modülü
    ctx.fillStyle = "#eab308";
    ctx.beginPath();
    ctx.arc(w * 0.45, h * 0.15, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#f8fafc";
    ctx.lineWidth = 2;
    ctx.stroke();

    // 6 Taşı Çiz
    surfaceRocks.forEach(drawTopDownRock);

    // Astronotu Hareket Ettir ve Çiz
    updateAstronautMovement();
    drawTopDownAstronaut();

    // Bilgi Kutusunu Çiz
    if (nearbyRock) {
      drawRockInfoBox(nearbyRock);
    }

    requestAnimationFrame(drawScene);
    return;
  }

  ctx.fillStyle = "#040711";
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "#ffffff";
  stars.forEach((s) => {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = "#2563eb";
  ctx.beginPath();
  ctx.arc(w * 0.14, centerY, 65, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#94a3b8";
  ctx.beginPath();
  ctx.arc(w * 0.86, centerY, 42, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(148, 163, 184, 0.3)";
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.moveTo(w * 0.2, centerY);
  ctx.lineTo(w * 0.8, centerY);
  ctx.stroke();
  ctx.setLineDash([]);

  const hoverY = centerY + Math.sin(animFrame * 0.06) * 10;
  if (currentScene === "outbound") {
    drawRocket(w * 0.48, hoverY, Math.PI / 2, true);
  } else {
    drawRocket(w * 0.52, hoverY, -Math.PI / 2, true);
  }

  requestAnimationFrame(drawScene);
}

resizeCanvas();
drawScene();