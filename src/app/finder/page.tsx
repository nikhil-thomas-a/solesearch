"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import type { FootProfile } from "@/types";
import { useRegion } from "@/lib/regionContext";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function OptionCard({ label, desc, guide, emoji, selected, onClick }: {
  label: string; desc?: string; guide?: string; emoji?: string;
  selected: boolean; onClick: () => void;
}) {
  return (
    <button onClick={onClick} className={`option-card${selected ? " selected" : ""}`}
      style={{ width: "100%", textAlign: "left" }}>
      {emoji && <span style={{ fontSize: 28, marginBottom: 4, display: "block" }}>{emoji}</span>}
      <span style={{ fontSize: 15, fontWeight: 500, color: "var(--text)", display: "block" }}>{label}</span>
      {desc && <span style={{ fontSize: 13, color: "var(--muted)", display: "block", marginTop: 2 }}>{desc}</span>}
      {guide && <span style={{ fontSize: 11, color: "var(--accent)", display: "block", marginTop: 6, fontFamily: "'DM Mono', monospace" }}>{guide}</span>}
      {selected && (
        <span style={{ position: "absolute", top: 10, right: 10, background: "var(--accent)", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Check size={11} color="#fff" />
        </span>
      )}
    </button>
  );
}

function SliderField({ label, sublabel, value, min, max, unit, formatVal, onChange }: {
  label: string; sublabel?: string; value: number; min: number; max: number;
  unit: string; formatVal?: (v: number) => string; onChange: (v: number) => void;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div>
          <span style={{ fontSize: 15, fontWeight: 500 }}>{label}</span>
          {sublabel && <span style={{ fontSize: 13, color: "var(--muted)", marginLeft: 8 }}>{sublabel}</span>}
        </div>
        <span style={{ fontSize: 20, fontWeight: 500, color: "var(--accent)", fontFamily: "'Fraunces', serif" }}>
          {formatVal ? formatVal(value) : `${value}${unit}`}
        </span>
      </div>
      <input type="range" min={min} max={max} value={value} step={1}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: "var(--accent)", height: 4 }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--muted)", fontFamily: "'DM Mono', monospace" }}>
        <span>{min}{unit}</span><span>{max}{unit}</span>
      </div>
    </div>
  );
}

// ─── Steps ────────────────────────────────────────────────────────────────────

const STEPS = [
  {
    id: "use", title: "What are you mainly shopping for?",
    subtitle: "Pick the one that fits best — you can always browse other categories later.",
  },
  {
    id: "foot", title: "Tell us about your feet.",
    subtitle: "Don't worry about technical terms — we'll explain everything with pictures.",
  },
  {
    id: "body", title: "A bit about your body and activity.",
    subtitle: "This helps us get the cushioning and support right for you.",
  },
  {
    id: "injuries", title: "Any pain or discomfort you've had?",
    subtitle: "We'll steer clear of shoes that could make these worse.",
  },
  {
    id: "feel", title: "How do you want your shoes to feel?",
    subtitle: "Pure personal preference — no wrong answers here.",
  },
  {
    id: "budget", title: "What's your budget?",
    subtitle: "We'll show the best options within your range, and flag when a small stretch is worth it.",
  },
];

const SHOE_USES = [
  { value: "road-running",  label: "Running on roads",    desc: "Pavement, pavements, treadmill",   emoji: "🏃" },
  { value: "trail-running", label: "Running off-road",    desc: "Dirt trails, mud, rocks",           emoji: "🏔️" },
  { value: "sneakers",      label: "Everyday casual",     desc: "Walking around, hanging out",       emoji: "👟" },
  { value: "gym-training",  label: "Gym & working out",   desc: "Weights, classes, cross-training",  emoji: "🏋️" },
  { value: "basketball",    label: "Basketball / courts", desc: "Indoor or outdoor court sports",    emoji: "🏀" },
  { value: "hiking",        label: "Hiking & outdoors",   desc: "Long walks, trails, mountains",     emoji: "🥾" },
  { value: "walking",       label: "Walking & standing",  desc: "Daily commute, long days on feet",  emoji: "🚶" },
  { value: "work-safety",   label: "Work / job",          desc: "Safety requirements, long shifts",  emoji: "🦺" },
];

const ARCH_OPTIONS = [
  {
    value: "flat", label: "Flat feet",
    desc: "Your whole foot sole touches the ground when you stand",
    guide: "Wet foot test: footprint shows almost full sole",
    emoji: "👣",
  },
  {
    value: "neutral", label: "Normal arches",
    desc: "You see a curve along the inside of your foot",
    guide: "Wet foot test: footprint shows a curve on the inside",
    emoji: "🦶",
  },
  {
    value: "high", label: "High arches",
    desc: "Very little of the inside of your foot touches the ground",
    guide: "Wet foot test: footprint shows mostly heel and ball",
    emoji: "👠",
  },
];

const WIDTH_OPTIONS = [
  { value: "narrow",     label: "Shoes often feel loose",     desc: "Too much space in most shoes",           emoji: "↔️" },
  { value: "regular",    label: "Most shoes fit fine",         desc: "Standard width works for me",            emoji: "✅" },
  { value: "wide",       label: "Shoes feel tight or cramped", desc: "My toes or sides get squished",          emoji: "😣" },
  { value: "extra-wide", label: "Most shoes are way too tight", desc: "I really struggle to find fitting shoes", emoji: "‼️" },
];

const CUSHION_OPTIONS = [
  { value: "firm",   label: "I want to feel the ground",   desc: "Thin, responsive — like barefoot but protected", emoji: "⚡" },
  { value: "medium", label: "Somewhere in the middle",     desc: "Some protection, still connected to the ground",  emoji: "⚖️" },
  { value: "plush",  label: "I want maximum comfort",      desc: "Soft, cushioned — like walking on clouds",        emoji: "☁️" },
];

const INJURY_OPTIONS = [
  { value: "plantar-fasciitis", label: "Heel pain in the morning",    desc: "Sharp pain under heel when you first get up" },
  { value: "shin-splints",      label: "Shin pain when running",       desc: "Aching along the front of your lower leg" },
  { value: "knee-pain",         label: "Knee pain",                    desc: "During or after activity" },
  { value: "back-pain",         label: "Lower back pain",              desc: "Especially after standing or walking long" },
  { value: "bunions",           label: "Bony bump at big toe joint",   desc: "Big toe pushes toward other toes" },
  { value: "achilles",          label: "Achilles / back-of-heel pain", desc: "Tightness or pain above the heel" },
  { value: "flat-feet",         label: "Flat feet",                    desc: "No visible arch, feet roll inward" },
  { value: "none",              label: "No issues — all good",         desc: "No current pain or foot problems" },
];

// ─── Step panels ─────────────────────────────────────────────────────────────

function StepUse({ profile, update }: { profile: Partial<FootProfile>; update: (k: keyof FootProfile, v: any) => void }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 12 }}>
      {SHOE_USES.map((c) => (
        <OptionCard key={c.value} label={c.label} desc={c.desc} emoji={c.emoji}
          selected={profile.primaryUse === c.value} onClick={() => update("primaryUse", c.value)} />
      ))}
    </div>
  );
}

// Size helpers
const SIZE_SYSTEMS = ["UK", "US", "EU"] as const;
type SizeSystem = typeof SIZE_SYSTEMS[number];
function fromUK(uk: number, sys: SizeSystem): number {
  if (sys === "UK") return uk;
  if (sys === "US") return Math.round((uk + 1) * 2) / 2;
  return Math.round((uk * 1.27 + 33) * 2) / 2;
}
function sizeLabel(uk: number, sys: SizeSystem): string {
  return `${sys} ${fromUK(uk, sys)}`;
}

function StepFoot({ profile, update }: { profile: Partial<FootProfile>; update: (k: keyof FootProfile, v: any) => void }) {
  const [sizeSystem, setSizeSystem] = useState<SizeSystem>("UK");
  const ukSize = profile.sizeUS ? profile.sizeUS - 1 : 9;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <p style={{ fontSize: 13, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", fontFamily: "'DM Mono', monospace" }}>Your shoe size</p>
          <div className="size-toggle">
            {SIZE_SYSTEMS.map(s => (
              <button key={s} className={sizeSystem === s ? "active" : ""} onClick={() => setSizeSystem(s)}>{s}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
          <span style={{ fontSize: 14, color: "var(--muted)" }}>Selected size</span>
          <span style={{ fontSize: 24, fontWeight: 500, color: "var(--accent)", fontFamily: "'Fraunces', serif" }}>
            {sizeLabel(ukSize, sizeSystem)}
          </span>
        </div>
        <input type="range" min={3} max={15} step={0.5} value={ukSize}
          onChange={e => update("sizeUS", Number(e.target.value) + 1)}
          style={{ width: "100%", accentColor: "var(--accent)", height: 4 }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--muted)", fontFamily: "'DM Mono', monospace", marginTop: 6 }}>
          <span>{sizeLabel(3, sizeSystem)}</span>
          <span>{sizeLabel(9, sizeSystem)}</span>
          <span>{sizeLabel(15, sizeSystem)}</span>
        </div>
        <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>
          Unsure? Measure heel to longest toe in cm. UK 7 ≈ 26cm · UK 9 ≈ 27.9cm · UK 11 ≈ 30cm
        </p>
      </div>

      <div>
        <p style={{ fontSize: 13, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: 12, fontFamily: "'DM Mono', monospace" }}>How wide are your feet?</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
          {WIDTH_OPTIONS.map((w) => (
            <OptionCard key={w.value} label={w.label} desc={w.desc} emoji={w.emoji}
              selected={profile.width === w.value} onClick={() => update("width", w.value)} />
          ))}
        </div>
      </div>

      <div>
        <p style={{ fontSize: 13, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: 6, fontFamily: "'DM Mono', monospace" }}>What's your arch like?</p>
        <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>Tip: wet your foot and step on a paper bag or tile to see your footprint.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
          {ARCH_OPTIONS.map((a) => (
            <OptionCard key={a.value} label={a.label} desc={a.desc} guide={a.guide} emoji={a.emoji}
              selected={profile.archType === a.value} onClick={() => update("archType", a.value)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function StepBody({ profile, update }: { profile: Partial<FootProfile>; update: (k: keyof FootProfile, v: any) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, maxWidth: 560 }}>
      <div>
        <SliderField label="Your weight" value={profile.bodyWeightKg ?? 75} min={40} max={180} unit=" kg"
          formatVal={(v) => `${v} kg`} onChange={(v) => update("bodyWeightKg", v)} />
        <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>Heavier runners need more cushioning and support. This is one of the most important fit factors.</p>
      </div>

      <div>
        <SliderField label="How often do you use them?" value={profile.weeklyKm ?? 0} min={0} max={100} unit=""
          formatVal={(v) => v === 0 ? "Occasionally" : v < 20 ? `~${v}km / week` : v < 50 ? `~${v}km / week` : `${v}+ km / week`}
          onChange={(v) => update("weeklyKm", v)} />
        <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>More use = prioritise durability and long-run comfort over looks.</p>
      </div>

      <div>
        <p style={{ fontSize: 13, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: 10, fontFamily: "'DM Mono', monospace" }}>How do your feet tend to move?</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 10 }}>
          {[
            { value: "neutral",        label: "Normal — feet roll slightly inward", desc: "Most common. Foot lands and rolls slightly in.", emoji: "✅" },
            { value: "overpronation",  label: "Feet roll quite far inward",          desc: "Inner sole wears down first. Ankles may ache.", emoji: "↩️" },
            { value: "underpronation", label: "Feet roll outward",                   desc: "Outer sole wears first. Common with high arches.", emoji: "↪️" },
            { value: "neutral",        label: "I have no idea",                      desc: "That's fine — we'll use your other answers.",     emoji: "🤷" },
          ].map((o, i) => (
            <OptionCard key={i} label={o.label} desc={o.desc} emoji={o.emoji}
              selected={i === 3 ? false : profile.pronation === o.value} onClick={() => update("pronation", o.value)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function StepInjuries({ profile, update }: { profile: Partial<FootProfile>; update: (k: keyof FootProfile, v: any) => void }) {
  const selected: string[] = profile.injuryHistory ?? [];
  const toggle = (val: string) => {
    if (val === "none") { update("injuryHistory", []); return; }
    const next = selected.includes(val) ? selected.filter(i => i !== val) : [...selected.filter(i => i !== "none"), val];
    update("injuryHistory", next);
  };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
      {INJURY_OPTIONS.map((inj) => (
        <OptionCard key={inj.value} label={inj.label} desc={inj.desc}
          selected={inj.value === "none" ? selected.length === 0 : selected.includes(inj.value)}
          onClick={() => toggle(inj.value)} />
      ))}
    </div>
  );
}

function StepFeel({ profile, update }: { profile: Partial<FootProfile>; update: (k: keyof FootProfile, v: any) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <div>
        <p style={{ fontSize: 13, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: 12, fontFamily: "'DM Mono', monospace" }}>How cushioned do you like them?</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
          {CUSHION_OPTIONS.map((o) => (
            <OptionCard key={o.value} label={o.label} desc={o.desc} emoji={o.emoji}
              selected={profile.cushionFeel === o.value} onClick={() => update("cushionFeel", o.value)} />
          ))}
        </div>
      </div>
      <div>
        <p style={{ fontSize: 13, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: 12, fontFamily: "'DM Mono', monospace" }}>How tall do you like the sole?</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
          {[
            { value: "minimal",  label: "Low to the ground",    desc: "Thin sole, very close to the floor",         emoji: "📏" },
            { value: "moderate", label: "Normal height",         desc: "Standard everyday shoe height",              emoji: "👟" },
            { value: "maximal",  label: "Tall / chunky sole",    desc: "Maximum cushion, like Hokas or platform soles", emoji: "🥿" },
          ].map((o) => (
            <OptionCard key={o.value} label={o.label} desc={o.desc} emoji={o.emoji}
              selected={profile.stackPreference === o.value} onClick={() => update("stackPreference", o.value)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function StepBudget({ profile, update }: { profile: Partial<FootProfile>; update: (k: keyof FootProfile, v: any) => void }) {
  const { fmt, convert, region } = useRegion();
  // Budget stored in USD internally, displayed in local currency
  const budgetUSD = profile.budget ?? 150;
  const displayBudget = budgetUSD >= 400 ? "No limit" : fmt(budgetUSD);
  // Quick picks in USD — displayed in local currency
  const quickPicks = [75, 120, 180, 250];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 500 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 13, color: "var(--muted)" }}>Showing prices in</span>
        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, padding: "3px 10px", borderRadius: 20, background: "rgba(88,166,255,0.1)", color: "var(--accent)", border: "1px solid rgba(88,166,255,0.2)" }}>
          {region.currency} · {region.symbol}
        </span>
        <span style={{ fontSize: 12, color: "var(--muted)" }}>(change in nav)</span>
      </div>
      <SliderField label="Maximum budget" value={budgetUSD} min={30} max={400} unit=""
        formatVal={(v) => v >= 400 ? "No limit" : fmt(v)} onChange={(v) => update("budget", v)} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
        {quickPicks.map((b) => (
          <button key={b} onClick={() => update("budget", b)} style={{
            padding: "10px 0", borderRadius: 8, fontFamily: "'DM Mono', monospace", fontSize: 12, cursor: "pointer",
            border: `1.5px solid ${budgetUSD === b ? "var(--accent)" : "var(--border)"}`,
            background: budgetUSD === b ? "rgba(88,166,255,0.06)" : "var(--bg2)",
            color: budgetUSD === b ? "var(--accent)" : "var(--muted)",
            transition: "all 0.15s",
          }}>{fmt(b)}</button>
        ))}
      </div>
      <div style={{ padding: "16px 20px", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
        {budgetUSD < 80 && "Budget range — we'll find the best value options available."}
        {budgetUSD >= 80 && budgetUSD < 130 && "Sweet spot — lots of great shoes in this range from major brands."}
        {budgetUSD >= 130 && budgetUSD < 200 && "Premium range — access to the top performance models."}
        {budgetUSD >= 200 && "No compromises — the best of everything is within reach."}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const STEP_COMPONENTS = [StepUse, StepFoot, StepBody, StepInjuries, StepFeel, StepBudget];

export default function FinderPage() {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Partial<FootProfile>>({ budget: 150, bodyWeightKg: 75, weeklyKm: 0, sizeUS: 10 });
  const [loading, setLoading] = useState(false);

  const update = (key: keyof FootProfile, value: any) => setProfile((p) => ({ ...p, [key]: value }));
  const next = () => { if (step < STEPS.length - 1) setStep(s => s + 1); };
  const prev = () => { if (step > 0) setStep(s => s - 1); };
  const submit = async () => {
    setLoading(true);
    // Persist profile so results page can run the engine
    if (typeof window !== "undefined") {
      sessionStorage.setItem("solesearch_profile", JSON.stringify(profile));
    }
    await new Promise(r => setTimeout(r, 1200));
    window.location.href = "/finder/results";
  };

  const isLast = step === STEPS.length - 1;
  const progress = ((step + 1) / STEPS.length) * 100;
  const StepPanel = STEP_COMPONENTS[step];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      {/* Progress bar */}
      <div style={{ height: 3, background: "var(--bg3)" }}>
        <div style={{ height: "100%", background: "var(--accent)", width: `${progress}%`, transition: "width 0.4s ease" }} />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", maxWidth: 760, margin: "0 auto", width: "100%", padding: "48px 24px 32px" }}>
        {/* Step dots */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 40 }}>
          {STEPS.map((_, i) => (
            <div key={i} style={{
              width: i === step ? 24 : 8, height: 8, borderRadius: 99,
              background: i < step ? "var(--accent)" : i === step ? "var(--accent)" : "var(--bg3)",
              transition: "all 0.3s ease", opacity: i > step ? 0.4 : 1,
            }} />
          ))}
          <span style={{ marginLeft: 8, fontFamily: "'DM Mono', monospace", fontSize: 11, color: "var(--muted)" }}>
            {step + 1} of {STEPS.length}
          </span>
        </div>

        {/* Question */}
        <div style={{ marginBottom: 32 }}>
          <h1 className="font-serif" style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 300, marginBottom: 8, letterSpacing: "-0.01em", lineHeight: 1.2 }}>
            {STEPS[step].title}
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 15 }}>{STEPS[step].subtitle}</p>
        </div>

        {/* Content */}
        <div style={{ flex: 1, marginBottom: 32 }}>
          <StepPanel profile={profile} update={update} />
        </div>

        {/* Nav */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 24, borderTop: "1px solid var(--border)" }}>
          <button onClick={prev} disabled={step === 0} className="btn-ghost"
            style={{ opacity: step === 0 ? 0.3 : 1, cursor: step === 0 ? "not-allowed" : "pointer" }}>
            <ArrowLeft size={14} /> Back
          </button>
          {isLast ? (
            <button onClick={submit} disabled={loading} className="btn-accent" style={{ minWidth: 180, justifyContent: "center" }}>
              {loading ? (
                <><span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block" }} className="animate-spin" /> Finding matches…</>
              ) : (
                <>Find my shoes <ArrowRight size={14} /></>
              )}
            </button>
          ) : (
            <button onClick={next} className="btn-accent">Continue <ArrowRight size={14} /></button>
          )}
        </div>
      </div>
    </div>
  );
}
