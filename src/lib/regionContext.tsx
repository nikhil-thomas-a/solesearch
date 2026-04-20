"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface Region {
  code:       string;
  label:      string;
  currency:   string;
  symbol:     string;
  sizeSystem: "UK" | "US" | "EU";
  // Approximate exchange rates vs USD (updated manually, good enough for display)
  rateFromUSD: number;
}

export const REGIONS: Region[] = [
  { code: "UK", label: "🇬🇧 United Kingdom", currency: "GBP", symbol: "£",  sizeSystem: "UK", rateFromUSD: 0.79 },
  { code: "US", label: "🇺🇸 United States",  currency: "USD", symbol: "$",  sizeSystem: "US", rateFromUSD: 1.00 },
  { code: "EU", label: "🇪🇺 Europe",          currency: "EUR", symbol: "€",  sizeSystem: "EU", rateFromUSD: 0.92 },
  { code: "IN", label: "🇮🇳 India",           currency: "INR", symbol: "₹",  sizeSystem: "UK", rateFromUSD: 83.5 },
  { code: "AU", label: "🇦🇺 Australia",       currency: "AUD", symbol: "A$", sizeSystem: "US", rateFromUSD: 1.54 },
  { code: "CA", label: "🇨🇦 Canada",          currency: "CAD", symbol: "C$", sizeSystem: "US", rateFromUSD: 1.36 },
];

interface RegionContextValue {
  region:    Region;
  setRegion: (r: Region) => void;
  /** Convert a USD price to the current region's currency, formatted with symbol */
  fmt:       (usdPrice: number) => string;
  /** Convert USD to local currency number only */
  convert:   (usdPrice: number) => number;
}

const RegionContext = createContext<RegionContextValue>({
  region:    REGIONS[0],
  setRegion: () => {},
  fmt:       (p) => `£${Math.round(p * 0.79)}`,
  convert:   (p) => Math.round(p * 0.79),
});

export function RegionProvider({ children }: { children: ReactNode }) {
  const [region, setRegionState] = useState<Region>(REGIONS[0]); // Default UK

  // Persist to localStorage
  useEffect(() => {
    const saved = localStorage.getItem("solesearch_region");
    if (saved) {
      const found = REGIONS.find(r => r.code === saved);
      if (found) setRegionState(found);
    }
  }, []);

  const setRegion = (r: Region) => {
    setRegionState(r);
    localStorage.setItem("solesearch_region", r.code);
  };

  const convert = (usdPrice: number): number => {
    const raw = usdPrice * region.rateFromUSD;
    // Round to sensible local amounts
    if (region.currency === "INR") return Math.round(raw / 100) * 100;
    if (region.currency === "JPY") return Math.round(raw / 10) * 10;
    return Math.round(raw);
  };

  const fmt = (usdPrice: number): string => {
    const amount = convert(usdPrice);
    if (region.currency === "INR") return `₹${amount.toLocaleString("en-IN")}`;
    return `${region.symbol}${amount}`;
  };

  return (
    <RegionContext.Provider value={{ region, setRegion, fmt, convert }}>
      {children}
    </RegionContext.Provider>
  );
}

export function useRegion() {
  return useContext(RegionContext);
}
