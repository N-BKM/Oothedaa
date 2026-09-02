import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AIR_PER_BLOW,
  ENERGY_PER_BLOW,
  MANUAL_CHOICES,
  OBJECT_DATA,
  calculate,
  type ObjectKey,
  type Verdict,
} from "@/lib/calculator";
import { analyzeImage } from "@/lib/vision.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Oothedaa!! — AI Blow Counting Calculator 💨" },
      {
        name: "description",
        content:
          "Oothedaa!! Upload a tyre, ball or balloon and our unnecessary AI calculates how many human blows it takes to inflate it.",
      },
      { property: "og:title", content: "Oothedaa!! — AI Blow Counting Calculator 💨" },
      {
        property: "og:description",
        content: "Scientifically questionable. Emotionally accurate. Just use a pump.",
      },
    ],
  }),
  component: Home,
});

const LOADING_MESSAGES = [
  "🔍 Asking AI what this thing is…",
  "🧠 Consulting the world's most unnecessary database…",
  "📐 Doing extremely serious mathematics…",
  "🫁 Measuring imaginary lung damage…",
  "💨 Counting imaginary breaths…",
  "🤖 Making technology regret its existence…",
];

const MAX_BYTES = 5 * 1024 * 1024;

async function compressImage(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(String(fr.result));
    fr.onerror = () => reject(new Error("Could not read the file."));
    fr.readAsDataURL(file);
  });
  const img = new Image();
  img.src = dataUrl;
  await new Promise((res, rej) => {
    img.onload = res;
    img.onerror = () => rej(new Error("Could not decode the image."));
  });
  const max = 768;
  const scale = Math.min(1, max / Math.max(img.width, img.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.8);
}

type Stage = "landing" | "upload" | "loading" | "manual" | "results";

function Home() {
  const analyze = useServerFn(analyzeImage);
  const [stage, setStage] = useState<Stage>("landing");
  const [preview, setPreview] = useState<string | null>(null);
  const [msgIndex, setMsgIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [unknown, setUnknown] = useState(false);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [result, setResult] = useState<Verdict | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (stage !== "loading") return;
    const id = setInterval(() => setMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length), 1600);
    return () => clearInterval(id);
  }, [stage]);

  const finish = useCallback((key: ObjectKey, conf: number | null, seed: string) => {
    setConfidence(conf);
    setResult(calculate(key, seed));
    setStage("results");
  }, []);

  const handleFile = useCallback(
    async (file: File | undefined) => {
      if (!file) return;
      setError(null);
      setUnknown(false);
      if (!/^image\/(jpeg|jpg|png|webp)$/.test(file.type)) {
        setError("Only JPG, PNG or WEBP. Our AI is picky and underpaid.");
        return;
      }
      if (file.size > MAX_BYTES) {
        setError("That image is over 5 MB. Even our servers need to breathe.");
        return;
      }
      try {
        const compressed = await compressImage(file);
        setPreview(compressed);
        setStage("loading");
        const res = await analyze({ data: { imageDataUrl: compressed } });
        if (res.ok && res.object) {
          finish(res.object, res.confidence ?? null, `${res.object}-${file.size}`);
        } else if (res.reason === "unknown-object") {
          setUnknown(true);
          setStage("manual");
        } else {
          setError(res.reason ?? "Our AI is taking a nap.");
          setStage("manual");
        }
      } catch {
        setError("Our AI is taking a nap. Pick the object manually.");
        setStage("manual");
      }
    },
    [analyze, finish],
  );

  const reset = () => {
    setPreview(null);
    setResult(null);
    setError(null);
    setUnknown(false);
    setConfidence(null);
    setStage("upload");
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-10 px-4 py-10">
      <header className="text-center">
        <p className="inline-block toon-sm bg-sun px-6 py-2 text-3xl font-black uppercase tracking-widest animate-wobble md:text-5xl">
          Oothedaa!!
        </p>
      </header>


      {stage === "landing" && <Landing onStart={() => setStage("upload")} />}

      {stage === "upload" && (
        <Uploader
          error={error}
          inputRef={inputRef}
          onFile={handleFile}
          onManual={() => setStage("manual")}
        />
      )}

      {stage === "loading" && (
        <section className="toon bg-card p-10 text-center">
          {preview && (
            <img
              src={preview}
              alt="Uploaded inflatable object being analysed"
              className="mx-auto mb-6 h-48 w-48 rounded-2xl border-4 border-foreground object-cover animate-bob"
            />
          )}
          <p className="text-2xl font-black">{LOADING_MESSAGES[msgIndex]}</p>
          <p className="mt-3 text-lg text-muted-foreground">
            Please wait. Very important science is happening.
          </p>
        </section>
      )}

      {stage === "manual" && (
        <ManualPicker
          unknown={unknown}
          error={error}
          onPick={(k) => finish(k, null, `${k}-manual`)}
          onRetry={reset}
        />
      )}

      {stage === "results" && result && (
        <Results result={result} confidence={confidence} preview={preview} onAgain={reset} />
      )}

      <HowWeCalculated />

      <footer className="pb-6 text-center text-sm text-muted-foreground">
        Powered by questionable science and unnecessarily advanced technology.
      </footer>
    </main>
  );
}

function Landing({ onStart }: { onStart: () => void }) {
  return (
    <section className="toon bg-card p-8 text-center md:p-14">
      <h1 className="text-5xl font-black leading-tight md:text-7xl">
        HOW MANY BLOWS? <span className="inline-block animate-bob">💨</span>
      </h1>
      <p className="mt-4 text-xl font-bold md:text-2xl">
        Because apparently, we needed technology to answer this.
      </p>
      <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
        Upload a tyre, ball, balloon or any inflatable object. Our highly unnecessary AI will
        calculate how many human blows it takes to fill it.
      </p>
      <button
        onClick={onStart}
        className="toon-sm mt-8 bg-tangerine px-8 py-4 text-xl font-black transition-transform hover:-translate-y-1 active:translate-y-1 active:shadow-none"
      >
        🚀 CALCULATE MY SUFFERING
      </button>
      <p className="mt-5 text-base text-muted-foreground">
        Powered by questionable science and unnecessarily advanced technology.
      </p>
    </section>
  );
}

function Uploader({
  error,
  inputRef,
  onFile,
  onManual,
}: {
  error: string | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onFile: (f: File | undefined) => void;
  onManual: () => void;
}) {
  const [drag, setDrag] = useState(false);
  return (
    <section className="toon bg-card p-8 text-center">
      <h2 className="text-3xl font-black">📸 Show me the thing you want to suffer for.</h2>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          onFile(e.dataTransfer.files[0]);
        }}
        onClick={() => inputRef.current?.click()}
        className={`toon-sm mt-6 cursor-pointer border-dashed p-12 transition-colors ${
          drag ? "bg-sky" : "bg-muted"
        }`}
      >
        <p className="text-6xl">🛞</p>
        <p className="mt-4 text-lg font-black">Drop an image here, or click to choose one</p>
        <p className="mt-1 text-base text-muted-foreground">JPG · JPEG · PNG · WEBP · max 5 MB</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0])}
      />
      {error && <p className="mt-4 text-lg font-bold text-destructive">{error}</p>}
      <button onClick={onManual} className="mt-6 text-base font-bold underline">
        No photo? Pick the object manually →
      </button>
    </section>
  );
}

function ManualPicker({
  unknown,
  error,
  onPick,
  onRetry,
}: {
  unknown: boolean;
  error: string | null;
  onPick: (k: ObjectKey) => void;
  onRetry: () => void;
}) {
  return (
    <section className="toon bg-card p-8 text-center">
      <h2 className="text-3xl font-black">
        {unknown ? "🤔 I have no idea what this is." : "😴 Our AI is taking a nap."}
      </h2>
      <p className="mt-3 text-lg text-muted-foreground">
        {unknown
          ? "Try uploading a clearer picture of a tyre, ball, balloon or another inflatable object."
          : error ?? "Pick the object manually and we'll carry on regardless."}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {MANUAL_CHOICES.map((k) => {
          const spec = OBJECT_DATA[k];
          return (
            <button
              key={k}
              onClick={() => onPick(k)}
              className="toon-sm bg-sky px-5 py-3 font-black transition-transform hover:-translate-y-1 active:translate-y-1 active:shadow-none"
            >
              {spec.emoji} {spec.label}
            </button>
          );
        })}
      </div>
      <button
        onClick={onRetry}
        className="toon-sm mt-8 bg-sun px-6 py-3 font-black transition-transform hover:-translate-y-1"
      >
        🔄 TRY AGAIN
      </button>
    </section>
  );
}

function Stat({
  emoji,
  label,
  value,
  note,
  color,
}: {
  emoji: string;
  label: string;
  value: string;
  note?: string;
  color: string;
}) {
  return (
    <div className={`toon-sm ${color} p-5`}>
      <p className="text-sm font-black uppercase tracking-wide">
        {emoji} {label}
      </p>
      <p className="mt-2 text-4xl font-black">{value}</p>
      {note && <p className="mt-2 text-base font-bold opacity-80">{note}</p>}
    </div>
  );
}

function Results({
  result,
  confidence,
  preview,
  onAgain,
}: {
  result: Verdict;
  confidence: number | null;
  preview: string | null;
  onAgain: () => void;
}) {
  const [shared, setShared] = useState(false);

  const share = async () => {
    const text = `HOW MANY BLOWS?\nObject: ${result.spec.label}\nBlows: ${result.blows}\nLung Exhaustion: ${result.lungExhaustion}%\nUselessness Score: ${result.uselessness}%\n"I used AI to calculate something a pump could solve."`;
    try {
      if (navigator.share) await navigator.share({ title: "How Many Blows?", text });
      else await navigator.clipboard.writeText(text);
      setShared(true);
      setTimeout(() => setShared(false), 2500);
    } catch {
      /* the user changed their mind about public humiliation */
    }
  };

  const inflatable = result.spec.inflatable;

  if (!inflatable) {
    return (
      <section className="flex flex-col gap-6">
        <div className="toon bg-card p-8 text-center">
          <h2 className="text-4xl font-black md:text-5xl">🤨 THIS THING REFUSES TO INFLATE</h2>
          {preview && (
            <img
              src={preview}
              alt="Uploaded object that cannot be inflated"
              className="mx-auto mt-5 h-40 w-40 rounded-2xl border-4 border-foreground object-cover"
            />
          )}
          <p className="mt-5 text-2xl font-black">
            Either I have no idea what this is, or it simply cannot be inflated.
          </p>
          <p className="mt-3 text-lg font-bold text-muted-foreground">
            So there is nothing to calculate. No blows. No numbers. Only judgement.
          </p>
          <p className="toon-sm mx-auto mt-6 max-w-md bg-bubblegum px-5 py-3 text-xl font-black animate-wobble">
            “{result.easterEgg ?? "This object appears to contain 0% willingness to be inflated."}”
          </p>
          <p className="toon-sm mx-auto mt-4 max-w-md bg-sun px-5 py-3 text-lg font-black">
            “Congratulations, you made AI stare at something pointless. Twice.”
          </p>
        </div>

        <div className="toon bg-sun p-8 text-center">
          <h3 className="text-2xl font-black uppercase tracking-widest">Final Verdict</h3>
          <p className="mt-3 text-3xl font-black">“Oothedaa!! …actually, don't. It won't work.”</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={onAgain}
            className="toon-sm bg-tangerine px-6 py-4 text-lg font-black transition-transform hover:-translate-y-1 active:translate-y-1 active:shadow-none"
          >
            🔄 Try A Real Inflatable
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="toon bg-card p-8 text-center">
        <h2 className="text-4xl font-black md:text-5xl">
          {result.spec.emoji} YOUR OBJECT HAS BEEN JUDGED
        </h2>
        <p className="mt-3 text-xl font-bold">🔍 I have investigated the object…</p>
        {preview && (
          <img
            src={preview}
            alt={`Uploaded ${result.spec.label}`}
            className="mx-auto mt-5 h-40 w-40 rounded-2xl border-4 border-foreground object-cover"
          />
        )}
        <p className="mt-5 text-2xl font-black">
          Detected object: {result.spec.label} {result.spec.emoji}
        </p>
        <p className="text-base font-bold text-muted-foreground">
          Confidence: {confidence !== null ? `${confidence}%` : "chosen by a human, so 100%"}
        </p>
        <p className="mt-4 text-xl font-black">
          💨 Estimated air required: {result.volume} L
        </p>
        <p className="text-base text-muted-foreground">Scientifically questionable. Emotionally accurate.</p>
        {result.easterEgg && (
          <p className="toon-sm mx-auto mt-6 max-w-md bg-bubblegum px-5 py-3 text-xl font-black animate-wobble">
            “{result.easterEgg}”
          </p>
        )}
      </div>


      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Stat emoji="💨" label="Total Blows" value={String(result.blows)} color="bg-sun" />
        <Stat
          emoji="⏱️"
          label="Inflation Time"
          value={result.timeLabel}
          note="Congratulations. You have chosen suffering."
          color="bg-sky"
        />
        <Stat
          emoji="🫁"
          label="Air Expelled"
          value={`${result.airExpelled} L`}
          note={result.airJoke}
          color="bg-lime"
        />
        <Stat
          emoji="🔥"
          label="Energy Wasted"
          value={`${result.energy} kcal`}
          note={result.energyJoke}
          color="bg-tangerine"
        />
        <Stat
          emoji="🏆"
          label="Uselessness Score"
          value={`${result.uselessness}%`}
          note="Technology has successfully solved a problem nobody had."
          color="bg-bubblegum"
        />
        <div className="toon-sm bg-card p-5">
          <p className="text-sm font-black uppercase tracking-wide">🫁 Lung Exhaustion</p>
          <p className="mt-2 text-4xl font-black">{result.lungExhaustion}%</p>
          <div className="mt-3 h-5 w-full overflow-hidden rounded-full border-[3px] border-foreground bg-muted">
            <div
              className="h-full bg-destructive transition-all duration-1000"
              style={{ width: `${result.lungExhaustion}%` }}
            />
          </div>
          <p className="mt-2 text-lg font-black">{result.lungStatus}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Lung Exhaustion is a completely unofficial metric created for entertainment.
          </p>
        </div>
      </div>

      <div className="toon bg-sun p-8 text-center">
        <h3 className="text-2xl font-black uppercase tracking-widest">Final Verdict</h3>
        <p className="mt-3 text-3xl font-black">“{result.verdict}”</p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={onAgain}
          className="toon-sm bg-tangerine px-6 py-4 text-lg font-black transition-transform hover:-translate-y-1 active:translate-y-1 active:shadow-none"
        >
          🔄 Make Me Suffer Again
        </button>
        <button
          onClick={share}
          className="toon-sm bg-sky px-6 py-4 text-lg font-black transition-transform hover:-translate-y-1 active:translate-y-1 active:shadow-none"
        >
          {shared ? "✅ Suffering exposed!" : "📸 Expose My Suffering"}
        </button>
      </div>
    </section>
  );
}

function HowWeCalculated() {
  return (
    <details className="toon-sm bg-card p-6">
      <summary className="cursor-pointer text-lg font-black">
        🤓 How did we calculate this?
      </summary>
      <div className="mt-4 space-y-2 text-base text-muted-foreground">
        <p>
          We estimate the object's air volume using a predefined approximate value for its category.
        </p>
        <p>We assume one human blow provides roughly {AIR_PER_BLOW} L of air.</p>
        <p>
          Blows = volume ÷ {AIR_PER_BLOW} L (rounded up). Time = blows × 3.5–6 seconds depending on
          size. Energy = blows × {ENERGY_PER_BLOW} kcal. Lung Exhaustion = blows × 2.5%, capped at
          100%.
        </p>
        <p className="font-black text-foreground">
          This is an entertainment project, not a medical, engineering or tyre-inflation measurement
          tool.
        </p>
      </div>
    </details>
  );
}
