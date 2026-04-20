"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import { recommend, summariseProfile } from "@/lib/recommend";
import { useRegion } from "@/lib/regionContext";
import { SHOES } from "@/data/shoes";
import type { FootProfile, Recommendation } from "@/types";

// ─── Match score ring ─────────────────────────────────────────────────────────
function MatchRing({ score }: { score: number }) {
  const col = score >= 80 ? "#3FB950" : score >= 65 ? "#E3B341" : "#8B949E";
  const r = 28, c = 32;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div style={{ position: "relative", width: 64, height: 64, flexShrink: 0 }}>
      <svg width={64} height={64} viewBox="0 0 64 64" style={{ transform: "rotate(-90deg)" }}>
        <circle cx={c} cy={c} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={6} />
        <circle cx={c} cy={c} r={r} fill="none" stroke={col} strokeWidth={6}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 15, fontWeight: 600, lineHeight: 1, color: col, fontFamily: "'Fraunces',serif" }}>{score}</span>
        <span style={{ fontSize: 8, color: "var(--muted)", fontFamily: "'DM Mono',monospace", textTransform: "uppercase", letterSpacing: "0.06em" }}>match</span>
      </div>
    </div>
  );
}

// ─── Rank badge ───────────────────────────────────────────────────────────────
function RankBadge({ rank }: { rank: number }) {
  const styles: Record<number, { bg: string; color: string; label: string }> = {
    1: { bg: "rgba(227,179,65,0.12)",  color: "#E3B341", label: "Top pick" },
    2: { bg: "rgba(139,148,158,0.1)",  color: "#8B949E", label: "Runner-up" },
    3: { bg: "rgba(139,148,158,0.08)", color: "#8B949E", label: "3rd place" },
  };
  const s = styles[rank] ?? { bg: "rgba(139,148,158,0.06)", color: "#8B949E", label: `#${rank}` };
  return (
    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, padding: "3px 9px", borderRadius: 20, background: s.bg, color: s.color, border: `1px solid ${s.color}30`, textTransform: "uppercase", letterSpacing: "0.06em" }}>
      {s.label}
    </span>
  );
}

// ─── Result card ──────────────────────────────────────────────────────────────
function ResultCard({ rec, rank, fmt }: { rec: Recommendation; rank: number; fmt: (p: number) => string }) {
  const [expanded, setExpanded] = useState(rank === 1);
  const { shoe, matchScore, reasons, warnings } = rec;
  const cheapest = [...shoe.retailers].sort((a, b) => a.price - b.price)[0];
  const scoreCol = shoe.scores.coreScore >= 88 ? "#3FB950" : shoe.scores.coreScore >= 80 ? "#E3B341" : "#8B949E";
  const borderCol = rank === 1 ? "rgba(227,179,65,0.3)" : "var(--border)";

  return (
    <div style={{
      background: rank === 1 ? "rgba(227,179,65,0.02)" : "var(--bg2)",
      border: `1px solid ${borderCol}`,
      borderRadius: 14, overflow: "hidden",
      transition: "all 0.2s",
    }}>
      {/* Top accent line */}
      {rank === 1 && <div style={{ height: 2, background: "linear-gradient(90deg, #E3B341, transparent)" }} />}

      {/* Main row */}
      <div style={{ display: "flex", gap: 0, alignItems: "stretch" }}>

        {/* Rank strip */}
        <div style={{ width: 44, flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, borderRight: "1px solid var(--border)", padding: "16px 0", background: "rgba(0,0,0,0.2)" }}>
          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)" }}>#{rank}</span>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: "18px 20px", display: "flex", gap: 16, alignItems: "flex-start" }}>

          {/* Shoe image placeholder */}
          <div style={{ width: 72, height: 72, borderRadius: 10, background: "var(--bg3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontSize: 32, opacity: 0.3 }}>👟</span>
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
              <RankBadge rank={rank} />
              <span className="pill-muted">{shoe.subcategory}</span>
            </div>
            <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>{shoe.brand}</p>
            <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 22, fontWeight: 300, lineHeight: 1.1, marginBottom: 6 }}>{shoe.name}</h2>

            {/* Quick stats */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)" }}>
              <span>{shoe.labData.weightG}g</span>
              <span style={{ opacity: 0.3 }}>·</span>
              <span>{shoe.labData.heelDropMm}mm drop</span>
              <span style={{ opacity: 0.3 }}>·</span>
              <span>{shoe.labData.heelStackMm}mm stack</span>
              <span style={{ opacity: 0.3 }}>·</span>
              <span>CoreScore <span style={{ color: scoreCol }}>{shoe.scores.coreScore}</span></span>
            </div>
          </div>

          {/* Right — match ring + price */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, flexShrink: 0 }}>
            <MatchRing score={matchScore} />
            <div style={{ textAlign: "right" }}>
              <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: "var(--muted)", textTransform: "uppercase", marginBottom: 2 }}>From</p>
              <p style={{ fontFamily: "'Fraunces',serif", fontSize: 22, color: "#3FB950", lineHeight: 1 }}>{fmt(cheapest.price)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable detail */}
      <div style={{ borderTop: "1px solid var(--border)", padding: "14px 20px 14px 60px" }}>
        {/* Reasons preview */}
        <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: expanded ? 14 : 0 }}>
          {(expanded ? reasons : reasons.slice(0, 2)).map(r => (
            <div key={r} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "var(--muted)", lineHeight: 1.4 }}>
              <Check size={12} color="#3FB950" style={{ flexShrink: 0, marginTop: 2 }} />
              <span>{r}</span>
            </div>
          ))}
        </div>

        {/* Expanded: warnings + CTA */}
        {expanded && (
          <>
            {warnings.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 14, padding: "10px 14px", background: "rgba(227,179,65,0.04)", border: "1px solid rgba(227,179,65,0.15)", borderRadius: 8 }}>
                {warnings.map(w => (
                  <div key={w} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: "#E3B341", lineHeight: 1.4 }}>
                    <AlertTriangle size={12} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>{w}</span>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: "flex", gap: 10 }}>
              <Link href={`/shoes/${shoe.slug}`} className="btn-accent" style={{ padding: "9px 18px", fontSize: 13 }}>
                Full details <ArrowRight size={13} />
              </Link>
              <a href={cheapest.url} className="btn-ghost" style={{ padding: "9px 16px", fontSize: 13 }}>
                Buy from {cheapest.name} {fmt(cheapest.price)}
              </a>
            </div>
          </>
        )}

        {/* Toggle */}
        <button
          onClick={() => setExpanded(p => !p)}
          style={{ marginTop: expanded ? 12 : 0, background: "none", border: "none", cursor: "pointer", color: "var(--accent)", fontFamily: "'DM Mono',monospace", fontSize: 11, padding: 0, display: "flex", alignItems: "center", gap: 4 }}
        >
          {expanded ? "Show less ↑" : `See all ${reasons.length} reasons ↓`}
        </button>
      </div>
    </div>
  );
}

// ─── No results state ─────────────────────────────────────────────────────────
function NoResults({ onRetake }: { onRetake: () => void }) {
  return (
    <div style={{ textAlign: "center", padding: "80px 24px" }}>
      <p style={{ fontSize: 48, marginBottom: 16 }}>🔍</p>
      <h2 style={{ fontFamily: "'Fraunces',serif", fontSize: 28, marginBottom: 12 }}>No perfect matches found</h2>
      <p style={{ color: "var(--muted)", fontSize: 15, marginBottom: 24, maxWidth: 420, margin: "0 auto 24px" }}>
        Your combination of filters is very specific. Try relaxing your budget or width requirements.
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <button onClick={onRetake} className="btn-accent">Retake quiz</button>
        <Link href="/catalogue" className="btn-ghost">Browse all shoes</Link>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ResultsPage() {
  const { fmt } = useRegion();
  const [results, setResults]   = useState<Recommendation[]>([]);
  const [profile, setProfile]   = useState<Partial<FootProfile>>({});
  const [summary, setSummary]   = useState<string[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    // Load profile from sessionStorage
    let parsed: Partial<FootProfile> = {};
    try {
      const raw = sessionStorage.getItem("solesearch_profile");
      if (raw) parsed = JSON.parse(raw);
    } catch {}

    setProfile(parsed);

    // Run the engine
    const recs = recommend(parsed, SHOES);
    setResults(recs);

    // Build summary chips
    const chips: string[] = [];
    if (parsed.primaryUse) chips.push(parsed.primaryUse.replace(/-/g, " ").replace(/^\w/, c => c.toUpperCase()));
    if (parsed.width && parsed.width !== "regular") chips.push(`${parsed.width} fit`);
    if (parsed.cushionFeel) chips.push(parsed.cushionFeel);
    if (parsed.budget) chips.push(`£${parsed.budget} budget`);
    if (parsed.injuryHistory?.length && !parsed.injuryHistory.includes("none")) chips.push(`${parsed.injuryHistory.length} injury note${parsed.injuryHistory.length > 1 ? "s" : ""}`);
    setSummary(chips);

    setLoading(false);
  }, []);

  const handleRetake = () => {
    sessionStorage.removeItem("solesearch_profile");
    window.location.href = "/finder";
  };

  if (loading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <div style={{ width: 40, height: 40, border: "3px solid var(--bg3)", borderTopColor: "var(--accent)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Matching your profile…</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "40px 24px 80px" }}>

      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <Link href="/finder" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--muted)", textDecoration: "none", marginBottom: 20 }}>
          <ArrowLeft size={14} /> Back to quiz
        </Link>

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
          <div>
            <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
              Your results
            </p>
            <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 300, lineHeight: 1.1, marginBottom: 12 }}>
              {results.length > 0
                ? <>We found <em style={{ color: "var(--accent3)", fontStyle: "italic" }}>{results.length} matches</em> for you.</>
                : "No matches found."}
            </h1>
            <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 14 }}>
              Ranked by how well each shoe fits your foot profile and preferences — not by popularity or ads.
            </p>
            {/* Profile summary chips */}
            {summary.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {summary.map(s => (
                  <span key={s} style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, padding: "3px 10px", borderRadius: 20, background: "rgba(88,166,255,0.08)", color: "var(--accent)", border: "1px solid rgba(88,166,255,0.2)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>

          <button onClick={handleRetake} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, cursor: "pointer", fontFamily: "'DM Mono',monospace", fontSize: 11, color: "var(--muted)", transition: "all 0.15s", flexShrink: 0 }}>
            <RefreshCw size={12} /> Retake
          </button>
        </div>
      </div>

      {/* Results or empty state */}
      {results.length === 0 ? (
        <NoResults onRetake={handleRetake} />
      ) : (
        <>
          {/* Match score explanation */}
          <div style={{ display: "flex", gap: 20, padding: "14px 18px", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 10, marginBottom: 24, fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>ℹ️</span>
            <span>
              The <strong style={{ color: "var(--text)" }}>match score</strong> is calculated from 9 signals — category fit, toebox width, cushioning, arch support, budget, injury history, durability, shoe weight, and heel drop — weighted against your profile. It&apos;s independent of brand popularity or reviews.
            </span>
          </div>

          {/* Result cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {results.map((rec, i) => (
              <ResultCard key={rec.shoe.id} rec={rec} rank={i + 1} fmt={fmt} />
            ))}
          </div>

          {/* Browse more */}
          <div style={{ marginTop: 36, padding: "24px", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
            <div>
              <p style={{ fontFamily: "'Fraunces',serif", fontSize: 18, marginBottom: 4 }}>Want to see more?</p>
              <p style={{ fontSize: 13, color: "var(--muted)" }}>Browse the full catalogue with filters to explore all {SHOES.length} shoes.</p>
            </div>
            <Link href="/catalogue" className="btn-ghost" style={{ flexShrink: 0, fontSize: 13 }}>
              Browse catalogue <ArrowRight size={13} />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
