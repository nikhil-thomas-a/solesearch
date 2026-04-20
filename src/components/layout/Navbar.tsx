"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Search, Heart, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

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
      <nav
        style={{
          position: "sticky", top: 0, zIndex: 50,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 40px", height: "56px",
          background: "rgba(10,10,10,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Link href="/" className="font-mono" style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", color: "#E8FF4A", textDecoration: "none" }}>
          SoleSearch
        </Link>

        <ul style={{ display: "flex", alignItems: "center", gap: 28, listStyle: "none", margin: 0, padding: 0 }} className="hidden md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="font-mono"
                style={{
                  fontSize: 12,
                  letterSpacing: "0.04em",
                  textDecoration: "none",
                  color: pathname.startsWith(link.href) ? "#F0EEE8" : "#888580",
                  transition: "color 0.15s",
                }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button className="btn-ghost hidden md:flex" style={{ gap: 6, fontSize: 12, padding: "6px 12px" }}>
            <Search size={13} /> Search
          </button>
          <button className="btn-ghost hidden md:flex" style={{ gap: 6, fontSize: 12, padding: "6px 12px" }}>
            <Heart size={13} /> Wishlist
          </button>
          <button className="btn-ghost hidden md:flex" style={{ fontSize: 12, padding: "6px 12px" }}>Sign in</button>
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#888580" }}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 40, paddingTop: 56, background: "rgba(10,10,10,0.98)", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", flexDirection: "column", padding: "24px", gap: 24 }}>
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="font-serif" style={{ fontSize: 28, color: "#F0EEE8", textDecoration: "none" }}>
                {link.label}
              </Link>
            ))}
            <div className="divider" />
            <button className="btn-ghost" style={{ width: "100%" }}>Sign in</button>
          </div>
        </div>
      )}
    </>
  );
}
