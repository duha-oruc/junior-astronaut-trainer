const PRELAUNCH_CHECKS = [
  {
    id: "waterWall",
    nasaTag: "NASA DEEP SPACE HABITAT: WATER WALL SHIELDING",
    title: "💧 Step 1/3: Build the Water Wall Shield?",
    desc: "Water tanks around the crew cabin block solar radiation! Installing them keeps your life support running smoothly.",
    choices: [
      {
        text: "🛡️ Install Water Wall Around Cabin (Full +20s Oxygen Reserve)",
        timeBonus: 20,
        feedback: "Water Wall installed! Maximum radiation protection secured (+20s)."
      },
      {
        text: "⏩ Skip Water Wall to Launch Faster (+8s Only)",
        timeBonus: 8,
        feedback: "Skipped Water Wall! Less radiation shielding means tighter oxygen reserves (+8s)."
      }
    ]
  },
  {
    id: "oxygenCheck",
    nasaTag: "NASA ARTEMIS EVA SUIT TELEMETRY",
    title: "🫧 Step 2/3: Spacesuit Oxygen Valve Pressure Test?",
    desc: "Checking all suit seals prevents slow oxygen leaks during your Moonwalk.",
    choices: [
      {
        text: "🔧 Run Full Seal Check (+20s Oxygen Reserve)",
        timeBonus: 20,
        feedback: "Seals are 100% airtight! Zero oxygen leaks (+20s)."
      },
      {
        text: "⚡ Skip Valve Check (+8s Only)",
        timeBonus: 8,
        feedback: "Warning: Minor valve leak detected! Your mission time is shorter (+8s)."
      }
    ]
  },
  {
    id: "solarCharge",
    nasaTag: "NASA ORION POWER SUBSYSTEM",
    title: "🔋 Step 3/3: Supercharge Life-Support Batteries?",
    desc: "Fully charged batteries keep your cabin oxygen scrubbers running at peak efficiency.",
    choices: [
      {
        text: "⚡ Full Supercharge Before Liftoff (+20s Oxygen Reserve)",
        timeBonus: 20,
        feedback: "Batteries at 100%! Life support is ready for the full trip (+20s)."
      },
      {
        text: "🚀 Launch Immediately on Standard Charge (+8s Only)",
        timeBonus: 8,
        feedback: "Launched on partial battery! Watch the clock carefully (+8s)."
      }
    ]
  }
];

const MOON_MISSION = {
  nasaTag: "NASA ARTEMIS GEOLOGY SURVEY",
  title: "🌑 Lunar Surface EVA: Collect Target Samples!",
  desc: "Use WASD or Arrow Keys to walk across the lunar surface. Approach a rock to scan its info box, and press ENTER to collect the minerals on your checklist!",
  allRocks: [
    {
      icon: "🌑",
      name: "Metallic Ilmenite",
      color: "#1e293b",
      clue: "Dark titanium-iron oxide mineral used to produce lunar oxygen."
    },
    {
      icon: "🪨",
      name: "White Anorthosite",
      color: "#e2e8f0",
      clue: "Light-colored ancient highland crust rock rich in calcium."
    },
    {
      icon: "🧱",
      name: "Orange Glass Regolith",
      color: "#fb923c",
      clue: "Volcanic glass beads formed by ancient lunar fire fountains."
    },
    {
      icon: "🏔️",
      name: "Impact Breccia",
      color: "#94a3b8",
      clue: "Sharp rock fragments welded together by meteorite impacts."
    },
    {
      icon: "🌋",
      name: "Mare Basalt",
      color: "#475569",
      clue: "Dark, heavy volcanic lava rock from ancient lunar seas."
    },
    {
      icon: "💎",
      name: "Green Olivine",
      color: "#4ade80",
      clue: "Crystalline magnesium-iron silicate from the Moon's deep mantle."
    }
  ]
};

const RETURN_CRISES = [
  {
    nasaTag: "NASA ORION DATA: ATMOSPHERIC RE-ENTRY",
    title: "🔥 Earth Re-Entry: Heat Shield Alert!",
    desc: "Your capsule is entering Earth's atmosphere at 40,000 km/h! Choose your re-entry profile carefully.",
    choices: [
      {
        text: "🛡️ Guided Aerobraking Entry (Safe & Steady: +5s)",
        timeDelta: +5,
        feedback: "Smooth entry angle! Heat shield held strong and parachutes deployed safely."
      },
      {
        text: "🔥 Steep Direct Dive (High Cabin Stress: -15s)",
        timeDelta: -15,
        feedback: "Intense heat forced emergency cooling systems to burn extra oxygen!"
      }
    ]
  },
  {
    nasaTag: "NASA VAN ALLEN PROBES DATA: RADIATION BELT",
    title: "☢️ Crossing the Van Allen Radiation Belts!",
    desc: "Your spacecraft is passing through trapped high-energy particles around Earth's magnetic field.",
    choices: [
      {
        text: "🧭 High-Inclination Bypass Trajectory (+5s)",
        timeDelta: +5,
        feedback: "Smart navigation! You skirted the densest radiation zone safely."
      },
      {
        text: "⚡ Cut Straight Through the Belt (-15s)",
        timeDelta: -15,
        feedback: "Radiation alarms triggered emergency life-support scrubbers!"
      }
    ]
  },
  {
    nasaTag: "NASA ECLSS DATA: CO2 SCRUBBER LOAD",
    title: "🫧 Cabin Carbon Dioxide Spike!",
    desc: "After working on the Moon, cabin CO2 levels are rising during the return burn.",
    choices: [
      {
        text: "🌬️ Activate Dual-Bed CO2 Scrubber (+5s)",
        timeDelta: +5,
        feedback: "Air scrubbers cleared the CO2 immediately and stabilized oxygen!"
      },
      {
        text: "⏳ Wait Until Splashdown (-15s)",
        timeDelta: -15,
        feedback: "Rising CO2 drained your breathable oxygen reserve rapidly!"
      }
    ]
  },
  {
    nasaTag: "NASA ORION RECOVERY: SPLASHDOWN WEATHER",
    title: "🌊 High Winds at Pacific Splashdown Zone!",
    desc: "Recovery ships report strong crosswinds at the landing zone.",
    choices: [
      {
        text: "🎯 Precision Thruster Correction (+5s)",
        timeDelta: +5,
        feedback: "Pinpoint splashdown right next to the NASA recovery ship!"
      },
      {
        text: "🪂 Drift With the Crosswind (-15s)",
        timeDelta: -15,
        feedback: "Rough splashdown far from the ship delayed hatch opening!"
      }
    ]
  }
];