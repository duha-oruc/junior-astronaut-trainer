const canvas = document.getElementById("space-canvas");
const ctx = canvas.getContext("2d");

let currentScene = "outbound";
let animFrame = 0;
let stars = [];

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
resizeCanvas();

function drawRocket(x, y, angle = 0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.scale(1.4, 1.4); // Tam ekranda daha belirgin görünmesi için ölçek büyütüldü

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

    const flameH = 12 + Math.sin(animFrame * 0.4) * 6;
    ctx.fillStyle = "#facc15";
    ctx.beginPath();
    ctx.moveTo(-6, 18);
    ctx.lineTo(6, 18);
    ctx.lineTo(0, 18 + flameH);
    ctx.fill();
  }
  ctx.restore();
}

function drawScene() {
  animFrame++;
  const w = canvas.width;
  const h = canvas.height;
  const centerY = h * 0.42; // Alt yazı kutusunun üstünde kalacak merkez hizası

  ctx.clearRect(0, 0, w, h);

  // Uzay Arka Planı
  ctx.fillStyle = "#040711";
  ctx.fillRect(0, 0, w, h);

  // Yıldızlar
  ctx.fillStyle = "#ffffff";
  stars.forEach((s) => {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
  });

  if (currentScene === "outbound" || currentScene === "return") {
    // Sol tarafta Dünya
    ctx.fillStyle = "#2563eb";
    ctx.beginPath();
    ctx.arc(w * 0.14, centerY, 65, 0, Math.PI * 2);
    ctx.fill();

    // Sağ tarafta Ay
    ctx.fillStyle = "#94a3b8";
    ctx.beginPath();
    ctx.arc(w * 0.86, centerY, 42, 0, Math.PI * 2);
    ctx.fill();

    // Rota Çizgisi
    ctx.strokeStyle = "rgba(148, 163, 184, 0.3)";
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(w * 0.2, centerY);
    ctx.lineTo(w * 0.8, centerY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Roket
    const hoverY = centerY + Math.sin(animFrame * 0.06) * 10;
    if (currentScene === "outbound") {
      drawRocket(w * 0.48, hoverY, Math.PI / 2);
    } else {
      drawRocket(w * 0.52, hoverY, -Math.PI / 2);
    }
  } else if (currentScene === "moon") {
    // Ay Yüzeyi Zemini
    const groundY = h * 0.52;
    ctx.fillStyle = "#475569";
    ctx.fillRect(0, groundY, w, h - groundY);

    // Kraterler
    ctx.fillStyle = "#334155";
    ctx.beginPath();
    ctx.ellipse(w * 0.3, groundY + 40, 60, 14, 0, 0, Math.PI * 2);
    ctx.ellipse(w * 0.72, groundY + 55, 80, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // İniş Yapmış Roket
    drawRocket(w * 0.22, groundY - 26, 0);

    // Astronot
    const astroX = w * 0.42;
    const astroY = groundY - 28;
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(astroX, astroY, 20, 28);
    ctx.beginPath();
    ctx.arc(astroX + 10, astroY - 10, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(astroX + 5, astroY - 15, 13, 9);
  }

  requestAnimationFrame(drawScene);
}

drawScene();