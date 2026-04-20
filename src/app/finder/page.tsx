"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FootProfile } from "@/types";

// ─── Step definitions ─────────────────────────────────────────────────────────

const STEPS = [
  { id: "use",      title: "What are you shopping for?",    subtitle: "We'll tailor the whole experience to your use case." },
  { id: "foot",     title: "Tell us about your feet.",       subtitle: "This is the most important part — be as accurate as you can." },
  { id: "body",     title: "Body & biomechanics.",           subtitle: "This helps us match cushioning, stability, and support needs." },
  { id: "injuries", title: "Any injury history?",            subtitle: "Select all that apply. This helps us avoid shoes that could aggravate issues." },
  { id: "feel",     title: "How do you like your shoes to feel?", subtitle: "Pure preference — no wrong answers." },
  { id: "budget",   title: "What's your budget?",            subtitle: "We'll show you the best options in your range." },
];

const CATEGORIES = [
  { value: "road-running",   label: "Road running",   desc: "Pavement, treadmill" },
  { value: "trail-running",  label: "Trail running",   desc: "Dirt, rocks, mud" },
  { value: "sneakers",       label: "Casual / lifestyle", desc: "Everyday wear" },
  { value: "gym-training",   label: "Gym & training",  desc: "Cross-training, HIIT" },
  { value: "basketball",     label: "Basketball",      desc: "Court sports" },
  { value: "hiking",         label: "Hiking",          desc: "Trails, mountains" },
  { value: "walking",        label: "Walking",         desc: "All-day comfort" },
  { value: "work-safety",    label: "Work / safety",   desc: "Standing, hazardous" },
];

const INJURIES = [
  "Plantar fasciitis", "Shin splints", "IT band syndrome",
  "Achilles tendinitis", "Bunions", "Morton's neuroma",
  "Knee pain", "Back pain", "Flat feet", "None",
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function OptionCard({
  label, desc, selected, onClick,
}: { label: string; desc?: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col gap-1 p-4 text-left rounded-sm border transition-all duration-150",
        selected
          ? "border-[rgba(232,255,74,0.5)] bg-[rgba(232,255,74,0.06)] text-[#F0EEE8]"
          : "border-[rgba(255,255,255,0.08)] bg-[#111111] text-[#888580] hover:border-[rgba(255,255,255,0.18)] hover:text-[#F0EEE8]"
      )}
    >
      <span className="font-medium text-sm">{label}</span>
      {desc && <span className="font-mono text-[10px] opacity-70">{desc}</span>}
      {selected && (
        <span className="absolute top-2 right-2">
          <Check size={12} color="#E8FF4A" />
        </span>
      )}
    </button>
  );
}

function SliderField({
  label, value, min, max, unit, onChange,
}: { label: string; value: number; min: number; max: number; unit: string; onChange: (v: number) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <span className="font-mono text-xs text-[#888580] uppercase tracking-widest">{label}</span>
        <span className="font-mono text-sm text-[#E8FF4A]">{value} {unit}</span>
      </div>
      <input
        type="range" min={min} max={max} value={value} step={1}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#E8FF4A]"
      />
      <div className="flex justify-between font-mono text-[10px] text-[#888580]">
        <span>{min} {unit}</span><span>{max} {unit}</span>
      </div>
    </div>
  );
}

function SelectField({
  label, value, options, onChange,
}: { label: string; value: string; options: { value: string; label: string }[]; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-mono text-[10px] text-[#888580] uppercase tracking-widest">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-ss"
      >
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

// ─── Step panels ─────────────────────────────────────────────────────────────

function StepUse({ profile, update }: { profile: Partial<FootProfile>; update: (k: keyof FootProfile, v: any) => void }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative">
      {CATEGORIES.map((c) => (
        <OptionCard
          key={c.value} label={c.label} desc={c.desc}
          selected={profile.primaryUse === c.value}
          onClick={() => update("primaryUse", c.value)}
        />
      ))}
    </div>
  );
}

function StepFoot({ profile, update }: { profile: Partial<FootProfile>; update: (k: keyof FootProfile, v: any) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SliderField label="Shoe size (US)" value={profile.sizeUS ?? 10} min={4} max={16} unit="" onChange={(v) => update("sizeUS", v)} />
      <SelectField label="Foot width" value={profile.width ?? ""} onChange={(v) => update("width", v)} options={[
        { value: "narrow",      label: "Narrow (B/C)" },
        { value: "regular",     label: "Regular (D)" },
        { value: "wide",        label: "Wide (2E)" },
        { value: "extra-wide",  label: "Extra wide (4E+)" },
      ]} />
      <SelectField label="Arch type" value={profile.archType ?? ""} onChange={(v) => update("archType", v)} options={[
        { value: "flat",    label: "Flat — low arches" },
        { value: "neutral", label: "Neutral — medium arches" },
        { value: "high",    label: "High arches" },
      ]} />
      <SelectField label="Toe shape" value={profile.toeShape ?? ""} onChange={(v) => update("toeShape", v)} options={[
        { value: "tapered", label: "Tapered — big toe longest" },
        { value: "square",  label: "Square — toes similar length" },
        { value: "wide",    label: "Wide — broad toe spread" },
      ]} />
      <SelectField label="Instep height" value={profile.instepHeight ?? ""} onChange={(v) => update("instepHeight", v)} options={[
        { value: "low",    label: "Low instep" },
        { value: "medium", label: "Medium instep" },
        { value: "high",   label: "High instep" },
      ]} />
      <SelectField label="Heel width" value={profile.heelWidth ?? ""} onChange={(v) => update("heelWidth", v)} options={[
        { value: "narrow",  label: "Narrow heel" },
        { value: "regular", label: "Regular heel" },
        { value: "wide",    label: "Wide heel" },
      ]} />
    </div>
  );
}

function StepBody({ profile, update }: { profile: Partial<FootProfile>; update: (k: keyof FootProfile, v: any) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SliderField label="Body weight (kg)" value={profile.bodyWeightKg ?? 75} min={40} max={180} unit="kg" onChange={(v) => update("bodyWeightKg", v)} />
      <SliderField label="Weekly distance (km)" value={profile.weeklyKm ?? 20} min={0} max={150} unit="km" onChange={(v) => update("weeklyKm", v)} />
      <SelectField label="Pronation" value={profile.pronation ?? ""} onChange={(v) => update("pronation", v)} options={[
        { value: "underpronation", label: "Underpronation (supination)" },
        { value: "neutral",        label: "Neutral" },
        { value: "overpronation",  label: "Overpronation" },
        { value: "neutral",        label: "Not sure" },
      ]} />
      <SelectField label="Foot strike" value={profile.footStrike ?? ""} onChange={(v) => update("footStrike", v)} options={[
        { value: "heel",     label: "Heel striker" },
        { value: "midfoot",  label: "Midfoot striker" },
        { value: "forefoot", label: "Forefoot / toe striker" },
        { value: "heel",     label: "Not sure" },
      ]} />
    </div>
  );
}

function StepInjuries({ profile, update }: { profile: Partial<FootProfile>; update: (k: keyof FootProfile, v: any) => void }) {
  const selected: string[] = profile.injuryHistory ?? [];
  const toggle = (injury: string) => {
    if (injury === "None") { update("injuryHistory", []); return; }
    const next = selected.includes(injury)
      ? selected.filter((i) => i !== injury)
      : [...selected.filter((i) => i !== "None"), injury];
    update("injuryHistory", next);
  };
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {INJURIES.map((inj) => (
        <OptionCard key={inj} label={inj} selected={selected.includes(inj) || (inj === "None" && selected.length === 0)} onClick={() => toggle(inj)} />
      ))}
    </div>
  );
}

function StepFeel({ profile, update }: { profile: Partial<FootProfile>; update: (k: keyof FootProfile, v: any) => void }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="font-mono text-[10px] text-[#888580] uppercase tracking-widest mb-3">Cushioning preference</p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "firm",   label: "Firm",   desc: "Ground feel, fast response" },
            { value: "medium", label: "Medium", desc: "Balance of feel and protection" },
            { value: "plush",  label: "Plush",  desc: "Max cushion, cloud-like" },
          ].map((o) => (
            <OptionCard key={o.value} label={o.label} desc={o.desc} selected={profile.cushionFeel === o.value} onClick={() => update("cushionFeel", o.value)} />
          ))}
        </div>
      </div>
      <div>
        <p className="font-mono text-[10px] text-[#888580] uppercase tracking-widest mb-3">Stack height preference</p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "minimal",  label: "Minimal",  desc: "< 20mm stack" },
            { value: "moderate", label: "Moderate", desc: "20–35mm stack" },
            { value: "maximal",  label: "Maximal",  desc: "35mm+ stack" },
          ].map((o) => (
            <OptionCard key={o.value} label={o.label} desc={o.desc} selected={profile.stackPreference === o.value} onClick={() => update("stackPreference", o.value)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function StepBudget({ profile, update }: { profile: Partial<FootProfile>; update: (k: keyof FootProfile, v: any) => void }) {
  return (
    <div className="flex flex-col gap-8 max-w-md">
      <SliderField label="Maximum budget (USD)" value={profile.budget ?? 150} min={50} max={400} unit="$" onChange={(v) => update("budget", v)} />
      <div className="grid grid-cols-4 gap-2">
        {[100, 150, 200, 300].map((b) => (
          <button key={b} onClick={() => update("budget", b)}
            className={cn("font-mono text-xs py-2 rounded-sm border transition-all",
              profile.budget === b
                ? "border-[rgba(232,255,74,0.5)] bg-[rgba(232,255,74,0.06)] text-[#E8FF4A]"
                : "border-[rgba(255,255,255,0.08)] text-[#888580] hover:text-[#F0EEE8]"
            )}>
            ${b}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const STEP_COMPONENTS = [StepUse, StepFoot, StepBody, StepInjuries, StepFeel, StepBudget];

export default function FinderPage() {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<Partial<FootProfile>>({ budget: 150, bodyWeightKg: 75, weeklyKm: 20, sizeUS: 10 });
  const [loading, setLoading] = useState(false);

  const update = (key: keyof FootProfile, value: any) =>
    setProfile((p) => ({ ...p, [key]: value }));

  const next = () => { if (step < STEPS.length - 1) setStep((s) => s + 1); };
  const prev = () => { if (step > 0) setStep((s) => s - 1); };

  const submit = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    window.location.href = "/finder/results";
  };

  const isLast = step === STEPS.length - 1;
  const progress = ((step + 1) / STEPS.length) * 100;
  const StepPanel = STEP_COMPONENTS[step];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Progress bar */}
      <div className="h-[2px] bg-[#1A1A1A]">
        <div
          className="h-full bg-[#E8FF4A] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-6 py-12">
        {/* Step counter */}
        <div className="flex items-center gap-3 mb-10">
          <span className="font-mono text-xs text-[rgba(232,255,74,0.5)]">{String(step + 1).padStart(2, "0")}</span>
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <div key={i} className={cn("h-[2px] w-6 rounded-full transition-all duration-300", i <= step ? "bg-[#E8FF4A]" : "bg-[#1A1A1A]")} />
            ))}
          </div>
          <span className="font-mono text-xs text-[#888580]">{String(STEPS.length).padStart(2, "0")}</span>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl mb-2">{STEPS[step].title}</h1>
          <p className="text-[#888580]">{STEPS[step].subtitle}</p>
        </div>

        {/* Step content */}
        <div className="flex-1 mb-10">
          <StepPanel profile={profile} update={update} />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <button
            onClick={prev}
            disabled={step === 0}
            className={cn("btn-ghost flex items-center gap-2", step === 0 && "opacity-30 cursor-not-allowed")}
          >
            <ArrowLeft size={13} /> Back
          </button>

          {isLast ? (
            <button
              onClick={submit}
              disabled={loading}
              className="btn-primary flex items-center gap-2 min-w-[180px] justify-center"
            >
              {loading ? (
                <>
                  <span className="inline-block w-3 h-3 border border-[#0A0A0A] border-t-transparent rounded-full animate-spin" />
                  Finding matches…
                </>
              ) : (
                <>Find my shoes <ArrowRight size={13} /></>
              )}
            </button>
          ) : (
            <button onClick={next} className="btn-primary flex items-center gap-2">
              Continue <ArrowRight size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
