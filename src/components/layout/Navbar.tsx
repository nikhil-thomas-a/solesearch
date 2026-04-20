"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Search, Heart, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/catalogue", label: "Catalogue" },
  { href: "/finder",    label: "Find my shoe" },
  { href: "/compare",   label: "Compare" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 40px", height: "60px",
        background: "rgba(247,245,240,0.92)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
      }}>
        <Link href="/" style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 400, color: "#1A1814", textDecoration: "none", letterSpacing: "-0.01em" }}>
          SoleSearch
        </Link>

        <ul style={{ display: "flex", alignItems: "center", gap: 6, listStyle: "none", margin: 0, padding: 0 }}>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 14, textDecoration: "none",
                padding: "6px 14px", borderRadius: 8,
                color: pathname.startsWith(link.href) ? "#1A1814" : "#7A7469",
                background: pathname.startsWith(link.href) ? "rgba(0,0,0,0.06)" : "transparent",
                transition: "all 0.15s", display: "inline-block",
              }}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button className="btn-ghost" style={{ padding: "8px 14px", fontSize: 13, gap: 6 }}>
            <Search size={14} /> Search
          </button>
          <button className="btn-ghost" style={{ padding: "8px 14px", fontSize: 13, gap: 6 }}>
            <Heart size={14} /> Wishlist
          </button>
          <button className="btn-primary" style={{ padding: "8px 16px", fontSize: 13 }}>Sign in</button>
          <button onClick={() => setMobileOpen(!mobileOpen)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: "#7A7469" }} className="mobile-menu-btn">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 40, paddingTop: 60, background: "rgba(247,245,240,0.98)", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", flexDirection: "column", padding: 24, gap: 20 }}>
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                style={{ fontFamily: "'Fraunces', serif", fontSize: 32, color: "#1A1814", textDecoration: "none" }}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
