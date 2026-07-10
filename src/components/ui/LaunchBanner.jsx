"use client";
import { useState } from "react";
import Icon from "@/components/ui/Icon";

const INTER = "'Inter', system-ui, sans-serif";

/**
 * LaunchBanner — dismissible banner for beta/launch phase
 * Shows at the top of the dashboard during launch to communicate relaxed limits + founding member urgency.
 * 
 * Props:
 * - spotsRemaining: number (e.g. 358 of 500)
 * - onUpgradeClick: function
 */
export default function LaunchBanner({ spotsRemaining = 500, onUpgradeClick }) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      style={{
        background: "linear-gradient(135deg, rgba(13,148,136,0.08), rgba(129,140,248,0.06))",
        border: "1px solid rgba(13,148,136,0.2)",
        borderRadius: 14,
        padding: "14px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        marginBottom: 22,
        fontFamily: INTER,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle shimmer */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "linear-gradient(105deg, transparent 40%, rgba(13,148,136,0.06) 50%, transparent 60%)",
        backgroundSize: "200% 100%",
        animation: "bannerShimmer 4s ease infinite",
      }} />
      <style>{`
        @keyframes bannerShimmer {
          0%, 100% { background-position: -200% center; }
          50% { background-position: 200% center; }
        }
      `}</style>

      <div style={{ display: "flex", alignItems: "center", gap: 12, position: "relative", zIndex: 1 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: "rgba(13,148,136,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 16 }}>🎉</span>
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#FAFAFA", marginBottom: 2 }}>
            Beta Access — You're getting 3× free limits!
          </div>
          <div style={{ fontSize: 12, color: "#A1A1AA" }}>
            These will reduce soon. Lock in{" "}
            <span
              onClick={onUpgradeClick}
              style={{ color: "#0D9488", fontWeight: 700, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 2 }}
            >
              lifetime pricing
            </span>
            {" "}while {spotsRemaining} founding spots remain.
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative", zIndex: 1, flexShrink: 0 }}>
        {/* Spots counter */}
        <div style={{
          background: "rgba(251,191,36,0.1)",
          border: "1px solid rgba(251,191,36,0.2)",
          borderRadius: 8, padding: "5px 12px",
          fontSize: 11, fontWeight: 700, color: "#fbbf24",
          whiteSpace: "nowrap",
        }}>
          {spotsRemaining}/500 spots left
        </div>

        {/* Dismiss */}
        <button
          onClick={() => setDismissed(true)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: "#666", display: "flex", padding: 4,
            transition: "color .15s",
          }}
          onMouseEnter={e => e.currentTarget.style.color = "#aaa"}
          onMouseLeave={e => e.currentTarget.style.color = "#666"}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
