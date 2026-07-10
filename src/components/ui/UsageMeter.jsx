"use client";

const INTER = "'Inter', system-ui, sans-serif";

/**
 * UsageMeter — compact progress bar showing "2/3 sessions used"
 * 
 * Props:
 * - used: number (current usage count)
 * - limit: number (max allowed — Infinity for unlimited)
 * - label: string (e.g. "sessions", "evaluations")
 * - tier: string ("free" | "plus" | "pro")
 * - compact: boolean (smaller variant for headers)
 * - onUpgradeClick: function (optional click handler for upgrade prompt)
 */
export default function UsageMeter({
  used = 0,
  limit = 3,
  label = "sessions",
  tier = "free",
  compact = false,
  onUpgradeClick,
}) {
  const isUnlimited = limit === Infinity || tier === "pro";
  const ratio = isUnlimited ? 0 : Math.min(used / limit, 1);
  const atLimit = !isUnlimited && used >= limit;

  // Color transitions: green → amber → red
  let color = "#0D9488"; // teal
  if (!isUnlimited) {
    if (ratio >= 1) color = "#f87171";       // red at limit
    else if (ratio >= 0.66) color = "#fb923c"; // amber at 2/3
  }

  if (isUnlimited) {
    return (
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        fontSize: compact ? 11 : 12, color: "#0D9488",
        fontWeight: 600, fontFamily: INTER,
      }}>
        <span style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 16, height: 16, borderRadius: 4,
          background: "#0D948818", fontSize: 10,
        }}>∞</span>
        Unlimited {label}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: compact ? 8 : 10,
        fontFamily: INTER,
        cursor: atLimit && onUpgradeClick ? "pointer" : "default",
      }}
      onClick={atLimit && onUpgradeClick ? onUpgradeClick : undefined}
    >
      {/* Bar */}
      <div style={{
        width: compact ? 60 : 80, height: compact ? 4 : 5,
        background: "rgba(255,255,255,0.08)",
        borderRadius: 99, overflow: "hidden",
        flexShrink: 0,
      }}>
        <div style={{
          width: `${ratio * 100}%`,
          height: "100%",
          background: color,
          borderRadius: 99,
          transition: "width .5s cubic-bezier(.16,1,.3,1), background .3s",
        }} />
      </div>

      {/* Text */}
      <span style={{
        fontSize: compact ? 11 : 12,
        fontWeight: 600,
        color: atLimit ? color : "#A1A1AA",
        whiteSpace: "nowrap",
      }}>
        {used}/{limit} {label}
        {atLimit && (
          <span style={{ color: "#fb923c", marginLeft: 6, fontSize: compact ? 10 : 11 }}>
            Upgrade →
          </span>
        )}
      </span>
    </div>
  );
}
