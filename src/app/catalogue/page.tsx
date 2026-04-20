"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { SHOES } from "@/data/shoes";
import { useRegion } from "@/lib/regionContext";
import { scoreColor } from "@/lib/utils";
import type { Shoe } from "@/types";

const BRANDS = [...new Set(SHOES.map(s => s.brand))].sort();
const CATEGORIES = [
  { slug: "road-running",  label: "Road running" },
  { slug: "trail-running", label: "Trail running" },
  { slug: "sneakers",      label: "Sneakers" },
  { slug: "gym-training",  label: "Gym & training" },
  { slug: "basketball",    label: "Basketball" },
  { slug: "hiking",        label: "Hiking" },
  { slug: "walking",       label: "Walking" },
  { slug: "work-safety",   label: "Work & safety" },
];
type SortKey = "score" | "price-asc" | "price-desc" | "weight";

function ShoeCard({ shoe }: { shoe: Shoe }) {
  const col = scoreColor(shoe.scores.coreScore);
  const { fmt } = useRegion();
  return (
    <Link href={"/shoes/" + shoe.slug} style={{ display: "block", textDecoration: "none", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", transition: "all 0.2s" }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--border-hi)"; el.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "var(--border)"; el.style.transform = "none"; }}
    >
      <div style={{ aspectRatio: "4/3", background: "var(--bg3)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <span style={{ fontSize: 52, opacity: 0.2 }}>👟</span>
        <span style={{ position: "absolute", bottom: 10, right: 10, width: 40, height: 40, borderRadius: "50%", background: "rgba(13,17,23,0.85)", border: "2px solid " + col, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "'Fraunces',serif", fontSize: 14, color: col }}>{shoe.scores.coreScore}</span>
        </span>
        <span style={{ position: "absolute", top: 10, left: 10, fontFamily: "'DM Mono',monospace", fontSize: 9, padding: "3px 8px", borderRadius: 20, background: "rgba(88,166,255,0.15)", color: "var(--accent)", border: "1px solid rgba(88,166,255,0.25)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{shoe.subcategory}</span>
      </div>
      <div style={{ padding: "14px 16px" }}>
        <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>{shoe.brand}</p>
        <p style={{ fontFamily: "'Fraunces',serif", fontSize: 17, lineHeight: 1.2, marginBottom: 10 }}>{shoe.name}</p>
        <div style={{ display: "flex", gap: 8, fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)", marginBottom: 10 }}>
          <span>{shoe.labData.weightG}g</span><span style={{ opacity: 0.3 }}>·</span>
          <span>{shoe.labData.heelDropMm}mm drop</span><span style={{ opacity: 0.3 }}>·</span>
          <span>{shoe.labData.heelStackMm}mm stack</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: 10, borderTop: "1px solid var(--border)" }}>
          <span style={{ fontFamily: "'Fraunces',serif", fontSize: 19, color: "#3FB950" }}>{fmt(shoe.currentLow)}</span>
          {shoe.currentLow < shoe.msrp && <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)", textDecoration: "line-through" }}>{fmt(shoe.msrp)}</span>}
        </div>
      </div>
    </Link>
  );
}

export default function CataloguePage() {
  const [query, setQuery]                   = useState("");
  const [selectedCats, setSelectedCats]     = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice]             = useState(400);
  const [minScore, setMinScore]             = useState(0);
  const [sortBy, setSortBy]                 = useState<SortKey>("score");
  const [sidebarOpen, setSidebarOpen]       = useState(true);

  const toggleCat   = (c: string) => setSelectedCats(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c]);
  const toggleBrand = (b: string) => setSelectedBrands(p => p.includes(b) ? p.filter(x => x !== b) : [...p, b]);

  const filtered = useMemo(() => {
    let r = [...SHOES];
    if (query)               r = r.filter(s => (s.name + " " + s.brand).toLowerCase().includes(query.toLowerCase()));
    if (selectedCats.length) r = r.filter(s => selectedCats.includes(s.category));
    if (selectedBrands.length) r = r.filter(s => selectedBrands.includes(s.brand));
    r = r.filter(s => s.currentLow <= maxPrice && s.scores.coreScore >= minScore);
    if (sortBy === "score")      r.sort((a, b) => b.scores.coreScore - a.scores.coreScore);
    if (sortBy === "price-asc")  r.sort((a, b) => a.currentLow - b.currentLow);
    if (sortBy === "price-desc") r.sort((a, b) => b.currentLow - a.currentLow);
    if (sortBy === "weight")     r.sort((a, b) => a.labData.weightG - b.labData.weightG);
    return r;
  }, [query, selectedCats, selectedBrands, maxPrice, minScore, sortBy]);

  const activeFilters = selectedCats.length + selectedBrands.length + (minScore > 0 ? 1 : 0);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {sidebarOpen && (
        <aside style={{ width: 230, flexShrink: 0, borderRight: "1px solid var(--border)", padding: "24px 18px", position: "sticky", top: 60, alignSelf: "flex-start", maxHeight: "calc(100vh - 60px)", overflowY: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Filters</span>
            {activeFilters > 0 && <button onClick={() => { setSelectedCats([]); setSelectedBrands([]); setMinScore(0); }} style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--accent)", background: "none", border: "none", cursor: "pointer" }}>Clear {activeFilters}</button>}
          </div>
          <div style={{ marginBottom: 22 }}>
            <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Category</p>
            {CATEGORIES.map(c => (
              <label key={c.slug} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", cursor: "pointer" }}>
                <input type="checkbox" checked={selectedCats.includes(c.slug)} onChange={() => toggleCat(c.slug)} style={{ accentColor: "var(--accent)", width: 13, height: 13 }} />
                <span style={{ fontSize: 13, color: selectedCats.includes(c.slug) ? "var(--text)" : "var(--muted)", transition: "color 0.15s" }}>{c.label}</span>
              </label>
            ))}
          </div>
          <div style={{ marginBottom: 22, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
            <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Brand</p>
            {BRANDS.map(b => (
              <label key={b} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", cursor: "pointer" }}>
                <input type="checkbox" checked={selectedBrands.includes(b)} onChange={() => toggleBrand(b)} style={{ accentColor: "var(--accent)", width: 13, height: 13 }} />
                <span style={{ fontSize: 13, color: selectedBrands.includes(b) ? "var(--text)" : "var(--muted)", transition: "color 0.15s" }}>{b}</span>
              </label>
            ))}
          </div>
          <div style={{ marginBottom: 22, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Max price</p>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "var(--accent)" }}>{maxPrice === 400 ? "Any" : "$" + maxPrice}</span>
            </div>
            <input type="range" min={50} max={400} step={10} value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--accent)" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)", marginTop: 4 }}><span>$50</span><span>$400</span></div>
          </div>
          <div style={{ paddingTop: 16, borderTop: "1px solid var(--border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Min CoreScore</p>
              <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "var(--accent)" }}>{minScore > 0 ? minScore + "+" : "Any"}</span>
            </div>
            <input type="range" min={0} max={95} step={5} value={minScore} onChange={e => setMinScore(Number(e.target.value))} style={{ width: "100%", accentColor: "var(--accent)" }} />
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)", marginTop: 4 }}><span>Any</span><span>95+</span></div>
          </div>
        </aside>
      )}

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", borderBottom: "1px solid var(--border)", position: "sticky", top: 60, background: "rgba(13,17,23,0.95)", backdropFilter: "blur(8px)", zIndex: 20 }}>
          <button onClick={() => setSidebarOpen(p => !p)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, cursor: "pointer", fontFamily: "'DM Mono',monospace", fontSize: 11, color: "var(--muted)" }}>
            <SlidersHorizontal size={13} /> Filters
            {activeFilters > 0 && <span style={{ background: "var(--accent)", color: "#0D1117", borderRadius: "50%", width: 16, height: 16, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 600 }}>{activeFilters}</span>}
          </button>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, padding: "7px 12px" }}>
            <Search size={14} color="var(--muted)" />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search shoes, brands…" style={{ flex: 1, background: "none", border: "none", outline: "none", color: "var(--text)", fontSize: 14, fontFamily: "'DM Sans',sans-serif" }} />
            {query && <button onClick={() => setQuery("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)" }}><X size={13} /></button>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "var(--muted)" }}>{filtered.length} shoes</span>
            <select value={sortBy} onChange={e => setSortBy(e.target.value as SortKey)} style={{ background: "var(--bg2)", border: "1px solid var(--border)", color: "var(--text)", padding: "7px 10px", borderRadius: 8, fontFamily: "'DM Mono',monospace", fontSize: 11, outline: "none", cursor: "pointer" }}>
              <option value="score">Best score</option>
              <option value="price-asc">Price: low–high</option>
              <option value="price-desc">Price: high–low</option>
              <option value="weight">Lightest first</option>
            </select>
          </div>
        </div>

        {activeFilters > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "10px 18px", borderBottom: "1px solid var(--border)" }}>
            {selectedCats.map(c => <button key={c} onClick={() => toggleCat(c)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", background: "rgba(88,166,255,0.1)", border: "1px solid rgba(88,166,255,0.25)", borderRadius: 20, fontFamily: "'DM Mono',monospace", fontSize: 11, color: "var(--accent)", cursor: "pointer" }}>{CATEGORIES.find(x => x.slug === c)?.label} <X size={10} /></button>)}
            {selectedBrands.map(b => <button key={b} onClick={() => toggleBrand(b)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", background: "rgba(88,166,255,0.1)", border: "1px solid rgba(88,166,255,0.25)", borderRadius: 20, fontFamily: "'DM Mono',monospace", fontSize: 11, color: "var(--accent)", cursor: "pointer" }}>{b} <X size={10} /></button>)}
          </div>
        )}

        <div style={{ padding: "18px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 12 }}>
          {filtered.length > 0 ? filtered.map(shoe => <ShoeCard key={shoe.id} shoe={shoe} />) : (
            <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0", color: "var(--muted)", gap: 12 }}>
              <span style={{ fontSize: 40 }}>🔍</span>
              <p style={{ fontFamily: "'Fraunces',serif", fontSize: 20 }}>No shoes match your filters</p>
              <button onClick={() => { setQuery(""); setSelectedCats([]); setSelectedBrands([]); setMinScore(0); setMaxPrice(400); }} className="btn-ghost" style={{ marginTop: 8 }}>Clear all filters</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
