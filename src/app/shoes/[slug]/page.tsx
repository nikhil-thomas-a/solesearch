"use client";
import React from "react";

import { notFound } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowLeft, Heart, ExternalLink, Check, X, TrendingDown } from "lucide-react";
import { SHOES_BY_SLUG, getSimilarShoes } from "@/data/shoes";
import { formatNumber, scoreColor, softnessLabel, heelDropLabel } from "@/lib/utils";
import { useRegion } from "@/lib/regionContext";

function ScoreRing({ score, size = 90 }: { score: number; size?: number }) {
  const r = (size - 10) / 2, c = size / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const col = score >= 88 ? "#3FB950" : score >= 80 ? "#E3B341" : "#F78166";
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={c} cy={c} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={8} />
        <circle cx={c} cy={c} r={r} fill="none" stroke={col} strokeWidth={8} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: size * 0.28, fontWeight: 600, lineHeight: 1, color: col, fontFamily: "'Fraunces',serif" }}>{score}</span>
        <span style={{ fontSize: 9, color: "var(--muted)", fontFamily: "'DM Mono',monospace", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 2 }}>Score</span>
      </div>
    </div>
  );
}

function SBar({ label, value }: { label: string; value: number }) {
  const col = value >= 88 ? "#3FB950" : value >= 80 ? "#E3B341" : "#F78166";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontSize: 12, color: "var(--muted)" }}>{label}</span>
        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12 }}>{value}</span>
      </div>
      <div style={{ height: 3, background: "var(--bg3)", borderRadius: 99 }}>
        <div style={{ height: "100%", width: `${value}%`, background: col, borderRadius: 99, transition: "width 0.8s ease" }} />
      </div>
    </div>
  );
}

function LabCell({ label, value, unit, note, barPct }: { label: string; value: string | number; unit: string; note?: string; barPct?: number }) {
  return (
    <div style={{ padding: "18px 20px", borderBottom: "1px solid var(--border)", borderRight: "1px solid var(--border)" }}>
      <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{label}</p>
      <p style={{ fontFamily: "'Fraunces',serif", fontSize: 26, fontWeight: 400, lineHeight: 1 }}>
        {value}<span style={{ fontSize: 12, color: "var(--muted)", marginLeft: 3, fontFamily: "'DM Mono',monospace" }}>{unit}</span>
      </p>
      {note && <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>{note}</p>}
      {barPct !== undefined && <div style={{ height: 2, background: "var(--bg3)", borderRadius: 99, marginTop: 8 }}><div style={{ height: "100%", width: `${barPct}%`, background: "var(--accent)", borderRadius: 99 }} /></div>}
    </div>
  );
}

function PriceChart({ history, fmt }: { history: { month: string; price: number }[]; fmt: (p: number) => string }) {
  const min = Math.min(...history.map(p => p.price));
  const max = Math.max(...history.map(p => p.price));
  const range = max - min || 1;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80 }}>
      {history.map(p => {
        const h = Math.max(((p.price - min + 5) / (range + 10)) * 80, 8);
        const isLow = p.price === min;
        return (
          <div key={p.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, height: "100%", justifyContent: "flex-end" }}>
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: isLow ? "#3FB950" : "var(--muted)" }}>{fmt(p.price)}</span>
            <div style={{ width: "100%", height: h, background: isLow ? "rgba(63,185,80,0.35)" : "var(--bg3)", borderRadius: "3px 3px 0 0", border: isLow ? "1px solid rgba(63,185,80,0.4)" : "none" }} />
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: "var(--muted)" }}>{p.month}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function ShoeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(params);
  const shoe = SHOES_BY_SLUG[slug];
  if (!shoe) return notFound();
  const { fmt } = useRegion();

  const similar = getSimilarShoes(shoe);
  const [wishlisted, setWishlisted] = useState(false);
  const cheapest = [...shoe.retailers].sort((a, b) => a.price - b.price)[0];

  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) (e.target as HTMLElement).style.opacity = "1"; }), { threshold: 0.1 });
    els.forEach(el => { (el as HTMLElement).style.opacity = "0"; (el as HTMLElement).style.transition = "opacity 0.5s ease"; obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const SECTIONS = [{ id: "lab", label: "Lab data" }, { id: "fit", label: "Fit guide" }, { id: "prices", label: "Prices" }, { id: "build", label: "Construction" }, { id: "reviews", label: "Reviews" }];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 80px" }}>

      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "20px 0", fontSize: 13, color: "var(--muted)" }}>
        <Link href="/catalogue" style={{ color: "var(--muted)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}><ArrowLeft size={14} /> Catalogue</Link>
        <span>/</span><span>{shoe.brand}</span><span>/</span>
        <span style={{ color: "var(--text)" }}>{shoe.name}</span>
      </div>

      {/* HERO */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36, paddingBottom: 44, borderBottom: "1px solid var(--border)", marginBottom: 36 }}>
        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ aspectRatio: "4/3", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
            <span style={{ fontSize: 80, opacity: 0.25 }}>👟</span>
            <span className="pill-accent" style={{ position: "absolute", top: 14, left: 14 }}>{shoe.subcategory}</span>
            <button onClick={() => setWishlisted(!wishlisted)} style={{ position: "absolute", top: 14, right: 14, width: 36, height: 36, borderRadius: "50%", border: "1px solid var(--border)", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Heart size={15} fill={wishlisted ? "#F78166" : "none"} color={wishlisted ? "#F78166" : "var(--muted)"} />
            </button>
          </div>
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 22px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
              <ScoreRing score={shoe.scores.coreScore} />
              <div>
                <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>CoreScore breakdown</p>
                <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>{formatNumber(shoe.reviews.totalReviews)} reviews · {shoe.reviews.expertReviews} expert tests</p>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {[["Comfort", shoe.scores.comfort], ["Durability", shoe.scores.durability], ["Performance", shoe.scores.performance], ["Value", shoe.scores.value], ["Fit accuracy", shoe.scores.fit]].map(([l, v]) => <SBar key={l} label={l as string} value={v as number} />)}
            </div>
          </div>
        </div>

        {/* Right */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 4 }}>{shoe.brand}</p>
            <h1 className="font-serif" style={{ fontSize: "clamp(30px, 4vw, 50px)", fontWeight: 300, lineHeight: 1.1, marginBottom: 6 }}>{shoe.name}</h1>
            <p className="font-serif" style={{ fontSize: 17, color: "var(--muted)", fontStyle: "italic", marginBottom: 20 }}>{shoe.tagline}</p>

            {/* Quick stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "var(--border)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden", marginBottom: 16 }}>
              {[{ l: "Weight", v: `${shoe.labData.weightG}g` }, { l: "Heel drop", v: `${shoe.labData.heelDropMm}mm` }, { l: "Stack", v: `${shoe.labData.heelStackMm}mm` }].map(s => (
                <div key={s.l} style={{ background: "var(--bg2)", padding: "11px 12px", textAlign: "center" }}>
                  <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>{s.l}</p>
                  <p style={{ fontFamily: "'Fraunces',serif", fontSize: 19, fontWeight: 400 }}>{s.v}</p>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
              {shoe.terrain.map(t => <span key={t} className="pill-muted">{t}</span>)}
              {shoe.labData.reflective && <span className="pill-muted">Reflective</span>}
              {shoe.labData.removableInsole && <span className="pill-muted">Removable insole</span>}
            </div>

            <div style={{ marginBottom: 12 }}>
              <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Best for</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{shoe.bestFor.map(b => <span key={b} className="pill-green">{b}</span>)}</div>
            </div>
            <div>
              <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Not ideal for</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{shoe.notIdealFor.map(b => <span key={b} className="pill-orange">{b}</span>)}</div>
            </div>
          </div>

          {/* Price CTA */}
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 22px", marginTop: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 3 }}>
              <div>
                <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)", textTransform: "uppercase", marginBottom: 3 }}>Best price</p>
                <p className="font-serif" style={{ fontSize: 34, fontWeight: 400, lineHeight: 1, color: "#3FB950" }}>{fmt(cheapest.price)}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)", textTransform: "uppercase", marginBottom: 3 }}>RRP</p>
                <p style={{ textDecoration: "line-through", color: "var(--muted)", fontSize: 15 }}>{fmt(shoe.msrp)}</p>
              </div>
            </div>
            <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>From {cheapest.name} · Updated today</p>
            <a href={cheapest.url} className="btn-accent" style={{ width: "100%", justifyContent: "center", marginBottom: 8 }}>
              Buy from {cheapest.name} <ExternalLink size={14} />
            </a>
            <p style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--muted)", justifyContent: "center" }}>
              <TrendingDown size={11} color="#3FB950" />
              Lowest ever: {fmt(Math.min(...shoe.priceHistory.map(p => p.price)))}
            </p>
          </div>
        </div>
      </div>

      {/* Sticky section nav */}
      <div style={{ position: "sticky", top: 60, zIndex: 30, background: "rgba(13,17,23,0.95)", backdropFilter: "blur(8px)", borderBottom: "1px solid var(--border)", marginLeft: -24, marginRight: -24, padding: "0 24px", marginBottom: 36 }}>
        <div style={{ display: "flex", overflowX: "auto" }}>
          {SECTIONS.map(s => (
            <button key={s.id} onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
              style={{ padding: "13px 16px", background: "none", border: "none", borderBottom: "2px solid transparent", cursor: "pointer", fontFamily: "'DM Mono',monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap", color: "var(--muted)", transition: "all 0.15s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--text)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--muted)"; }}
            >{s.label}</button>
          ))}
        </div>
      </div>

      {/* LAB DATA */}
      <section id="lab" className="reveal" style={{ marginBottom: 48 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 20 }}>
          <span className="section-num">01</span>
          <h2 className="font-serif" style={{ fontSize: 24 }}>Lab measurements</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", border: "1px solid var(--border)", borderBottom: "none", borderRight: "none", borderRadius: "12px 12px 0 0", overflow: "hidden" }}>
          <LabCell label="Weight" value={shoe.labData.weightG} unit="g" note="UK size 9 men's" barPct={Math.round((350 - shoe.labData.weightG) / 200 * 100)} />
          <LabCell label="Heel drop" value={shoe.labData.heelDropMm} unit="mm" note={heelDropLabel(shoe.labData.heelDropMm)} barPct={Math.round(shoe.labData.heelDropMm / 16 * 100)} />
          <LabCell label="Heel stack" value={shoe.labData.heelStackMm} unit="mm" barPct={Math.round(shoe.labData.heelStackMm / 50 * 100)} />
          <LabCell label="Forefoot stack" value={shoe.labData.forefootStackMm} unit="mm" barPct={Math.round(shoe.labData.forefootStackMm / 40 * 100)} />
          <LabCell label="Midsole hardness" value={shoe.labData.midsoleHardnessHC} unit="HC" note={softnessLabel(shoe.labData.midsoleHardnessHC)} barPct={Math.round(shoe.labData.midsoleHardnessHC / 60 * 100)} />
          <LabCell label="Energy return" value={shoe.labData.energyReturnPct} unit="%" note="Higher = bouncier" barPct={shoe.labData.energyReturnPct} />
          <LabCell label="Toebox width" value={shoe.labData.toeboxWidthMm} unit="mm" barPct={Math.round(shoe.labData.toeboxWidthMm / 110 * 100)} />
          <LabCell label="Breathability" value={shoe.labData.breathabilityScore} unit="/100" barPct={shoe.labData.breathabilityScore} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", border: "1px solid var(--border)", borderTop: "none", borderBottom: "none", borderRight: "none", borderRadius: "0 0 12px 12px", overflow: "hidden" }}>
          <LabCell label="Outsole grip" value={shoe.labData.outsoleGripScore} unit="/100" barPct={shoe.labData.outsoleGripScore} />
          <LabCell label="Flexibility" value={shoe.labData.flexibilityScore} unit="/100" barPct={shoe.labData.flexibilityScore} />
          <LabCell label="Heel counter" value={shoe.labData.heelCounterStiffness} unit="/5" note="Ankle hold" barPct={shoe.labData.heelCounterStiffness * 20} />
          <LabCell label="Sustainability" value={shoe.labData.sustainabilityPct} unit="%" note="Recycled content" barPct={shoe.labData.sustainabilityPct} />
        </div>
      </section>

      {/* FIT GUIDE */}
      <section id="fit" className="reveal" style={{ marginBottom: 48 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 20 }}>
          <span className="section-num">02</span>
          <h2 className="font-serif" style={{ fontSize: 24 }}>Fit guide</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 22px" }}>
            <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Sizing specs</p>
            {[["Sizing", shoe.fit.fitNote], ["Size range", shoe.fit.sizeRange], ["Width options", shoe.fit.widthOptions.join(", ")], ["Arch support", shoe.fit.archSupport], ["Removable insole", shoe.labData.removableInsole ? "Yes" : "No"], ["Orthotic ready", shoe.fit.orthoticFriendly ? "Yes" : "No"]].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid var(--border)", fontSize: 14 }}>
                <span style={{ color: "var(--muted)" }}>{k}</span>
                <span style={{ color: "var(--text)", fontWeight: 500, textAlign: "right", maxWidth: "55%" }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 22px" }}>
              <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Best for</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {shoe.bestFor.map(b => <div key={b} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 11px", background: "rgba(63,185,80,0.07)", border: "1px solid rgba(63,185,80,0.2)", borderRadius: 20, fontSize: 13 }}><Check size={10} color="#3FB950" /><span>{b}</span></div>)}
              </div>
            </div>
            <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 22px" }}>
              <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Not ideal for</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {shoe.notIdealFor.map(b => <div key={b} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 11px", background: "rgba(247,129,102,0.07)", border: "1px solid rgba(247,129,102,0.2)", borderRadius: 20, fontSize: 13 }}><X size={10} color="#F78166" /><span>{b}</span></div>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICES */}
      <section id="prices" className="reveal" style={{ marginBottom: 48 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 20 }}>
          <span className="section-num">03</span>
          <h2 className="font-serif" style={{ fontSize: 24 }}>Price tracker</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 22px" }}>
            <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>7-month price history</p>
            <PriceChart history={shoe.priceHistory} fmt={fmt} />
          </div>
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 22px" }}>
            <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Current prices</p>
            {[...shoe.retailers].sort((a, b) => a.price - b.price).map((r, i) => (
              <a key={r.name} href={r.url} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: i === 0 ? "rgba(63,185,80,0.05)" : "var(--bg3)", borderRadius: 8, textDecoration: "none", border: i === 0 ? "1px solid rgba(63,185,80,0.2)" : "1px solid transparent", marginBottom: 5 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ fontSize: 14 }}>{r.name}</span>
                  {i === 0 && <span className="pill-green">Best</span>}
                </div>
                <span style={{ fontFamily: "'Fraunces',serif", fontSize: 17, color: i === 0 ? "#3FB950" : "var(--text)" }}>{fmt(r.price)}</span>
              </a>
            ))}
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
              <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 7 }}>Alert me when price drops below:</p>
              <div style={{ display: "flex", gap: 8 }}>
                <input type="number" placeholder={`e.g. ${fmt(90)}`} className="input-ss" style={{ flex: 1 }} />
                <button className="btn-accent" style={{ padding: "10px 16px", fontSize: 13 }}>Set alert</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONSTRUCTION */}
      <section id="build" className="reveal" style={{ marginBottom: 48 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 20 }}>
          <span className="section-num">04</span>
          <h2 className="font-serif" style={{ fontSize: 24 }}>Construction</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "var(--border)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
          {Object.entries(shoe.construction).map(([key, val]) => (
            <div key={key} style={{ background: "var(--bg)", padding: "16px 20px" }}>
              <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5 }}>{key.replace(/([A-Z])/g, " $1")}</p>
              <p style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.5 }}>{val}</p>
            </div>
          ))}
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="reveal" style={{ marginBottom: 48 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 20 }}>
          <span className="section-num">05</span>
          <h2 className="font-serif" style={{ fontSize: 24 }}>What people say</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "var(--border)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", marginBottom: 18 }}>
          {[[formatNumber(shoe.reviews.totalReviews), "Reviews"], [shoe.reviews.expertReviews, "Expert tests"], [shoe.reviews.sentimentScore, "Sentiment"]].map(([v, l], i) => (
            <div key={l} style={{ background: "var(--bg2)", padding: "18px", textAlign: "center" }}>
              <p className="font-serif" style={{ fontSize: 30, fontWeight: 400, color: i === 2 ? "#3FB950" : "var(--text)", lineHeight: 1, marginBottom: 4 }}>{v}</p>
              <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{l}</p>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div>
            <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "#3FB950", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>What people love</p>
            {shoe.reviews.pros.map(p => (
              <div key={p} style={{ display: "flex", gap: 10, paddingBottom: 11, marginBottom: 11, borderBottom: "1px solid var(--border)", fontSize: 14, lineHeight: 1.55 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#3FB950", flexShrink: 0, marginTop: 8 }} />
                <span>{p}</span>
              </div>
            ))}
          </div>
          <div>
            <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "#F78166", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Common complaints</p>
            {shoe.reviews.cons.map(c => (
              <div key={c} style={{ display: "flex", gap: 10, paddingBottom: 11, marginBottom: 11, borderBottom: "1px solid var(--border)", fontSize: 14, lineHeight: 1.55 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#F78166", flexShrink: 0, marginTop: 8 }} />
                <span>{c}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SIMILAR */}
      {similar.length > 0 && (
        <section className="reveal">
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 20 }}>
            <span className="section-num">06</span>
            <h2 className="font-serif" style={{ fontSize: 24 }}>Similar shoes</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 10 }}>
            {similar.map(s => (
              <Link key={s.slug} href={`/shoes/${s.slug}`}
                style={{ display: "block", textDecoration: "none", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 18px", transition: "all 0.2s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-hi)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.transform = "none"; }}
              >
                <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>{s.brand}</p>
                <p className="font-serif" style={{ fontSize: 17, marginBottom: 12 }}>{s.name}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "'Fraunces',serif", fontSize: 19, color: "#3FB950" }}>{fmt(s.currentLow)}</span>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 13, color: scoreColor(s.scores.coreScore) }}>{s.scores.coreScore}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}