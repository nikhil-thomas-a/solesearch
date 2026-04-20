import Link from "next/link";
import { Heart } from "lucide-react";
import { formatPrice, scoreColor } from "@/lib/utils";
import type { Shoe } from "@/types";

interface ShoeCardProps {
  shoe: Shoe;
}

export function ShoeCard({ shoe }: ShoeCardProps) {
  return (
    <Link href={`/shoes/${shoe.slug}`} style={{ display: "block", textDecoration: "none" }} className="card-hover">
      {/* Image area */}
      <div style={{ position: "relative", aspectRatio: "4/3", display: "flex", alignItems: "center", justifyContent: "center", background: "#141414" }}>
        <div style={{ width: 80, height: 40, borderRadius: 99, background: "#E8FF4A", opacity: 0.08 }} />

        {/* Category pill */}
        <span className="pill-accent" style={{ position: "absolute", top: 10, left: 10, fontSize: 9 }}>
          {shoe.subcategory}
        </span>

        {/* Wishlist */}
        <button
          onClick={(e) => e.preventDefault()}
          style={{ position: "absolute", top: 10, right: 10, background: "rgba(10,10,10,0.7)", border: "none", cursor: "pointer", color: "#888580", padding: 6, borderRadius: 3 }}
        >
          <Heart size={12} />
        </button>

        {/* Score badge */}
        <div style={{ position: "absolute", bottom: 10, right: 10, width: 42, height: 42, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(10,10,10,0.85)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 3 }}>
          <span className="font-mono" style={{ fontSize: 14, fontWeight: 600, lineHeight: 1, color: "#E8FF4A" }}>
            {shoe.scores.coreScore}
          </span>
          <span className="font-mono" style={{ fontSize: 8, color: "#888580", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Score
          </span>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 8 }}>
        <div>
          <p className="font-mono" style={{ fontSize: 10, color: "#888580", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>
            {shoe.brand}
          </p>
          <h3 className="font-serif" style={{ fontSize: 18, color: "#F0EEE8", lineHeight: 1.2 }}>
            {shoe.name}
          </h3>
        </div>

        <div className="font-mono" style={{ display: "flex", gap: 10, fontSize: 10, color: "#888580" }}>
          <span>{shoe.labData.weightG}g</span>
          <span style={{ color: "rgba(255,255,255,0.1)" }}>·</span>
          <span>{shoe.labData.heelDropMm}mm drop</span>
          <span style={{ color: "rgba(255,255,255,0.1)" }}>·</span>
          <span>{shoe.labData.heelStackMm}mm stack</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <span style={{ fontWeight: 600, color: "#F0EEE8" }}>{formatPrice(shoe.currentLow)}</span>
          {shoe.currentLow < shoe.msrp && (
            <span className="font-mono" style={{ fontSize: 10, color: "#888580", textDecoration: "line-through" }}>
              {formatPrice(shoe.msrp)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
