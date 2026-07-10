"use client";
import { useState, useEffect } from "react";

const INTER = "'Inter', system-ui, sans-serif";

/**
 * CooldownTimer — countdown overlay on send button
 * 
 * Props:
 * - seconds: number (initial cooldown seconds)
 * - onComplete: function (called when cooldown ends)
 * - tier: string ("free" | "plus") 
 */
export default function CooldownTimer({ seconds = 45, onComplete, tier = "free" }) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (remaining <= 0) {
      onComplete?.();
      return;
    }
    const timer = setTimeout(() => setRemaining(r => r - 1), 1000);
    return () => clearTimeout(timer);
  }, [remaining, onComplete]);

  if (remaining <= 0) return null;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 16px",
        background: "rgba(251,146,60,0.08)",
        border: "1px solid rgba(251,146,60,0.2)",
        borderRadius: 10,
        fontFamily: INTER,
      }}
    >
      {/* Circular progress */}
      <div style={{ position: "relative", width: 22, height: 22 }}>
        <svg width="22" height="22" viewBox="0 0 22 22" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="11" cy="11" r="9" fill="none" stroke="rgba(251,146,60,0.15)" strokeWidth="2" />
          <circle
            cx="11" cy="11" r="9"
            fill="none" stroke="#fb923c" strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 9}`}
            strokeDashoffset={`${2 * Math.PI * 9 * (1 - remaining / seconds)}`}
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>
      </div>

      <span style={{ fontSize: 12, fontWeight: 600, color: "#fb923c" }}>
        Wait {remaining}s
      </span>
      <span style={{ fontSize: 11, color: "#666" }}>
        · <span style={{ color: "#818cf8", cursor: "pointer" }}>Remove with upgrade →</span>
      </span>
    </div>
  );
}
