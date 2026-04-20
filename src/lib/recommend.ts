/**
 * SoleSearch Recommendation Engine
 *
 * Pure function — takes a FootProfile, returns ranked Recommendations.
 * No ML, no server — runs entirely client-side against the shoe dataset.
 *
 * Architecture:
 *   1. HARD FILTERS  — disqualify shoes that cannot work (budget, category)
 *   2. SIGNAL SCORES — 10 weighted signals each 0–10, summed to 0–100
 *   3. REASONS       — plain-English explanations generated per signal
 *   4. WARNINGS      — honest caveats where the shoe is a compromise
 */

import type { Shoe, FootProfile, Recommendation } from "@/types";

// ─── Signal weights (must sum to 100) ────────────────────────────────────────
const W = {
  category:     25,   // Does the shoe match the intended use?
  width:        18,   // Does toebox width match foot width?
  cushioning:   15,   // Does foam feel match preference + body weight?
  arch:         12,   // Does arch support match foot type?
  budget:       10,   // Is it within budget?
  injury:        8,   // Does it avoid aggravating known issues?
  durability:    5,   // Durability score × usage frequency
  weight:        4,   // Shoe weight vs activity intensity
  drop:          3,   // Heel drop vs foot strike pattern
} as const;

// ─── Hard filter ──────────────────────────────────────────────────────────────

function hardFilter(shoe: Shoe, profile: Partial<FootProfile>): boolean {
  // Must be within budget (with a 20% grace margin — we'll flag it as a warning)
  const budget = profile.budget ?? 200;
  if (shoe.currentLow > budget * 1.2) return false;

  // Extra-wide feet need at least a 2E option
  if (profile.width === "extra-wide") {
    const has2E = shoe.fit.widthOptions.some(w =>
      w.includes("2E") || w.includes("4E") || w.toLowerCase().includes("wide")
    );
    if (!has2E) return false;
  }

  return true;
}

// ─── Signal scorers ───────────────────────────────────────────────────────────

/** 1. Category match */
function scoreCategory(shoe: Shoe, profile: Partial<FootProfile>): { score: number; reason?: string; warning?: string } {
  const use = profile.primaryUse;
  if (!use) return { score: 5 };

  if (shoe.category === use) return {
    score: 10,
    reason: categoryReason(use),
  };

  // Partial matches — e.g. trail shoe for hiking, sneaker for walking
  const partials: Record<string, string[]> = {
    "road-running":  ["walking"],
    "trail-running": ["hiking", "road-running"],
    "hiking":        ["trail-running", "walking", "boots"],
    "walking":       ["road-running", "sneakers", "healthcare"],
    "sneakers":      ["walking", "casual"],
    "gym-training":  ["road-running"],
    "work-safety":   ["walking", "healthcare"],
    "healthcare":    ["walking", "work-safety"],
  };

  const allowable = partials[use] ?? [];
  if (allowable.includes(shoe.category)) return {
    score: 5,
    warning: `Designed for ${shoe.category.replace(/-/g, " ")} — works for ${use.replace(/-/g, " ")} but not optimised for it.`,
  };

  return { score: 1 };
}

function categoryReason(use: string): string {
  const map: Record<string, string> = {
    "road-running":  "Built specifically for road running",
    "trail-running": "Designed for off-road terrain",
    "gym-training":  "Made for gym and cross-training",
    "sneakers":      "Designed as an everyday lifestyle shoe",
    "hiking":        "Engineered for hiking and trails",
    "walking":       "Optimised for all-day walking comfort",
    "basketball":    "Court-specific design and ankle support",
    "work-safety":   "Built for all-day work environments",
    "healthcare":    "Designed for long shifts on your feet",
  };
  return map[use] ?? "Matches your intended use";
}

/** 2. Width — toebox width vs foot width preference */
function scoreWidth(shoe: Shoe, profile: Partial<FootProfile>): { score: number; reason?: string; warning?: string } {
  const fw = profile.width ?? "regular";
  const tb = shoe.labData.toeboxWidthMm;
  const widthOptions = shoe.fit.widthOptions;
  const hasWide = widthOptions.some(w => w.includes("2E") || w.includes("4E") || w.toLowerCase().includes("wide"));
  const hasNarrow = widthOptions.some(w => w.includes("B") || w.toLowerCase().includes("narrow"));

  if (fw === "extra-wide") {
    if (widthOptions.some(w => w.includes("4E"))) return { score: 10, reason: "Available in XWide (4E) — ideal for very wide feet" };
    if (hasWide) return { score: 8, reason: "Available in Wide (2E) fitting" };
    return { score: 3, warning: "Only available in standard width — may feel tight" };
  }
  if (fw === "wide") {
    if (hasWide) return { score: 10, reason: "Wide (2E) option available to match your foot width" };
    if (tb >= 94) return { score: 7, reason: `Generous toebox at ${tb}mm — accommodates wider feet well` };
    return { score: 4, warning: "Standard fit only — consider sizing up half a size" };
  }
  if (fw === "regular") {
    if (tb >= 90 && tb <= 98) return { score: 9, reason: `Toebox width (${tb}mm) is a great match for regular-width feet` };
    if (tb > 98) return { score: 7, reason: `Slightly wide toebox (${tb}mm) — roomy but not overly so` };
    return { score: 6 };
  }
  if (fw === "narrow") {
    if (hasNarrow) return { score: 10, reason: "Narrow (B) width available — precise fit for slim feet" };
    if (tb <= 90) return { score: 7, reason: `Snug toebox (${tb}mm) — well suited to narrower feet` };
    return { score: 5, warning: "Standard width only — may feel loose through the heel" };
  }
  return { score: 5 };
}

/** 3. Cushioning — midsole feel vs preference + body weight */
function scoreCushioning(shoe: Shoe, profile: Partial<FootProfile>): { score: number; reason?: string; warning?: string } {
  const pref = profile.cushionFeel ?? "medium";
  const stack = profile.stackPreference ?? "moderate";
  const weight = profile.bodyWeightKg ?? 75;
  const hc = shoe.labData.midsoleHardnessHC;  // Shore C, lower = softer
  const heelStack = shoe.labData.heelStackMm;

  let score = 5;
  let reason: string | undefined;
  let warning: string | undefined;

  // Cushion feel match
  if (pref === "plush") {
    if (hc < 25) { score += 4; reason = `Very soft foam (${hc} HC) — plush, cloud-like feel`; }
    else if (hc < 32) { score += 2; reason = `Medium-soft foam (${hc} HC) — well cushioned`; }
    else { score -= 2; warning = `Firmer foam (${hc} HC) than you might prefer`; }
  } else if (pref === "firm") {
    if (hc > 38) { score += 4; reason = `Firm, responsive foam (${hc} HC) — great ground feel`; }
    else if (hc > 30) { score += 2; reason = `Medium foam — still reasonably responsive`; }
    else { score -= 2; warning = `Soft foam (${hc} HC) — less ground feel than you prefer`; }
  } else { // medium
    if (hc >= 28 && hc <= 38) { score += 3; reason = `Balanced foam (${hc} HC) — protective but still connected`; }
    else { score += 1; }
  }

  // Stack height match
  if (stack === "maximal" && heelStack >= 36) score += 3;
  else if (stack === "maximal" && heelStack < 30) { score -= 2; warning = (warning ?? "") + ` Lower stack (${heelStack}mm) than ideal for maximal cushioning preference.`; }
  else if (stack === "minimal" && heelStack <= 22) score += 3;
  else if (stack === "minimal" && heelStack > 30) { score -= 2; warning = (warning ?? "") + ` High stack (${heelStack}mm) — taller than you prefer.`; }
  else if (stack === "moderate") score += 1;

  // Heavy runner bonus for cushioning
  if (weight > 90 && hc < 30 && heelStack >= 32) {
    score += 1;
    reason = (reason ?? "") + ` Good cushioning volume for heavier runners (${weight}kg).`;
  }
  if (weight > 90 && hc > 40) {
    warning = (warning ?? "") + ` Firmer foam may feel harsh for runners over 90kg.`;
  }

  return { score: Math.max(0, Math.min(10, score)), reason, warning: warning?.trim() || undefined };
}

/** 4. Arch support */
function scoreArch(shoe: Shoe, profile: Partial<FootProfile>): { score: number; reason?: string; warning?: string } {
  const arch = profile.archType ?? "neutral";
  const support = shoe.fit.archSupport;
  const pronation = profile.pronation ?? "neutral";

  if (arch === "flat" || pronation === "overpronation") {
    if (support === "motion-control") return { score: 10, reason: "Motion-control support — ideal for flat feet and overpronation" };
    if (support === "stability")      return { score: 8,  reason: "Stability support helps control inward roll" };
    return { score: 4, warning: "Neutral shoe — consider a stability version if you overpronate" };
  }
  if (arch === "high" || pronation === "underpronation") {
    if (support === "neutral") return { score: 9, reason: "Neutral shoe — best for high arches that need freedom to supinate" };
    if (support === "stability") return { score: 5, warning: "Stability features may restrict the natural supination of high arches" };
    return { score: 3, warning: "Motion-control would be too corrective for high arches" };
  }
  // Neutral arch
  if (support === "neutral")    return { score: 9, reason: "Neutral support matches your neutral arch type" };
  if (support === "stability")  return { score: 6 };
  return { score: 4, warning: "Motion-control is more correction than neutral arches need" };
}

/** 5. Budget */
function scoreBudget(shoe: Shoe, profile: Partial<FootProfile>): { score: number; reason?: string; warning?: string } {
  const budget = profile.budget ?? 200;
  const price = shoe.currentLow;
  const pct = price / budget;

  if (pct <= 0.7)  return { score: 10, reason: `Well within budget at £${price} (${Math.round((1 - pct) * 100)}% under your limit)` };
  if (pct <= 0.9)  return { score: 9,  reason: `Comfortably within your £${budget} budget` };
  if (pct <= 1.0)  return { score: 7,  reason: `At £${price} — fits your budget` };
  if (pct <= 1.1)  return { score: 4,  warning: `£${price} — £${price - budget} over your budget, but worth considering` };
  return           { score: 2,  warning: `£${price} — noticeably over your £${budget} budget` };
}

/** 6. Injury suitability */
function scoreInjury(shoe: Shoe, profile: Partial<FootProfile>): { score: number; reason?: string; warning?: string } {
  const injuries = profile.injuryHistory ?? [];
  if (injuries.length === 0 || injuries.includes("none")) return { score: 8 };

  let score = 8;
  const reasons: string[] = [];
  const warnings: string[] = [];

  const hc   = shoe.labData.midsoleHardnessHC;
  const stack = shoe.labData.heelStackMm;
  const drop  = shoe.labData.heelDropMm;
  const grip  = shoe.labData.outsoleGripScore;

  if (injuries.includes("plantar-fasciitis")) {
    if (hc < 28 && stack >= 32) { score += 1; reasons.push("Soft, high-stack midsole reduces plantar fascia stress"); }
    else if (hc > 35)           { score -= 2; warnings.push("Firmer foam may aggravate plantar fasciitis"); }
    if (shoe.fit.orthoticFriendly) { score += 1; reasons.push("Removable insole — fits custom orthotics for plantar support"); }
  }

  if (injuries.includes("shin-splints")) {
    if (hc < 32 && stack >= 28) { score += 1; reasons.push("Good cushioning to reduce impact forces on the shin"); }
    if (drop > 8)               { score -= 1; warnings.push("High drop may increase stress on shins — consider lower drop gradually"); }
  }

  if (injuries.includes("knee-pain")) {
    if (hc < 30) { score += 1; reasons.push("Soft midsole absorbs knee impact well"); }
    if (drop > 10) { score -= 1; warnings.push("High drop transfers more load to the knee"); }
  }

  if (injuries.includes("achilles")) {
    if (drop >= 8) { score += 2; reasons.push(`${drop}mm drop reduces strain on the Achilles tendon`); }
    if (drop < 4)  { score -= 3; warnings.push("Low drop increases Achilles load — avoid if recovering"); }
  }

  if (injuries.includes("bunions")) {
    if (shoe.labData.toeboxWidthMm >= 94) { score += 2; reasons.push(`Wide toebox (${shoe.labData.toeboxWidthMm}mm) gives bunions room to breathe`); }
    else { score -= 2; warnings.push("Narrow toebox may press on bunion — try a wider width option"); }
  }

  if (injuries.includes("back-pain")) {
    if (hc < 30 && stack >= 30) { score += 1; reasons.push("High cushioning absorbs shock before it reaches the back"); }
  }

  if (injuries.includes("flat-feet")) {
    if (shoe.fit.archSupport !== "neutral") { score += 1; reasons.push("Added arch support benefits flat feet"); }
    if (shoe.fit.orthoticFriendly)          { score += 1; reasons.push("Orthotic-ready — can use custom arch supports"); }
  }

  return {
    score: Math.max(0, Math.min(10, score)),
    reason: reasons[0],
    warning: warnings[0],
  };
}

/** 7. Durability vs usage frequency */
function scoreDurability(shoe: Shoe, profile: Partial<FootProfile>): { score: number; reason?: string } {
  const km = profile.weeklyKm ?? 0;
  const dur = shoe.scores.durability;

  if (km > 50) {
    if (dur >= 88) return { score: 10, reason: `Durability score ${dur}/100 — built for high-mileage weeks like yours` };
    if (dur >= 80) return { score: 7 };
    return { score: 4 };
  }
  if (km > 20) {
    if (dur >= 80) return { score: 9 };
    return { score: 6 };
  }
  // Occasional use — durability is less critical
  return { score: 7 };
}

/** 8. Weight vs activity intensity */
function scoreWeight(shoe: Shoe, profile: Partial<FootProfile>): { score: number; reason?: string; warning?: string } {
  const use = profile.primaryUse;
  const km  = profile.weeklyKm ?? 0;
  const wg  = shoe.labData.weightG;

  // For high-performance use, lighter is better
  if (use === "road-running" && km > 30) {
    if (wg < 250) return { score: 10, reason: `Lightweight at ${wg}g — less fatigue on longer runs` };
    if (wg < 280) return { score: 8 };
    if (wg > 310) return { score: 5, warning: `Heavier at ${wg}g — you may notice this on longer runs` };
    return { score: 7 };
  }
  // For casual/work use, weight matters less
  if (["sneakers", "walking", "work-safety", "healthcare"].includes(use ?? "")) {
    return { score: 7 }; // weight is not critical
  }
  // Default
  if (wg < 270) return { score: 9, reason: `Light at ${wg}g` };
  if (wg < 310) return { score: 7 };
  return { score: 5 };
}

/** 9. Heel drop vs foot strike */
function scoreDrop(shoe: Shoe, profile: Partial<FootProfile>): { score: number; reason?: string; warning?: string } {
  const strike = profile.footStrike ?? "heel";
  const drop   = shoe.labData.heelDropMm;

  if (strike === "heel") {
    if (drop >= 8)  return { score: 9, reason: `${drop}mm drop suits heel strikers well` };
    if (drop >= 5)  return { score: 7 };
    return { score: 4, warning: `Low drop (${drop}mm) — transition carefully if you heel-strike` };
  }
  if (strike === "forefoot") {
    if (drop <= 4)  return { score: 9, reason: `Low drop (${drop}mm) — ideal for forefoot strikers` };
    if (drop <= 8)  return { score: 7 };
    return { score: 5, warning: `Higher drop (${drop}mm) — not ideal for forefoot strikers` };
  }
  // midfoot
  if (drop >= 4 && drop <= 10) return { score: 8, reason: `${drop}mm drop works well for midfoot striking` };
  return { score: 6 };
}

// ─── Main engine function ─────────────────────────────────────────────────────

export function recommend(profile: Partial<FootProfile>, shoes: Shoe[]): Recommendation[] {
  // 1. Hard filter
  const candidates = shoes.filter(shoe => hardFilter(shoe, profile));

  // 2. Score each candidate
  const scored = candidates.map(shoe => {
    type Signal = { weight: number; score: number; reason?: string; warning?: string };
    const signals: Signal[] = [
      { weight: W.category,   ...scoreCategory(shoe, profile) },
      { weight: W.width,      ...scoreWidth(shoe, profile) },
      { weight: W.cushioning, ...scoreCushioning(shoe, profile) },
      { weight: W.arch,       ...scoreArch(shoe, profile) },
      { weight: W.budget,     ...scoreBudget(shoe, profile) },
      { weight: W.injury,     ...scoreInjury(shoe, profile) },
      { weight: W.durability, ...scoreDurability(shoe, profile) },
      { weight: W.weight,     ...scoreWeight(shoe, profile) },
      { weight: W.drop,       ...scoreDrop(shoe, profile) },
    ];

    // Weighted sum → 0–100
    const matchScore = Math.round(
      signals.reduce((sum, s) => sum + (s.score / 10) * s.weight, 0)
    );

    // Collect plain-English reasons (top 4 positives)
    const reasons = signals
      .filter(s => s.reason)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(s => s.reason as string);

    // Collect all warnings
    const warnings = signals
      .filter(s => s.warning)
      .map(s => s.warning as string);

    return { shoe, matchScore, reasons, warnings };
  });

  // 3. Sort by matchScore desc, then by coreScore as tiebreaker
  scored.sort((a, b) =>
    b.matchScore !== a.matchScore
      ? b.matchScore - a.matchScore
      : b.shoe.scores.coreScore - a.shoe.scores.coreScore
  );

  return scored;
}

// ─── Profile summary for results page header ─────────────────────────────────

export function summariseProfile(profile: Partial<FootProfile>): string[] {
  const lines: string[] = [];

  if (profile.primaryUse) {
    lines.push(profile.primaryUse.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()));
  }
  if (profile.width && profile.width !== "regular") {
    lines.push(`${profile.width} feet`.replace("extra-wide", "extra-wide feet"));
  }
  if (profile.cushionFeel) {
    const map = { firm: "prefers firm feel", medium: "balanced cushioning", plush: "wants plush cushioning" };
    lines.push(map[profile.cushionFeel]);
  }
  if (profile.budget) lines.push(`budget £${profile.budget}`);
  if (profile.injuryHistory?.length && !profile.injuryHistory.includes("none")) {
    lines.push(`${profile.injuryHistory.length} injury note${profile.injuryHistory.length > 1 ? "s" : ""}`);
  }
  return lines;
}
