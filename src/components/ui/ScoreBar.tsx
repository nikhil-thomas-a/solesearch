interface ScoreBarProps {
  label: string;
  value: number;
  max?: number;
  showValue?: boolean;
  color?: string;
}

export function ScoreBar({ label, value, max = 100, showValue = true, color = "#E8FF4A" }: ScoreBarProps) {
  const pct = Math.round((value / max) * 100);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontSize: 12, color: "#888580" }}>{label}</span>
        {showValue && <span className="font-mono" style={{ fontSize: 12, color: "#F0EEE8" }}>{value}</span>}
      </div>
      <div className="score-bar">
        <div className="score-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}
