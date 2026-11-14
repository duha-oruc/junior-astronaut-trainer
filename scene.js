const canvas = document.getElementById("space-canvas");
const ctx = canvas.getContext("2d");

// Sahneler: "earth" (Dünya fırlatma rampası), "outbound" (Ay'a gidiş), "moon" (Ay yüzeyi), "return" (Dünya'ya dönüş)
let currentScene = "earth";
let animFrame = 0;
let stars = [];

let surfaceRocks = [];
let hoveredRock = null;
let mousePos = { x: 0, y: 0 };

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
  layoutSurfaceRocks();
}

window.addEventListener("resize", resizeCanvas);

function setupSurfaceRocks(rockDataList) {
  const shuffled = [...rockDataList].sort(() => Math.random() - 0.5);
  const xRatios = [0.38, 0.54, 0.70, 0.85];
  const yOffsets = [28, 52, 22, 46];
  const colors = {
    "White Anorthosite": "#e2e8f0",
    "Dark Metallic Ilmenite": "#1e293b",
    "Glass-Bead Regolith": "#fb923c",
    "Lunar Breccia": "#94a3b8"
  };

  surfaceRocks = shuffled.map((rock, idx) => ({
    ...rock,
    xRatio: xRatios[idx],
    yOffset: yOffsets[idx],
    radius: 26,
    color: colors[rock.name] || "#64748b",
    collected: false,
    x: 0,
    y: 0
  }));
  layoutSurfaceRocks();
}

function layoutSurfaceRocks() {
  const groundY = canvas.height * 0.52;
  surfaceRocks.forEach((r) => {
    r.x = canvas.width * r.xRatio;
    r.y = groundY + r.yOffset;
  });
}

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mousePos.x = e.clientX - rect.left;
  mousePos.y = e.clientY - rect.top;

  if (currentScene !== "moon" || surfaceRocks.length === 0) {
    hoveredRock = null;
    canvas.style.cursor = "default";
    return;
  }

  hoveredRock = null;
  for (const rock of surfaceRocks) {
    if (rock.collected) continue;
    const dist = Math.hypot(mousePos.x - rock.x, mousePos.y - rock.y);
    if (dist <= rock.radius + 8) {
      hoveredRock = rock;
      break;
    }
  }

  canvas.style.cursor = hoveredRock ? "pointer" : "default";
});

canvas.addEventListener("click", () => {
  if (currentScene === "moon" && hoveredRock && !hoveredRock.collected) {
    if (typeof handleRockClick === "function") {
      handleRockClick(hoveredRock);
    }
  }
});

function drawRocket(x, y, angle = 0, showFlame = true) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.scale(1.4, 1.4);

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

function drawRockShape(rock) {
  if (rock.collected) return;
  const isHovered = hoveredRock === rock;

  ctx.save();
  ctx.translate(rock.x, rock.y);

  if (isHovered) {
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, rock.radius + 7 + Math.sin(animFrame * 0.15) * 2, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.fillStyle = rock.color;
  ctx.strokeStyle = "#0f172a";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-22, 6);
  ctx.lineTo(-16, -16);
  ctx.lineTo(4, -22);
  ctx.lineTo(22, -10);
  ctx.lineTo(18, 12);
  ctx.lineTo(-6, 16);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  if (rock.isTarget) {
    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(-6, -8, 4, 4);
    ctx.fillRect(6, -2, 3, 3);
    ctx.fillRect(-2, 4, 4, 3);
  }

  ctx.restore();
}

function drawTooltip(rock) {
  if (!rock || rock.collected) return;

  const boxWidth = 270;
  const boxHeight = 76;
  let boxX = rock.x - boxWidth / 2;
  let boxY = rock.y - rock.radius - boxHeight - 16;

  boxX = Math.max(16, Math.min(canvas.width - boxWidth - 16, boxX));
  if (boxY < 90) boxY = rock.y + rock.radius + 16;

  ctx.save();
  ctx.fillStyle = "rgba(15, 23, 42, 0.94)";
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
    if ((line1 + w).length < 38) line1 += w + " ";
    else line2 += w + " ";
  });
  ctx.fillText(line1.trim(), boxX + 12, boxY + 42);
  if (line2) ctx.fillText(line2.trim(), boxX + 12, boxY + 58);

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
    // 1. Açık Hava Mavi Gökyüzü Gradyanı
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.56);
    skyGrad.addColorStop(0, "#0284c7");
    skyGrad.addColorStop(1, "#bae6fd");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    // Güneş
    ctx.fillStyle = "#fde047";
    ctx.beginPath();
    ctx.arc(w * 0.78, h * 0.16, 36, 0, Math.PI * 2);
    ctx.fill();

    // Yavaşça kayan bulutlar
    const drift = (animFrame * 0.25) % (w + 200);
    drawCloud((drift - 100) % w, h * 0.18, 1.1);
    drawCloud(((drift + w * 0.45) % w), h * 0.25, 0.85);

    // 2. Yeşil Yeryüzü Çimeni
    const groundY = h * 0.54;
    ctx.fillStyle = "#16a34a";
    ctx.fillRect(0, groundY, w, h - groundY);

    // 3. Fırlatma Rampası (Beton Platform ve Çelik Kule)
    const padX = w * 0.5;
    ctx.fillStyle = "#475569";
    ctx.fillRect(padX - 90, groundY - 12, 180, 16); // Beton platform

    // Fırlatma Kulesi
    ctx.fillStyle = "#dc2626";
    ctx.fillRect(padX - 58, groundY - 115, 14, 103);
    ctx.fillStyle = "#94a3b8";
    ctx.fillRect(padX - 44, groundY - 85, 30, 6); // Yakıt/Erişim kolu

    // Rampada bekleyen roket (henüz ateşlenmediği için motor alevi kapalı)
    drawRocket(padX, groundY - 38, 0, false);
    requestAnimationFrame(drawScene);
    return;
  }

  // UZAY ARKA PLANI (outbound, moon, return)
  ctx.fillStyle = "#040711";
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "#ffffff";
  stars.forEach((s) => {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  });

  if (currentScene === "outbound" || currentScene === "return") {
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
  } else if (currentScene === "moon") {
    const groundY = h * 0.52;
    ctx.fillStyle = "#475569";
    ctx.fillRect(0, groundY, w, h - groundY);

    ctx.fillStyle = "#334155";
    ctx.beginPath();
    ctx.ellipse(w * 0.15, groundY + 45, 55, 13, 0, 0, Math.PI * 2);
    ctx.ellipse(w * 0.62, groundY + 65, 70, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    drawRocket(w * 0.14, groundY - 26, 0, false);

    const astroX = w * 0.26;
    const astroY = groundY - 28;
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(astroX, astroY, 20, 28);
    ctx.beginPath();
    ctx.arc(astroX + 10, astroY - 10, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(astroX + 5, astroY - 15, 13, 9);

    surfaceRocks.forEach(drawRockShape);

    if (hoveredRock) {
      drawTooltip(hoveredRock);
    }
  }

  requestAnimationFrame(drawScene);
}

resizeCanvas();
drawScene();