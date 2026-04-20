import { Metadata } from "next";
import Link from "next/link";
import { Plus, X } from "lucide-react";

export const metadata: Metadata = { title: "Compare shoes" };

const SLOT_COUNT = 3;

const COMPARE_ROWS: { section: string; rows: { label: string; keys: string[]; unit?: string }[] }[] = [
  { section: "Scores",      rows: [
    { label: "CoreScore",          keys: ["scores.coreScore"] },
    { label: "Comfort",            keys: ["scores.comfort"] },
    { label: "Durability",         keys: ["scores.durability"] },
    { label: "Performance",        keys: ["scores.performance"] },
    { label: "Value",              keys: ["scores.value"] },
  ]},
  { section: "Lab data",    rows: [
    { label: "Weight",             keys: ["labData.weightG"],            unit: "g" },
    { label: "Heel drop",          keys: ["labData.heelDropMm"],         unit: "mm" },
    { label: "Heel stack",         keys: ["labData.heelStackMm"],        unit: "mm" },
    { label: "Forefoot stack",     keys: ["labData.forefootStackMm"],    unit: "mm" },
    { label: "Midsole hardness",   keys: ["labData.midsoleHardnessHC"],  unit: "HC" },
    { label: "Energy return",      keys: ["labData.energyReturnPct"],    unit: "%" },
    { label: "Toebox width",       keys: ["labData.toeboxWidthMm"],      unit: "mm" },
    { label: "Breathability",      keys: ["labData.breathabilityScore"], unit: "/100" },
  ]},
  { section: "Fit",         rows: [
    { label: "Arch support",       keys: ["fit.archSupport"] },
    { label: "Width options",      keys: ["fit.widthOptions"] },
    { label: "Orthotic friendly",  keys: ["fit.orthoticFriendly"] },
  ]},
  { section: "Price",       rows: [
    { label: "MSRP",               keys: ["msrp"],       unit: "$" },
    { label: "Current best price", keys: ["currentLow"], unit: "$" },
  ]},
];

// Mock filled-in shoes (slots 1 filled, 2 and 3 empty)
const MOCK_SHOES = [
  { name: "Pegasus 41", brand: "Nike", scores: { coreScore: 88, comfort: 91, durability: 84, performance: 87, value: 82 }, labData: { weightG: 284, heelDropMm: 10, heelStackMm: 33, forefootStackMm: 23, midsoleHardnessHC: 28, energyReturnPct: 64, toeboxWidthMm: 92, breathabilityScore: 74 }, fit: { archSupport: "Neutral", widthOptions: "D, 2E", orthoticFriendly: "Yes" }, msrp: 130, currentLow: 119 },
  null,
  null,
];

export default function ComparePage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-baseline gap-4 mb-10">
        <span className="font-mono text-xs text-[rgba(232,255,74,0.4)]">Side by side</span>
        <h1 className="font-serif text-3xl">Compare shoes</h1>
      </div>

      {/* Shoe slots */}
      <div className="grid gap-px mb-0" style={{ gridTemplateColumns: `200px repeat(${SLOT_COUNT}, 1fr)`, background: "rgba(255,255,255,0.08)" }}>
        {/* Top-left empty cell */}
        <div className="bg-[#0A0A0A] p-4" />

        {/* Shoe slot headers */}
        {MOCK_SHOES.map((shoe, i) =>
          shoe ? (
            <div key={i} className="bg-[#0A0A0A] p-5 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-mono text-[10px] text-[#888580] uppercase tracking-widest">{shoe.brand}</p>
                  <p className="font-serif text-xl mt-0.5">{shoe.name}</p>
                </div>
                <button className="text-[#888580] hover:text-[#F0EEE8] transition-colors">
                  <X size={14} />
                </button>
              </div>
              <div
                className="aspect-[4/3] flex items-center justify-center rounded-sm"
                style={{ background: "#141414" }}
              >
                <div className="w-16 h-8 rounded-full opacity-10" style={{ background: "#E8FF4A" }} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-semibold">${shoe.currentLow}</span>
                <span className="font-mono text-xs" style={{ color: "#E8FF4A" }}>
                  {shoe.scores.coreScore}
                </span>
              </div>
              <Link href={`/shoes/nike-pegasus-41`} className="btn-ghost text-center text-xs !py-2">
                View full details
              </Link>
            </div>
          ) : (
            <div key={i} className="bg-[#0A0A0A] p-5 flex flex-col items-center justify-center gap-3 min-h-[220px]">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ border: "1px dashed rgba(255,255,255,0.18)" }}
              >
                <Plus size={16} color="#888580" />
              </div>
              <p className="font-mono text-xs text-[#888580] text-center">Add a shoe</p>
              <Link href="/catalogue" className="btn-ghost text-xs !py-1.5">Browse</Link>
            </div>
          )
        )}
      </div>

      {/* Comparison rows */}
      {COMPARE_ROWS.map(({ section, rows }) => (
        <div key={section}>
          {/* Section label */}
          <div
            className="grid"
            style={{
              gridTemplateColumns: `200px repeat(${SLOT_COUNT}, 1fr)`,
              background: "rgba(255,255,255,0.08)",
              gap: "1px",
            }}
          >
            <div
              className="bg-[#111111] px-4 py-2 flex items-center"
              style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
            >
              <span className="font-mono text-[10px] text-[rgba(232,255,74,0.5)] uppercase tracking-widest">
                {section}
              </span>
            </div>
            {MOCK_SHOES.map((_, i) => (
              <div key={i} className="bg-[#111111]" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} />
            ))}
          </div>

          {/* Data rows */}
          {rows.map(({ label, unit }, ri) => (
            <div
              key={label}
              className="grid"
              style={{
                gridTemplateColumns: `200px repeat(${SLOT_COUNT}, 1fr)`,
                background: "rgba(255,255,255,0.08)",
                gap: "1px",
              }}
            >
              <div className="bg-[#0A0A0A] px-4 py-3 flex items-center">
                <span className="text-sm text-[#888580]">{label}</span>
              </div>
              {MOCK_SHOES.map((shoe, si) => (
                <div key={si} className="bg-[#0A0A0A] px-4 py-3 flex items-center">
                  {shoe ? (
                    <span className="font-mono text-sm text-[#F0EEE8]">
                      {String(Object.values(shoe)[ri + 2] ?? "—")}
                      {unit && <span className="text-[#888580] ml-0.5">{unit}</span>}
                    </span>
                  ) : (
                    <span className="text-[#888580]">—</span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
