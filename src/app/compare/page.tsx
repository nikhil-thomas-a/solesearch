"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, X, ArrowRight, Search } from "lucide-react";
import { SHOES } from "@/data/shoes";
import { useRegion } from "@/lib/regionContext";
import { scoreColor } from "@/lib/utils";
import type { Shoe } from "@/types";

// ─── Rows to compare ─────────────────────────────────────────────────────────
const ROWS: { section: string; rows: { label: string; getValue: (s: Shoe) => string | number; note?: string; isScore?: boolean }[] }[] = [
  { section: "Scores", rows: [
    { label: "CoreScore",    getValue: s => s.scores.coreScore,    isScore: true },
    { label: "Comfort",      getValue: s => s.scores.comfort,      isScore: true },
    { label: "Durability",   getValue: s => s.scores.durability,   isScore: true },
    { label: "Performance",  getValue: s => s.scores.performance,  isScore: true },
    { label: "Value",        getValue: s => s.scores.value,        isScore: true },
  ]},
  { section: "Lab data", rows: [
    { label: "Weight",         getValue: s => `${s.labData.weightG}g`,           note: "Lighter = less fatigue" },
    { label: "Heel drop",      getValue: s => `${s.labData.heelDropMm}mm`,       note: "Lower = more natural feel" },
    { label: "Heel stack",     getValue: s => `${s.labData.heelStackMm}mm`,      note: "Higher = more cushion" },
    { label: "Midsole feel",   getValue: s => `${s.labData.midsoleHardnessHC} HC`, note: "Lower = softer foam" },
    { label: "Energy return",  getValue: s => `${s.labData.energyReturnPct}%`,   note: "Higher = bouncier" },
    { label: "Toebox width",   getValue: s => `${s.labData.toeboxWidthMm}mm`,    note: "Wider = more room" },
    { label: "Breathability",  getValue: s => `${s.labData.breathabilityScore}/100` },
    { label: "Outsole grip",   getValue: s => `${s.labData.outsoleGripScore}/100` },
  ]},
  { section: "Fit", rows: [
    { label: "Arch support",     getValue: s => s.fit.archSupport },
    { label: "Width options",    getValue: s => s.fit.widthOptions.join(", ") },
    { label: "Orthotic ready",   getValue: s => s.labData.removableInsole ? "Yes" : "No" },
    { label: "Size range",       getValue: s => s.fit.sizeRange },
    { label: "Sizing note",      getValue: s => s.fit.fitNote },
  ]},
];

// ─── Shoe picker modal ────────────────────────────────────────────────────────
function ShoePicker({ onSelect, onClose }: { onSelect: (s: Shoe) => void; onClose: () => void }) {
  const [q, setQ] = useState("");
  const filtered = SHOES.filter(s =>
    `${s.brand} ${s.name} ${s.category}`.toLowerCase().includes(q.toLowerCase())
  ).slice(0, 20);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.7)" }} onClick={onClose}>
      <div style={{ background: "var(--bg2)", border: "1px solid var(--border-hi)", borderRadius: 14, width: "min(560px, 95vw)", maxHeight: "80vh", display: "flex", flexDirection: "column", overflow: "hidden" }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
          <Search size={15} color="var(--muted)" />
          <input autoFocus value={q} onChange={e => setQ(e.target.value)}
            placeholder="Search shoes, brands, categories…"
            style={{ flex: 1, background: "none", border: "none", outline: "none", color: "var(--text)", fontSize: 15, fontFamily: "'DM Sans',sans-serif" }} />
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)" }}><X size={16} /></button>
        </div>
        {/* Results */}
        <div style={{ overflowY: "auto", padding: 8 }}>
          {filtered.map(shoe => (
            <button key={shoe.id} onClick={() => { onSelect(shoe); onClose(); }}
              style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "10px 12px", background: "none", border: "none", borderRadius: 8, cursor: "pointer", textAlign: "left", transition: "background 0.15s" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--bg3)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "none"}
            >
              <div style={{ width: 44, height: 44, borderRadius: 8, background: "var(--bg3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 20 }}>👟</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{shoe.brand}</p>
                <p style={{ fontFamily: "'Fraunces',serif", fontSize: 16, color: "var(--text)" }}>{shoe.name}</p>
                <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)", textTransform: "uppercase" }}>{shoe.category.replace(/-/g, " ")} · {shoe.subcategory}</p>
              </div>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, color: scoreColor(shoe.scores.coreScore) }}>{shoe.scores.coreScore}</span>
            </button>
          ))}
          {filtered.length === 0 && (
            <p style={{ padding: "32px", textAlign: "center", color: "var(--muted)", fontFamily: "'Fraunces',serif", fontSize: 16 }}>No shoes found for "{q}"</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ComparePage() {
  const { fmt } = useRegion();
  const [slots, setSlots] = useState<(Shoe | null)[]>([
    SHOES.find(s => s.slug === "nike-pegasus-41") ?? null,
    SHOES.find(s => s.slug === "hoka-clifton-9") ?? null,
    null,
  ]);
  const [pickerSlot, setPickerSlot] = useState<number | null>(null);

  const setSlot = (i: number, shoe: Shoe) => {
    setSlots(prev => { const n = [...prev]; n[i] = shoe; return n; });
  };
  const clearSlot = (i: number) => {
    setSlots(prev => { const n = [...prev]; n[i] = null; return n; });
  };

  const filled = slots.filter(Boolean) as Shoe[];

  // Highlight best value per score row
  const bestVal = (row: { getValue: (s: Shoe) => string | number; isScore?: boolean }) => {
    if (!row.isScore || filled.length < 2) return null;
    const vals = filled.map(s => Number(row.getValue(s)));
    return Math.max(...vals);
  };

  const SLOT_COLORS = ["#58A6FF", "#3FB950", "#E3B341"];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
          <span className="section-num">Side by side</span>
          <h1 className="font-serif" style={{ fontSize: 32, fontWeight: 300 }}>Compare shoes</h1>
        </div>
        <p style={{ color: "var(--muted)", fontSize: 14 }}>
          Add up to 3 shoes. Click any empty slot or the × to swap. All {SHOES.length} shoes in the database are searchable.
        </p>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>

          {/* Shoe header cards */}
          <thead>
            <tr>
              <th style={{ width: 180, padding: "0 0 20px", verticalAlign: "bottom", textAlign: "left" }}>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Comparing</span>
              </th>
              {slots.map((shoe, i) => (
                <th key={i} style={{ padding: "0 10px 20px", verticalAlign: "bottom", minWidth: 200 }}>
                  {shoe ? (
                    <div style={{ background: "var(--bg2)", border: `1px solid ${SLOT_COLORS[i]}33`, borderRadius: 12, overflow: "hidden", position: "relative" }}>
                      <div style={{ height: 3, background: SLOT_COLORS[i] }} />
                      <div style={{ padding: 14 }}>
                        <button onClick={() => clearSlot(i)} style={{ position: "absolute", top: 10, right: 10, background: "var(--bg3)", border: "none", borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                          <X size={12} color="var(--muted)" />
                        </button>
                        <div style={{ aspectRatio: "4/3", background: "var(--bg3)", borderRadius: 8, marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, cursor: "pointer" }} onClick={() => setPickerSlot(i)}>👟</div>
                        <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>{shoe.brand}</p>
                        <p style={{ fontFamily: "'Fraunces',serif", fontSize: 17, marginBottom: 8, lineHeight: 1.2 }}>{shoe.name}</p>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                          <span style={{ fontFamily: "'Fraunces',serif", fontSize: 18, color: "#3FB950" }}>{fmt(shoe.currentLow)}</span>
                          <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, color: scoreColor(shoe.scores.coreScore) }}>{shoe.scores.coreScore}</span>
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                          <Link href={`/shoes/${shoe.slug}`} className="btn-ghost" style={{ flex: 1, justifyContent: "center", fontSize: 11, padding: "6px 0" }}>
                            Details <ArrowRight size={11} />
                          </Link>
                          <button onClick={() => setPickerSlot(i)} className="btn-ghost" style={{ padding: "6px 10px", fontSize: 11 }}>Swap</button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setPickerSlot(i)} style={{ width: "100%", background: "var(--bg2)", border: "1.5px dashed var(--border)", borderRadius: 12, padding: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, minHeight: 180, justifyContent: "center", cursor: "pointer", transition: "all 0.15s" }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--border-hi)"}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"}
                    >
                      <div style={{ width: 36, height: 36, borderRadius: "50%", border: "1.5px dashed var(--border-hi)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Plus size={16} color="var(--muted)" />
                      </div>
                      <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "var(--muted)" }}>Add a shoe</span>
                    </button>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          {/* Data rows */}
          <tbody>
            {ROWS.map(({ section, rows }) => (
              <React.Fragment key={section}>
                {/* Section header */}
                <tr>
                  <td colSpan={4} style={{ paddingTop: 24, paddingBottom: 8 }}>
                    <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.7 }}>
                      {section}
                    </span>
                  </td>
                </tr>
                {rows.map(row => {
                  const best = bestVal(row);
                  return (
                    <tr key={row.label} style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                      <td style={{ padding: "12px 0", verticalAlign: "top" }}>
                        <p style={{ fontSize: 13, color: "var(--text)" }}>{row.label}</p>
                        {row.note && <p style={{ fontSize: 10, color: "var(--muted)", marginTop: 2, fontFamily: "'DM Mono',monospace" }}>{row.note}</p>}
                      </td>
                      {slots.map((shoe, si) => (
                        <td key={si} style={{ padding: "12px 10px", verticalAlign: "top" }}>
                          {shoe ? (() => {
                            const val = row.getValue(shoe);
                            const numVal = Number(val);
                            const isBest = best !== null && !isNaN(numVal) && numVal === best && filled.length > 1;
                            return (
                              <span style={{
                                fontFamily: "'DM Mono',monospace", fontSize: 14,
                                color: isBest ? SLOT_COLORS[si] : "var(--text)",
                                fontWeight: isBest ? 600 : 400,
                              }}>
                                {val}
                                {isBest && <span style={{ fontSize: 9, marginLeft: 4, opacity: 0.7 }}>▲</span>}
                              </span>
                            );
                          })() : (
                            <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 16 }}>—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick verdict */}
      {filled.length > 1 && (
        <div style={{ marginTop: 32, padding: "22px 26px", background: "rgba(88,166,255,0.04)", border: "1px solid rgba(88,166,255,0.15)", borderRadius: 12 }}>
          <p className="font-serif" style={{ fontSize: 20, marginBottom: 14 }}>Quick verdict</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: 10 }}>
            {[
              { label: "Best comfort",   winner: filled.reduce((a, b) => a.scores.comfort > b.scores.comfort ? a : b) },
              { label: "Best value",     winner: filled.reduce((a, b) => a.scores.value > b.scores.value ? a : b) },
              { label: "Most durable",   winner: filled.reduce((a, b) => a.scores.durability > b.scores.durability ? a : b) },
              { label: "Lightest",       winner: filled.reduce((a, b) => a.labData.weightG < b.labData.weightG ? a : b) },
              { label: "Best overall",   winner: filled.reduce((a, b) => a.scores.coreScore > b.scores.coreScore ? a : b) },
            ].map(({ label, winner }) => {
              const slotIdx = slots.indexOf(winner);
              const col = SLOT_COLORS[slotIdx] ?? "#58A6FF";
              return (
                <div key={label} style={{ background: "var(--bg2)", border: `1px solid ${col}22`, borderRadius: 8, padding: "12px 14px" }}>
                  <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{label}</p>
                  <p style={{ fontFamily: "'Fraunces',serif", fontSize: 15, color: col }}>{winner.name}</p>
                  <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)", marginTop: 2 }}>{winner.brand} · {fmt(winner.currentLow)}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Shoe picker modal */}
      {pickerSlot !== null && (
        <ShoePicker
          onSelect={shoe => setSlot(pickerSlot, shoe)}
          onClose={() => setPickerSlot(null)}
        />
      )}
    </div>
  );
}
