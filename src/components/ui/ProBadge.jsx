"use client";

const INTER = "'Inter', system-ui, sans-serif";

const TIER_STYLES = {
  free: { label: "FREE", color: "#A1A1AA", bg: "rgba(161,161,170,0.12)", border: "rgba(161,161,170,0.2)" },
  plus: { label: "PLUS", color: "#818cf8", bg: "rgba(129,140,248,0.12)", border: "rgba(129,140,248,0.25)" },
  pro: { label: "PRO", color: "#0D9488", bg: "rgba(13,148,136,0.12)", border: "rgba(13,148,136,0.25)" },
  founding: { label: "FOUNDING", color: "#fbbf24", bg: "rgba(251,191,36,0.12)", border: "rgba(251,191,36,0.25)" },
};

/**
 * ProBadge — tiny pill badge for tier display
 * 
 * Props:
 * - tier: "free" | "plus" | "pro" | "founding"
 * - size: "sm" | "md" (default "sm")
 * - style: object (optional overrides)
 */
export default function ProBadge({ tier = "pro", size = "sm", style = {} }) {
  const s = TIER_STYLES[tier] || TIER_STYLES.pro;
  const isSm = size === "sm";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: isSm ? 9 : 11,
        fontWeight: 800,
        letterSpacing: "0.08em",
        color: s.color,
        background: s.bg,
        border: `1px solid ${s.border}`,
        borderRadius: isSm ? 4 : 6,
        padding: isSm ? "2px 6px" : "3px 10px",
        fontFamily: INTER,
        lineHeight: 1,
        textTransform: "uppercase",
        userSelect: "none",
        ...style,
      }}
    >
      {tier === "founding" && <span style={{ fontSize: isSm ? 8 : 10 }}>⭐</span>}
      {s.label}
    </span>
  );
}
