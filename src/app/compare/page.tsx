"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, X, ArrowRight } from "lucide-react";

const MOCK_SHOES = [
  {
    id: "nike-pegasus-41", brand: "Nike", name: "Pegasus 41", price: 119, msrp: 130, score: 88, subcategory: "Road Running",
    scores: { comfort: 91, durability: 84, performance: 87, value: 82, fit: 90 },
    lab: { weight: "284g", drop: "10mm", heelStack: "33mm", forefootStack: "23mm", hardness: "28 HC (soft)", energy: "64%", toeboxW: "92mm", breathability: "74/100" },
    fit: { arch: "Neutral", widths: "D, 2E", orthotics: "Yes", sizing: "True to size" },
    bestFor: ["Daily training", "Long runs", "New runners"],
  },
  {
    id: "asics-gel-nimbus-26", brand: "ASICS", name: "Gel-Nimbus 26", price: 160, msrp: 160, score: 89, subcategory: "Road Running",
    scores: { comfort: 94, durability: 86, performance: 88, value: 78, fit: 91 },
    lab: { weight: "295g", drop: "10mm", heelStack: "40mm", forefootStack: "30mm", hardness: "24 HC (very soft)", energy: "58%", toeboxW: "96mm", breathability: "70/100" },
    fit: { arch: "Neutral", widths: "D, 2E", orthotics: "Yes", sizing: "True to size" },
    bestFor: ["Max comfort", "Long distances", "Heavy runners"],
  },
  null,
];

type MockShoe = typeof MOCK_SHOES[0];

const ROWS: { section: string; rows: { label: string; key: keyof NonNullable<MockShoe>["lab"] | string; note?: string }[] }[] = [
  { section: "Scores", rows: [
    { label: "Overall score",   key: "score" },
    { label: "Comfort",         key: "comfort" },
    { label: "Durability",      key: "durability" },
    { label: "Performance",     key: "performance" },
    { label: "Value for money", key: "value" },
  ]},
  { section: "Lab measurements", rows: [
    { label: "Weight",           key: "weight",        note: "Lighter = faster, heavier = more durable" },
    { label: "Heel drop",        key: "drop",           note: "Lower = more natural feel" },
    { label: "Heel stack",       key: "heelStack",      note: "Higher = more cushion underfoot" },
    { label: "Midsole softness", key: "hardness",       note: "Lower HC = softer foam" },
    { label: "Energy return",    key: "energy",         note: "Higher = bouncier, more responsive" },
    { label: "Toebox width",     key: "toeboxW",        note: "Wider = more room for your toes" },
    { label: "Breathability",    key: "breathability",  note: "Higher = cooler in warm conditions" },
  ]},
  { section: "Fit & sizing", rows: [
    { label: "Arch support",    key: "arch" },
    { label: "Width options",   key: "widths" },
    { label: "Orthotic ready",  key: "orthotics" },
    { label: "Sizing",          key: "sizing" },
  ]},
];

function getVal(shoe: NonNullable<MockShoe>, key: string): string | number {
  if (key in shoe) return (shoe as any)[key];
  if (key in shoe.lab) return (shoe.lab as any)[key];
  if (key in shoe.fit) return (shoe.fit as any)[key];
  if (key in shoe.scores) return (shoe.scores as any)[key];
  return "—";
}

function ScoreBadge({ value }: { value: number }) {
  const color = value >= 88 ? "#2D6A4F" : value >= 80 ? "#C84B31" : "#7A7469";
  const bg = value >= 88 ? "rgba(45,106,79,0.1)" : value >= 80 ? "rgba(200,75,49,0.08)" : "rgba(0,0,0,0.05)";
  return (
    <span style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 400, color, background: bg, padding: "4px 10px", borderRadius: 8 }}>
      {value}
    </span>
  );
}

export default function ComparePage() {
  const [shoes, setShoes] = useState<(NonNullable<MockShoe> | null)[]>(MOCK_SHOES as any);
  const removeShoe = (i: number) => setShoes(prev => { const n = [...prev]; n[i] = null; return n; });

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
          <span className="section-num">Side by side</span>
          <h1 className="font-serif" style={{ fontSize: 32, fontWeight: 300 }}>Compare shoes</h1>
        </div>
        <p style={{ color: "var(--muted)", fontSize: 15 }}>
          Add up to 3 shoes to compare every spec and measurement side by side.
        </p>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
          {/* Shoe headers */}
          <thead>
            <tr>
              <th style={{ width: 180, padding: "0 0 24px", textAlign: "left", verticalAlign: "bottom" }}>
                <span style={{ fontSize: 11, fontFamily: "'DM Mono', monospace", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em" }}>Comparing</span>
              </th>
              {shoes.map((shoe, i) => (
                <th key={i} style={{ padding: "0 16px 24px", verticalAlign: "bottom", minWidth: 200 }}>
                  {shoe ? (
                    <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: 16, position: "relative" }}>
                      <button onClick={() => removeShoe(i)} style={{ position: "absolute", top: 10, right: 10, background: "var(--bg3)", border: "none", borderRadius: "50%", width: 24, height: 24, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <X size={12} color="var(--muted)" />
                      </button>
                      <div style={{ aspectRatio: "4/3", background: "var(--bg3)", borderRadius: 8, marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 32 }}>👟</span>
                      </div>
                      <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>{shoe.brand}</p>
                      <p className="font-serif" style={{ fontSize: 18, fontWeight: 400, marginBottom: 8 }}>{shoe.name}</p>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontWeight: 600, fontSize: 16 }}>${shoe.price}</span>
                        <ScoreBadge value={shoe.score} />
                      </div>
                      <Link href={`/shoes/${shoe.id}`} className="btn-ghost" style={{ marginTop: 10, width: "100%", justifyContent: "center", fontSize: 12, padding: "7px 0" }}>
                        Full details <ArrowRight size={12} />
                      </Link>
                    </div>
                  ) : (
                    <div style={{ background: "var(--bg2)", border: "1.5px dashed var(--border)", borderRadius: 12, padding: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, minHeight: 180, justifyContent: "center" }}>
                      <div style={{ width: 40, height: 40, borderRadius: "50%", border: "1.5px dashed var(--border-hi)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Plus size={18} color="var(--muted)" />
                      </div>
                      <p style={{ fontSize: 13, color: "var(--muted)", textAlign: "center" }}>Add a shoe</p>
                      <Link href="/catalogue" className="btn-ghost" style={{ fontSize: 12, padding: "6px 14px" }}>Browse</Link>
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {ROWS.map(({ section, rows }) => (
              <>
                {/* Section header row */}
                <tr key={`section-${section}`}>
                  <td colSpan={4} style={{ padding: "20px 0 8px" }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.7 }}>{section}</span>
                  </td>
                </tr>
                {rows.map(({ label, key, note }) => (
                  <tr key={key} style={{ borderTop: "1px solid var(--border)" }}>
                    <td style={{ padding: "14px 0 14px", verticalAlign: "top" }}>
                      <p style={{ fontSize: 14, color: "var(--text)" }}>{label}</p>
                      {note && <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 2, fontFamily: "'DM Mono', monospace" }}>{note}</p>}
                    </td>
                    {shoes.map((shoe, si) => (
                      <td key={si} style={{ padding: "14px 16px", verticalAlign: "top" }}>
                        {shoe ? (
                          typeof getVal(shoe, key) === "number" && key !== "weight" ? (
                            <div>
                              <ScoreBadge value={getVal(shoe, key) as number} />
                            </div>
                          ) : (
                            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 14, color: "var(--text)" }}>
                              {String(getVal(shoe, key))}
                            </span>
                          )
                        ) : (
                          <span style={{ color: "var(--border-hi)" }}>—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
