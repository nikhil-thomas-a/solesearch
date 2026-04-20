import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CATEGORIES = [
  { label: "Road running",   href: "/catalogue?category=road-running",    count: 214 },
  { label: "Trail running",  href: "/catalogue?category=trail-running",    count: 98  },
  { label: "Basketball",     href: "/catalogue?category=basketball",        count: 76  },
  { label: "Sneakers",       href: "/catalogue?category=sneakers",          count: 310 },
  { label: "Hiking",         href: "/catalogue?category=hiking",            count: 120 },
  { label: "Gym + training", href: "/catalogue?category=gym-training",      count: 88  },
  { label: "Walking",        href: "/catalogue?category=walking",           count: 145 },
  { label: "Wide fit",       href: "/catalogue?category=wide-orthopaedic",  count: 62  },
];

export default function HomePage() {
  return (
    <>
      <section
        className="relative flex flex-col items-start justify-end min-h-[88vh] px-8 md:px-14 pb-16"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
        <p className="font-mono text-xs text-[#888580] tracking-widest uppercase mb-6">The shoe database, rebuilt from scratch</p>
        <h1 className="font-serif leading-[0.95] mb-8" style={{ fontSize: "clamp(56px, 9vw, 124px)" }}>
          Find the shoe<br /><span style={{ color: "#E8FF4A", fontStyle: "italic" }}>your feet</span><br />actually need.
        </h1>
        <p className="font-serif text-xl text-[#888580] max-w-xl mb-10" style={{ fontStyle: "italic" }}>
          Lab data, biomechanics-aware fit matching, and price tracking — for every shoe from racing flats to work boots.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link href="/finder" className="btn-primary flex items-center gap-2">Find my perfect shoe <ArrowRight size={14} /></Link>
          <Link href="/catalogue" className="btn-ghost">Browse catalogue</Link>
        </div>
        <div className="absolute bottom-0 right-0 hidden md:flex" style={{ borderTop: "1px solid rgba(255,255,255,0.08)", borderLeft: "1px solid rgba(255,255,255,0.08)" }}>
          {[["1,200+","Shoes reviewed"],["47","Lab metrics per shoe"],["200+","Retailers tracked"]].map(([val,label]) => (
            <div key={label} className="flex flex-col items-center px-8 py-5" style={{ borderLeft: "1px solid rgba(255,255,255,0.08)" }}>
              <span className="font-semibold text-2xl tracking-tight" style={{ color: "#E8FF4A" }}>{val}</span>
              <span className="font-mono text-[10px] text-[#888580] uppercase tracking-widest mt-1">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="px-8 md:px-14 py-16" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-baseline gap-4 mb-10">
          <span className="font-mono text-xs text-[rgba(232,255,74,0.4)]">Browse by</span>
          <h2 className="font-serif text-3xl">Category</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CATEGORIES.map((cat) => (
            <Link key={cat.label} href={cat.href} className="card-hover flex flex-col gap-4 p-5 group">
              <span className="font-serif text-lg group-hover:text-[#E8FF4A] transition-colors duration-150">{cat.label}</span>
              <span className="font-mono text-xs text-[#888580]">{cat.count} shoes</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-8 md:px-14 py-20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 p-10 rounded-md" style={{ background: "rgba(232,255,74,0.04)", border: "1px solid rgba(232,255,74,0.15)" }}>
          <div className="max-w-xl">
            <p className="font-mono text-xs text-[#E8FF4A] tracking-widest uppercase mb-3">AI-powered fit engine</p>
            <h2 className="font-serif text-4xl mb-3">Not sure where to start?</h2>
            <p className="text-[#888580] leading-relaxed">Answer 8 questions about your foot shape, gait, and how you use your shoes. Our engine matches you to the right shoe using biomechanics data — not just brand popularity.</p>
          </div>
          <Link href="/finder" className="btn-primary whitespace-nowrap flex items-center gap-2">Start fit quiz <ArrowRight size={14} /></Link>
        </div>
      </section>
    </>
  );
}
