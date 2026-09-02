// ============================================================
// The Highly Unnecessary Calculation Engine
// All constants are configurable in one place.
// ============================================================

export const AIR_PER_BLOW = 0.5; // litres per human blow
export const ENERGY_PER_BLOW = 0.8; // kcal per blow (theoretical, comedic)
export const LUNG_EXHAUSTION_PER_BLOW = 2.5; // % per blow, capped at 100

export type ObjectKey =
  | "bicycle tyre"
  | "motorcycle tyre"
  | "car tyre"
  | "truck tyre"
  | "football"
  | "basketball"
  | "volleyball"
  | "balloon"
  | "inflatable toy"
  | "other";

export type SizeClass = "small" | "medium" | "large";

export interface ObjectSpec {
  key: ObjectKey;
  label: string;
  emoji: string;
  volumeMin: number;
  volumeMax: number;
  size: SizeClass;
  inflatable: boolean;
}

export const OBJECT_DATA: Record<ObjectKey, ObjectSpec> = {
  "bicycle tyre": { key: "bicycle tyre", label: "Bicycle Tyre", emoji: "🚲", volumeMin: 3, volumeMax: 5, size: "small", inflatable: true },
  "motorcycle tyre": { key: "motorcycle tyre", label: "Motorcycle Tyre", emoji: "🏍️", volumeMin: 15, volumeMax: 25, size: "medium", inflatable: true },
  "car tyre": { key: "car tyre", label: "Car Tyre", emoji: "🚗", volumeMin: 35, volumeMax: 50, size: "large", inflatable: true },
  "truck tyre": { key: "truck tyre", label: "Truck Tyre", emoji: "🚚", volumeMin: 150, volumeMax: 300, size: "large", inflatable: true },
  football: { key: "football", label: "Football", emoji: "⚽", volumeMin: 5, volumeMax: 7, size: "small", inflatable: true },
  basketball: { key: "basketball", label: "Basketball", emoji: "🏀", volumeMin: 7, volumeMax: 9, size: "small", inflatable: true },
  volleyball: { key: "volleyball", label: "Volleyball", emoji: "🏐", volumeMin: 4, volumeMax: 5, size: "small", inflatable: true },
  balloon: { key: "balloon", label: "Balloon", emoji: "🎈", volumeMin: 10, volumeMax: 15, size: "small", inflatable: true },
  "inflatable toy": { key: "inflatable toy", label: "Inflatable Toy", emoji: "🛟", volumeMin: 5, volumeMax: 20, size: "medium", inflatable: true },
  other: { key: "other", label: "Mystery Object", emoji: "❓", volumeMin: 6, volumeMax: 12, size: "medium", inflatable: false },
};

export const MANUAL_CHOICES: ObjectKey[] = [
  "bicycle tyre",
  "motorcycle tyre",
  "car tyre",
  "football",
  "balloon",
  "inflatable toy",
];

const SECONDS_PER_BLOW: Record<SizeClass, number> = { small: 3.5, medium: 4.5, large: 6 };

// Deterministic pseudo-random from a string seed, so results are reproducible.
function seeded(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

const VERDICTS = [
  "Just use a pump.",
  "Congratulations. You reinvented the bicycle pump.",
  "Humanity has officially peaked.",
  "This could have been avoided with ₹50.",
  "Your lungs did not deserve this.",
  "AI has gone too far.",
  "NASA is not calling.",
  "Completely useless. 10/10.",
  "You spent computing power calculating something your local shopkeeper already knows.",
  "Science has left the building.",
];

const AIR_JOKES = [
  "That was basically a human-powered air compressor.",
  "Your lungs have filed a complaint.",
  "You have donated your oxygen to a tyre.",
  "Officially more air than you use in a whole argument.",
];

const ENERGY_JOKES = [
  "Equivalent to approximately 0.3% of one biscuit.",
  "You burned enough energy to regret starting.",
  "That's roughly one-eighth of a samosa. Worth it?",
  "Enough calories to power a single dramatic sigh.",
];

export function lungStatus(pct: number): string {
  if (pct >= 100) return "CONTACT THE NEAREST PUMP. 🚨";
  if (pct >= 81) return "Your lungs are negotiating 🫁";
  if (pct >= 61) return "Why did you agree to this? 💀";
  if (pct >= 41) return "Breathing manually 😭";
  if (pct >= 21) return "Getting suspicious 😐";
  return "Barely breathing 😌";
}

export function easterEgg(key: ObjectKey, blows: number): string | null {
  if (blows > 500) return "THIS IS NO LONGER A PROJECT. THIS IS A CRY FOR HELP.";
  if (blows > 100) return "Please stop. Buy a pump.";
  if (key === "bicycle tyre") return "Ah yes. The classic human-powered bicycle pump.";
  if (key === "car tyre" || key === "truck tyre") return "You have made a terrible decision.";
  if (key === "balloon") return "Finally, a reasonable opponent.";
  if (key === "other") return "This object appears to contain 0% willingness to be inflated.";
  return null;
}

export function formatDuration(totalSeconds: number): string {
  const s = Math.round(totalSeconds);
  const m = Math.floor(s / 60);
  const rem = s % 60;
  if (m === 0) return `${rem} seconds`;
  return `${m} minute${m > 1 ? "s" : ""} ${rem} second${rem === 1 ? "" : "s"}`;
}

export interface Verdict {
  spec: ObjectSpec;
  volume: number;
  blows: number;
  seconds: number;
  timeLabel: string;
  airExpelled: number;
  airJoke: string;
  energy: number;
  energyJoke: string;
  lungExhaustion: number;
  lungStatus: string;
  uselessness: number;
  verdict: string;
  easterEgg: string | null;
}

export function calculate(key: ObjectKey, seed = key): Verdict {
  const spec = OBJECT_DATA[key] ?? OBJECT_DATA.other;
  const r = seeded(seed);
  const volume = Number((spec.volumeMin + (spec.volumeMax - spec.volumeMin) * r).toFixed(1));
  const blows = Math.ceil(volume / AIR_PER_BLOW);
  const seconds = blows * SECONDS_PER_BLOW[spec.size];
  const airExpelled = Number((blows * AIR_PER_BLOW).toFixed(1));
  const energy = Number((blows * ENERGY_PER_BLOW).toFixed(1));
  const lung = Math.min(100, Number((blows * LUNG_EXHAUSTION_PER_BLOW).toFixed(1)));
  const uselessness = Number(
    Math.min(99.9, 82 + (blows % 7) + lung / 12 + (spec.size === "large" ? 3 : 0)).toFixed(1),
  );

  const pick = <T,>(arr: T[], offset: number) => arr[Math.floor(r * arr.length + offset) % arr.length];

  return {
    spec,
    volume,
    blows,
    seconds,
    timeLabel: formatDuration(seconds),
    airExpelled,
    airJoke: pick(AIR_JOKES, 1),
    energy,
    energyJoke: pick(ENERGY_JOKES, 2),
    lungExhaustion: lung,
    lungStatus: lungStatus(lung),
    uselessness,
    verdict: pick(VERDICTS, blows),
    easterEgg: easterEgg(spec.key, blows),
  };
}
