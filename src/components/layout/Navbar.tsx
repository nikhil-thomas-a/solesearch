"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Search, Heart, Menu, X, Globe, ChevronDown } from "lucide-react";
import { useRegion, REGIONS } from "@/lib/regionContext";

const NAV_LINKS = [
  { href: "/catalogue", label: "Catalogue" },
  { href: "/finder",    label: "Find my shoe" },
  { href: "/compare",   label: "Compare" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [regionOpen, setRegionOpen] = useState(false);
  const { region, setRegion } = useRegion();

  return (
    <>
      <nav style={{ position:"sticky", top:0, zIndex:50, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 32px", height:"60px", background:"rgba(13,17,23,0.95)", backdropFilter:"blur(12px)", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
        <Link href="/" style={{ fontFamily:"'Fraunces',serif", fontSize:18, fontWeight:500, color:"#E6EDF3", textDecoration:"none", flexShrink:0 }}>SoleSearch</Link>

        <ul style={{ display:"flex", alignItems:"center", gap:2, listStyle:"none", margin:0, padding:0 }}>
          {NAV_LINKS.map(l => {
            const active = pathname.startsWith(l.href);
            return <li key={l.href}><Link href={l.href} style={{ fontFamily:"'DM Sans',sans-serif", fontSize:14, textDecoration:"none", padding:"6px 14px", borderRadius:8, display:"inline-block", color:active?"#E6EDF3":"#8B949E", background:active?"rgba(255,255,255,0.06)":"transparent", transition:"all 0.15s" }}>{l.label}</Link></li>;
          })}
        </ul>

        <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
          <div style={{ position:"relative" }}>
            <button onClick={() => setRegionOpen(p => !p)} style={{ display:"flex", alignItems:"center", gap:5, padding:"7px 11px", borderRadius:8, cursor:"pointer", background:regionOpen?"rgba(255,255,255,0.06)":"transparent", border:"1px solid rgba(255,255,255,0.1)", color:"#8B949E", fontSize:12, fontFamily:"'DM Mono',monospace", transition:"all 0.15s", whiteSpace:"nowrap" }}>
              <Globe size={12} />{region.code}<span style={{opacity:0.5}}>·</span>{region.symbol}<ChevronDown size={10} style={{ opacity:0.5, transform:regionOpen?"rotate(180deg)":"none", transition:"transform 0.15s" }} />
            </button>
            {regionOpen && (
              <>
                <div onClick={() => setRegionOpen(false)} style={{ position:"fixed", inset:0, zIndex:49 }} />
                <div style={{ position:"absolute", top:"calc(100% + 8px)", right:0, background:"#161B22", border:"1px solid rgba(255,255,255,0.12)", borderRadius:10, overflow:"hidden", minWidth:220, zIndex:60, boxShadow:"0 8px 32px rgba(0,0,0,0.5)" }}>
                  <div style={{ padding:"8px 14px 6px", fontFamily:"'DM Mono',monospace", fontSize:10, color:"#8B949E", textTransform:"uppercase", letterSpacing:"0.08em" }}>Region &amp; currency</div>
                  {REGIONS.map(r => (
                    <button key={r.code} onClick={() => { setRegion(r); setRegionOpen(false); }} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", width:"100%", padding:"10px 14px", border:"none", cursor:"pointer", color:r.code===region.code?"#58A6FF":"#8B949E", background:r.code===region.code?"rgba(88,166,255,0.08)":"transparent", fontSize:13, fontFamily:"'DM Sans',sans-serif" }}>
                      <span>{r.label}</span>
                      <span style={{ fontFamily:"'DM Mono',monospace", fontSize:11, opacity:0.7 }}>{r.symbol} · {r.sizeSystem}</span>
                    </button>
                  ))}
                  <div style={{ padding:"8px 14px", borderTop:"1px solid rgba(255,255,255,0.06)", fontSize:11, color:"#8B949E", fontFamily:"'DM Mono',monospace" }}>All prices in USD · converted at display</div>
                </div>
              </>
            )}
          </div>
          <button className="btn-ghost" style={{ padding:"7px 12px", fontSize:13, gap:5, display:"flex", alignItems:"center" }}><Search size={14} /> Search</button>
          <button className="btn-ghost" style={{ padding:"7px 12px", fontSize:13, gap:5, display:"flex", alignItems:"center" }}><Heart size={14} /> Wishlist</button>
          <button className="btn-primary" style={{ padding:"7px 16px", fontSize:13 }}>Sign in</button>
          <button onClick={() => setMobileOpen(p => !p)} style={{ background:"none", border:"none", cursor:"pointer", color:"#8B949E", padding:4 }} className="mobile-menu-btn">{mobileOpen ? <X size={18} /> : <Menu size={18} />}</button>
        </div>
      </nav>
      {mobileOpen && (
        <div style={{ position:"fixed", inset:0, zIndex:40, paddingTop:60, background:"rgba(13,17,23,0.98)", display:"flex", flexDirection:"column" }}>
          <div style={{ padding:24, display:"flex", flexDirection:"column", gap:20 }}>
            {NAV_LINKS.map(l => <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} style={{ fontFamily:"'Fraunces',serif", fontSize:28, color:"#E6EDF3", textDecoration:"none" }}>{l.label}</Link>)}
            <div className="divider" />
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {REGIONS.map(r => <button key={r.code} onClick={() => { setRegion(r); setMobileOpen(false); }} style={{ padding:"8px 14px", borderRadius:8, cursor:"pointer", border:`1px solid ${r.code===region.code?"rgba(88,166,255,0.5)":"rgba(255,255,255,0.1)"}`, background:r.code===region.code?"rgba(88,166,255,0.1)":"transparent", color:r.code===region.code?"#58A6FF":"#8B949E", fontFamily:"'DM Mono',monospace", fontSize:12 }}>{r.code} · {r.symbol}</button>)}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
