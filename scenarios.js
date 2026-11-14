const OUTBOUND_CRISES = [
  {
    nasaTag: "NASA SOHO DATA: SOLAR PARTICLE EVENT",
    title: "☀️ Solar Storm in Lunar Orbit!",
    desc: "High-energy charged particles from the Sun are hitting your spacecraft. Boosting the radiation shields will drain extra battery power.",
    choices: [
      {
        text: "🛡️ Boost Radiation Shields (Power -25, Shield +15)",
        effects: { power: -25, oxygen: -5, shield: +15 },
        feedback: "Shields blocked the solar radiation! Systems are safe for lunar descent."
      },
      {
        text: "⚡ Conserve Power & Descend Fast (Power -5, Oxygen -10, Shield -30)",
        effects: { power: -5, oxygen: -10, shield: -30 },
        feedback: "You saved battery power, but the solar storm weakened your shields!"
      }
    ]
  },
  {
    nasaTag: "NASA LRO DATA: MICROMETEOROID STREAM",
    title: "☄️ Space Dust & Micrometeoroids!",
    desc: "Sensors detect fast-moving space dust particles crossing your flight path toward the Moon.",
    choices: [
      {
        text: "🚀 Fire Thrusters to Evade (Power -20, Oxygen -10, Shield +5)",
        effects: { power: -20, oxygen: -10, shield: +5 },
        feedback: "Clean maneuver! You dodged the debris field without hull damage."
      },
      {
        text: "🛡️ Hold Course & Rely on Hull Armor (Power -5, Shield -25)",
        effects: { power: -5, oxygen: -5, shield: -25 },
        feedback: "You kept your trajectory, though small impacts dented the outer shield."
      }
    ]
  }
];

const MOON_MISSION = {
  nasaTag: "NASA APOLLO / ARTEMIS GEOLOGY DATA",
  title: "🌑 Lunar Surface Task: Find the Ilmenite Rock!",
  desc: "NASA scientists need dark, heavy, metallic-sparkling 'Ilmenite' rich in titanium to produce oxygen and rocket fuel on the Moon. Pick the right sample!",
  rocks: [
    {
      icon: "🪨",
      name: "White Anorthosite",
      clue: "Light-colored highland crust rock rich in calcium and aluminum.",
      isTarget: false,
      wrongMsg: "That's an ancient highland rock, not rich in titanium! Keep searching (-10 Oxygen)."
    },
    {
      icon: "🌑",
      name: "Dark Metallic Ilmenite",
      clue: "Dark gray-black, heavy mineral with a metallic shine rich in titanium.",
      isTarget: true,
      successMsg: "Awesome! You collected Ilmenite. Future Moon bases can extract oxygen from this mineral!"
    },
    {
      icon: "🧱",
      name: "Glass-Bead Regolith",
      clue: "Tiny orange volcanic glass beads formed by ancient lava fountains.",
      isTarget: false,
      wrongMsg: "Cool volcanic glass beads, but not the titanium mineral we need! (-10 Oxygen)."
    },
    {
      icon: "🏔️",
      name: "Lunar Breccia",
      clue: "Angular rock fragments fused together by meteorite impacts.",
      isTarget: false,
      wrongMsg: "This is a mix of crushed rocks, not pure Ilmenite! (-10 Oxygen)."
    }
  ]
};

const RETURN_CRISES = [
  {
    nasaTag: "NASA ORION DATA: ATMOSPHERIC RE-ENTRY",
    title: "🔥 Earth Re-Entry: Heat Shield Alert!",
    desc: "Your capsule is entering Earth's atmosphere at 40,000 km/h! Friction will heat the outside to 2,700°C.",
    choices: [
      {
        text: "🛡️ Divert Remaining Power to Heat Shield (Power -25, Oxygen -10, Shield +15)",
        effects: { power: -25, oxygen: -10, shield: +15 },
        feedback: "The heat shield held strong and parachutes deployed safely over the ocean!"
      },
      {
        text: "🫧 Keep Cabin Life Support at Max (Power -10, Oxygen +10, Shield -25)",
        effects: { power: -10, oxygen: +10, shield: -25 },
        feedback: "Cabin air stayed fresh, though intense heat pushed your shields to the limit!"
      }
    ]
  }
];