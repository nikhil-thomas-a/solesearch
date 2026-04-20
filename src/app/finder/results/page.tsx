import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, AlertTriangle } from "lucide-react";

export const metadata: Metadata = { title: "Your matches — Finder" };

// Mock recommendation data — will be replaced by AI engine output
const RECOMMENDATIONS = [
  {
    rank: 1, matchScore: 96,
    brand: "Brooks", name: "Ghost 16",
    price: 140, score: 85,
    reasons: ["Wide (2E) option matches your foot width", "Neutral arch support fits your foot type", "Plush cushioning aligns with your preference", "Proven for high-mileage daily training"],
    warnings: [],
    labHighlights: [{ label: "Weight", value: "268g" }, { label: "Drop", value: "12mm" }, { label: "Stack", value: "36mm" }],
  },
  {
    rank: 2, matchScore: 91,
    brand: "ASICS", name: "Gel-Nimbus 26",
    price: 160, score: 89,
    reasons: ["Superior cushioning for your body weight", "Orthotics compatible — fits your removable insole need", "FF Blast+ foam rated highly for energy return"],
    warnings: ["Slightly above your $150 budget"],
    labHighlights: [{ label: "Weight", value: "295g" }, { label: "Drop", value: "10mm" }, { label: "Stack", value: "40mm" }],
  },
  {
    rank: 3, matchScore: 87,
    brand: "New Balance", name: "880 v14",
    price: 135, score: 87,
    reasons: ["True to size with roomy toe box", "FreshFoam X midsole rated soft for comfort", "Durable — excellent for 30–50km/week"],
    warnings: [],
    labHighlights: [{ label: "Weight", value: "280g" }, { label: "Drop", value: "10mm" }, { label: "Stack", value: "33mm" }],
  },
  {
    rank: 4, matchScore: 82,
    brand: "Saucony", name: "Ride 17",
    price: 140, score: 86,
    reasons: ["PWRRUN+ foam matches your preference for responsive cushion", "Engineered mesh upper breathes well"],
    warnings: ["Narrower fit — may not suit wider feet"],
    labHighlights: [{ label: "Weight", value: "256g" }, { label: "Drop", value: "8mm" }, { label: "Stack", value: "34mm" }],
  },
];

export default function FinderResultsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-12">
        <p className="font-mono text-xs text-[rgba(232,255,74,0.5)] uppercase tracking-widest mb-3">Your results</p>
        <h1 className="font-serif text-4xl md:text-5xl mb-3">
          We found <span style={{ color: "#E8FF4A", fontStyle: "italic" }}>4 great matches</span>.
        </h1>
        <p className="text-[#888580]">
          Based on your foot profile, biomechanics, and preferences. Ranked by fit score — not popularity.
        </p>
        <div className="flex gap-4 mt-6">
          <Link href="/finder" className="btn-ghost text-xs">Retake quiz</Link>
          <Link href="/catalogue" className="btn-ghost text-xs">Browse all shoes</Link>
        </div>
      </div>

      {/* Recommendations */}
      <div className="flex flex-col gap-6">
        {RECOMMENDATIONS.map((rec) => (
          <div
            key={rec.rank}
            className="relative flex flex-col md:flex-row gap-0 rounded-sm overflow-hidden"
            style={{
              border: rec.rank === 1 ? "1px solid rgba(232,255,74,0.3)" : "1px solid rgba(255,255,255,0.08)",
              background: rec.rank === 1 ? "rgba(232,255,74,0.02)" : "#111111",
            }}
          >
            {/* Rank strip */}
            <div
              className="flex md:flex-col items-center justify-center px-5 py-4 md:py-0 md:w-14 shrink-0"
              style={{ borderRight: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.3)" }}
            >
              <span className="font-mono text-xs text-[#888580]">#{rec.rank}</span>
            </div>

            {/* Main content */}
            <div className="flex-1 p-5">
              {/* Title row */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="font-mono text-[10px] text-[#888580] uppercase tracking-widest mb-0.5">{rec.brand}</p>
                  <h2 className="font-serif text-2xl">{rec.name}</h2>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="font-semibold text-xl" style={{ color: "#E8FF4A" }}>{rec.matchScore}%</span>
                  <span className="font-mono text-[10px] text-[#888580] uppercase tracking-widest">match</span>
                </div>
              </div>

              {/* Lab highlights */}
              <div className="flex gap-4 mb-4">
                {rec.labHighlights.map((h) => (
                  <div key={h.label}>
                    <p className="font-mono text-[10px] text-[#888580] uppercase tracking-widest">{h.label}</p>
                    <p className="font-mono text-sm text-[#F0EEE8]">{h.value}</p>
                  </div>
                ))}
              </div>

              {/* Reasons */}
              <div className="flex flex-col gap-1.5 mb-3">
                {rec.reasons.map((r) => (
                  <div key={r} className="flex items-start gap-2">
                    <Check size={11} className="shrink-0 mt-0.5" color="#E8FF4A" />
                    <span className="text-sm text-[#888580]">{r}</span>
                  </div>
                ))}
              </div>

              {/* Warnings */}
              {rec.warnings.map((w) => (
                <div key={w} className="flex items-center gap-2 mt-2">
                  <AlertTriangle size={11} className="shrink-0" color="#FF6B35" />
                  <span className="text-sm text-[#FF6B35]">{w}</span>
                </div>
              ))}
            </div>

            {/* Price + CTA */}
            <div
              className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 p-5 md:w-40 shrink-0"
              style={{ borderLeft: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="text-right">
                <p className="font-mono text-[10px] text-[#888580] mb-0.5">From</p>
                <p className="font-semibold text-lg">${rec.price}</p>
                <p className="font-mono text-[10px] text-[#888580]">CoreScore {rec.score}</p>
              </div>
              <Link
                href={`/shoes/${rec.brand.toLowerCase()}-${rec.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="btn-outline flex items-center gap-1.5 text-[10px] !py-2"
              >
                View <ArrowRight size={10} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
