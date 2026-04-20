type PillVariant = "accent" | "muted" | "orange" | "green";

const variantClass: Record<PillVariant, string> = {
  accent: "pill-accent",
  muted:  "pill-muted",
  orange: "pill-orange",
  green:  "pill-accent",
};

export function Pill({ children, variant = "muted" }: { children: React.ReactNode; variant?: PillVariant }) {
  return <span className={variantClass[variant]}>{children}</span>;
}
