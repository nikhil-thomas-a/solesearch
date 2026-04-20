"use client";

import Link from "next/link";

interface CategoryCardProps {
  emoji: string;
  label: string;
  href: string;
  count: number;
}

export function CategoryCard({ emoji, label, href, count }: CategoryCardProps) {
  return (
    <Link
      href={href}
      style={{
        display: "flex", flexDirection: "column", gap: 8,
        padding: "16px 14px", background: "var(--bg2)",
        border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10,
        textDecoration: "none", transition: "all 0.2s",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "rgba(88,166,255,0.4)";
        el.style.transform = "translateY(-2px)";
        el.style.background = "var(--bg3)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "rgba(255,255,255,0.07)";
        el.style.transform = "none";
        el.style.background = "var(--bg2)";
      }}
    >
      <span style={{ fontSize: 22 }}>{emoji}</span>
      <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", lineHeight: 1.3 }}>{label}</span>
      <span className="font-mono" style={{ fontSize: 9, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em" }}>{count} shoes</span>
    </Link>
  );
}
