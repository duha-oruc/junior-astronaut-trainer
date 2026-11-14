const NASA_API_KEY = NASA_API_KEY; // Test için "DEMO_KEY" de çalışır

// Canlı verileri tutacak global nesne (API yavaş kalırsa varsayılan değerler hazır bekler)
let liveNasaData = {
  solarFlareClass: "M2.1",
  solarFlareDate: "Recent Solar Cycle",
  nearestAsteroidName: "2026 XQ1",
  nearestAsteroidSpeed: "42,500",
  isLive: false
};

async function fetchLiveNasaTelemetry() {
  const today = new Date().toISOString().split("T")[0];
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  try {
    // 1. DONKI Güneş Patlaması Verisi (Son 7 gün)
    const flrRes = await fetch(
      `https://api.nasa.gov/DONKI/FLR?startDate=${weekAgo}&endDate=${today}&api_key=${NASA_API_KEY}`
    );
    const flrData = await flrRes.json();

    if (Array.isArray(flrData) && flrData.length > 0) {
      const latestFlare = flrData[flrData.length - 1];
      liveNasaData.solarFlareClass = latestFlare.classType || "M1.5";
      liveNasaData.solarFlareDate = latestFlare.beginTime.split("T")[0];
      liveNasaData.isLive = true;
    }

    // 2. NeoWs Yakın Dünya Asteroidi Verisi (Bugün)
    const neoRes = await fetch(
      `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${NASA_API_KEY}`
    );
    const neoData = await neoRes.json();
    const todayNeos = neoData.near_earth_objects?.[today];

    if (todayNeos && todayNeos.length > 0) {
      const asteroid = todayNeos[0];
      liveNasaData.nearestAsteroidName = asteroid.name.replace(/[()]/g, "");
      const speedKmh = Math.round(
        parseFloat(asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour)
      );
      liveNasaData.nearestAsteroidSpeed = speedKmh.toLocaleString("en-US");
      liveNasaData.isLive = true;
    }

    console.log("NASA Live Telemetry Loaded:", liveNasaData);
  } catch (err) {
    console.warn("NASA API unreachable, using fallback telemetry:", err);
  }
}

// Sayfa açılır açılmaz arka planda verileri çek
fetchLiveNasaTelemetry();