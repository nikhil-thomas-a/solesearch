import Link from "next/link";
import { ArrowRight, FlaskConical, Brain, TrendingDown } from "lucide-react";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { SHOE_COUNT, CATEGORY_COUNTS } from "@/data/shoes";

const CAT_COUNT = Object.keys(CATEGORY_COUNTS).length;

const CATEGORIES = [
  { emoji:"🏃", label:"Road running",    href:"/catalogue?category=road-running",    count: CATEGORY_COUNTS["road-running"]    ?? 0 },
  { emoji:"🏔️", label:"Trail running",   href:"/catalogue?category=trail-running",   count: CATEGORY_COUNTS["trail-running"]   ?? 0 },
  { emoji:"👟", label:"Sneakers",        href:"/catalogue?category=sneakers",         count: CATEGORY_COUNTS["sneakers"]        ?? 0 },
  { emoji:"🏋️", label:"Gym & training", href:"/catalogue?category=gym-training",    count: CATEGORY_COUNTS["gym-training"]    ?? 0 },
  { emoji:"🏀", label:"Basketball",      href:"/catalogue?category=basketball",       count: CATEGORY_COUNTS["basketball"]      ?? 0 },
  { emoji:"⚽", label:"Football",        href:"/catalogue?category=football",         count: CATEGORY_COUNTS["football"]        ?? 0 },
  { emoji:"⛰️", label:"Hiking",          href:"/catalogue?category=hiking",           count: CATEGORY_COUNTS["hiking"]          ?? 0 },
  { emoji:"🎾", label:"Tennis",          href:"/catalogue?category=tennis",           count: CATEGORY_COUNTS["tennis"]          ?? 0 },
  { emoji:"🚶", label:"Walking",         href:"/catalogue?category=walking",          count: CATEGORY_COUNTS["walking"]         ?? 0 },
  { emoji:"🦺", label:"Work & safety",  href:"/catalogue?category=work-safety",      count: CATEGORY_COUNTS["work-safety"]     ?? 0 },
  { emoji:"🏥", label:"Healthcare",      href:"/catalogue?category=healthcare",       count: CATEGORY_COUNTS["healthcare"]      ?? 0 },
  { emoji:"🦶", label:"Wide & ortho",    href:"/catalogue?category=wide-orthopaedic",count: CATEGORY_COUNTS["wide-orthopaedic"]?? 0 },
];

const HOW_IT_WORKS = [
  { icon: Brain,        num:"01", title:"Tell us about your feet",  desc:"6 plain-English questions. No jargon — just describe how your shoes feel today.", color:"#58A6FF" },
  { icon: FlaskConical, num:"02", title:"We match you with data",   desc:"9 signals scored per shoe — width, cushioning, arch, injury history, drop, and more.", color:"#3FB950" },
  { icon: TrendingDown, num:"03", title:"Get ranked picks + deals", desc:"Your top shoes explained in plain English, with the best price across 200+ stores.", color:"#E3B341" },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section style={{ padding:"100px 48px 80px", position:"relative", borderBottom:"1px solid rgba(255,255,255,0.07)", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize:"60px 60px", pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:-100, right:-100, width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle, rgba(88,166,255,0.07) 0%, transparent 70%)", pointerEvents:"none" }} />

        <div style={{ maxWidth:680, position:"relative" }}>
          <span className="pill-accent animate-fade-up" style={{ marginBottom:24, display:"inline-flex" }}>Free · No sign-up required</span>
          <h1 className="font-serif animate-fade-up" style={{ fontSize:"clamp(40px, 5.5vw, 72px)", lineHeight:1.1, fontWeight:300, marginBottom:20, animationDelay:"0.08s" }}>
            Find shoes that<br />
            <em style={{ color:"var(--accent)" }}>actually fit</em><br />
            your body.
          </h1>
          <p className="animate-fade-up" style={{ fontSize:17, color:"var(--muted)", lineHeight:1.7, maxWidth:500, marginBottom:32, animationDelay:"0.16s" }}>
            Answer 6 plain-English questions. Get matched to shoes using real lab data — not ads, not sponsorships. Every category from running to work boots.
          </p>
          <div className="animate-fade-up" style={{ display:"flex", gap:12, flexWrap:"wrap", animationDelay:"0.22s" }}>
            <Link href="/finder" className="btn-primary">Find my perfect shoe <ArrowRight size={16} /></Link>
            <Link href="/catalogue" className="btn-ghost">Browse all shoes</Link>
          </div>

          {/* Real stats */}
          <div className="animate-fade-up" style={{ display:"flex", gap:28, marginTop:48, paddingTop:28, borderTop:"1px solid rgba(255,255,255,0.07)", flexWrap:"wrap", animationDelay:"0.3s" }}>
            {[
              [String(SHOE_COUNT), "shoes in database"],
              [String(CAT_COUNT), "categories covered"],
              ["9", "match signals per shoe"],
              ["Free", "always"],
            ].map(([val, label]) => (
              <div key={label}>
                <div className="font-serif" style={{ fontSize:26, fontWeight:500, color:"var(--accent)", lineHeight:1 }}>{val}</div>
                <div className="font-mono" style={{ fontSize:10, color:"var(--muted)", marginTop:4, textTransform:"uppercase", letterSpacing:"0.07em" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding:"72px 48px", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display:"flex", alignItems:"baseline", gap:14, marginBottom:40 }}>
          <span className="section-num">How it works</span>
          <h2 className="section-title font-serif">Three steps to your shoe</h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(240px, 1fr))", gap:16 }}>
          {HOW_IT_WORKS.map(({ icon:Icon, num, title, desc, color }) => (
            <div key={num} style={{ background:"var(--bg2)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, padding:24 }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
                <div style={{ width:38, height:38, borderRadius:10, background:`${color}15`, border:`1px solid ${color}25`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Icon size={17} color={color} />
                </div>
                <span className="font-mono" style={{ fontSize:11, color:`${color}80`, textTransform:"uppercase", letterSpacing:"0.1em" }}>{num}</span>
              </div>
              <h3 className="font-serif" style={{ fontSize:19, marginBottom:8 }}>{title}</h3>
              <p style={{ fontSize:13, color:"var(--muted)", lineHeight:1.65 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ padding:"72px 48px", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display:"flex", alignItems:"baseline", gap:14, marginBottom:10 }}>
          <span className="section-num">Browse by</span>
          <h2 className="section-title font-serif">Category</h2>
        </div>
        <p style={{ color:"var(--muted)", fontSize:14, marginBottom:28, maxWidth:480 }}>
          {SHOE_COUNT} shoes across {CATEGORIES.length} categories — all with the same depth of data.
        </p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(148px, 1fr))", gap:8 }}>
          {CATEGORIES.map(cat => <CategoryCard key={cat.label} {...cat} />)}
        </div>
      </section>

      {/* DATA NOTE */}
      <section style={{ padding:"40px 48px", borderBottom:"1px solid rgba(255,255,255,0.07)", background:"var(--bg2)" }}>
        <div style={{ display:"flex", gap:20, alignItems:"flex-start", maxWidth:700 }}>
          <span style={{ fontSize:28, flexShrink:0 }}>🔬</span>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
              <h3 className="font-serif" style={{ fontSize:20 }}>We don&apos;t have a lab — yet.</h3>
              <span className="pill-muted">Transparent</span>
            </div>
            <p style={{ color:"var(--muted)", lineHeight:1.7, fontSize:14 }}>
              Our data is sourced from published brand specs, independent lab tests, and verified expert reviews.
              We&apos;re working toward a partnership with{" "}
              <a href="https://runrepeat.com" target="_blank" rel="noreferrer" style={{ color:"var(--accent)", textDecoration:"underline" }}>RunRepeat</a>{" "}
              for direct lab measurements. Every data point is cited. We never accept payments from brands to influence scores.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:"72px 48px" }}>
        <div style={{ display:"flex", flexDirection:"column", gap:20, padding:"40px 44px", background:"linear-gradient(135deg, rgba(88,166,255,0.06) 0%, rgba(63,185,80,0.04) 100%)", border:"1px solid rgba(88,166,255,0.18)", borderRadius:16, maxWidth:700 }}>
          <span className="pill-accent" style={{ display:"inline-flex", width:"fit-content" }}>6 questions · 2 minutes</span>
          <h2 className="font-serif" style={{ fontSize:"clamp(28px, 4vw, 40px)", lineHeight:1.15 }}>Not sure where to start?</h2>
          <p style={{ color:"var(--muted)", lineHeight:1.7, fontSize:15 }}>
            Tell us how you use your shoes, your foot shape, and your budget — in plain everyday language.
            Our engine matches you to the right shoe using biomechanics data, not brand popularity.
          </p>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            <Link href="/finder" className="btn-primary">Start the quiz <ArrowRight size={16} /></Link>
            <Link href="/catalogue" className="btn-ghost">Browse manually</Link>
          </div>
        </div>
      </section>
    </>
  );
}