import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a price as USD */
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents);
}

/** Return accent color class based on score value */
export function scoreColor(score: number): string {
  if (score >= 85) return "text-[#E8FF4A]";
  if (score >= 70) return "text-[#EF9F27]";
  return "text-[#FF6B35]";
}

/** Truncate text to maxLength with ellipsis */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trimEnd() + "…";
}

/** Convert a shoe name to a URL slug */
export function toSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Format a number with commas */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}

/** Map a value from one range to another (for bar heights etc) */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}

/** Get heel drop label */
export function heelDropLabel(mm: number): string {
  if (mm === 0)  return "Zero drop";
  if (mm <= 4)   return "Low drop";
  if (mm <= 8)   return "Moderate";
  return "High drop";
}

/** Get midsole softness label */
export function softnessLabel(hc: number): string {
  if (hc < 25) return "Very soft";
  if (hc < 33) return "Soft";
  if (hc < 42) return "Medium";
  return "Firm";
}
