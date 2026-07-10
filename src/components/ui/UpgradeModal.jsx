"use client";
import { useState } from "react";
import Icon from "@/components/ui/Icon";
import { TIERS, PRICING } from "@/lib/tierConfig";

const INTER = "'Inter', system-ui, sans-serif";

// ─── Feature-specific messaging ──────────────────────────────────────────────
const FEATURE_MESSAGES = {
  solver: {
    title: "You've hit your daily Solver limit",
    description: "Your AI tutor is ready — you just need more sessions.",
    emoji: "🧠",
  },
  feynman: {
    title: "Feynman evaluations used up",
    description: "Keep testing your understanding — upgrade for unlimited concept checks.",
    emoji: "📝",
  },
  mistakes: {
    title: "Mistake Journal is full",
    description: "Never lose a learning moment — upgrade for unlimited entries.",
    emoji: "📒",
  },
  imageUpload: {
    title: "Image uploads are a Pro feature",
    description: "Upload photos of your textbook problems directly.",
    emoji: "📷",
  },
  turnLimit: {
    title: "Conversation limit reached",
    description: "Upgrade for unlimited back-and-forth with your AI tutor.",
    emoji: "💬",
  },
  focusAi: {
    title: "AI Quiz on cooldown",
    description: "Upgrade for unlimited AI-generated quizzes and flashcards.",
    emoji: "⚡",
  },
  default: {
    title: "Unlock the full EurekaAI",
    description: "Everything you need to crack JEE/NEET — for less than a single coaching class.",
    emoji: "🚀",
  },
};

// ─── Competitor comparison data ───────────────────────────────────────────────
const COMPETITORS = [
  { name: "Unacademy Plus", price: 499 },
  { name: "PW Batch",       price: 350 },
  { name: "BYJU's Premium", price: 600 },
];
const EUREKA_PRO_MONTHLY = PRICING.pro.monthly; // ₹149

// ─── Feature lists ────────────────────────────────────────────────────────────
const PRO_FEATURES = [
  "Unlimited Socratic solver sessions",
  "Unlimited Feynman concept checks",
  "Unlimited AI turns per session",
  "Unlimited mistake journal entries",
  "AI-generated quizzes from your notes",
  "Full session history & analytics",
  "Image & PDF problem uploads",
  "Priority AI — faster responses",
];

const PLUS_FEATURES = [
  "5 solver sessions / day",
  "5 Feynman evaluations / day",
  "15 AI turns per session",
  "50 mistake entries",
  "Image uploads",
];

const PLUS_MISSING = [
  "Full analytics & weak areas",
  "Unlimited history",
  "Priority AI",
];

// ─── SVG helpers ──────────────────────────────────────────────────────────────
function Check({ color = "#0D9488" }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function X({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function UpgradeModal({ feature = "default", onClose, waitMinutes = 0 }) {
  const [annual, setAnnual] = useState(true);

  const msg      = FEATURE_MESSAGES[feature] || FEATURE_MESSAGES.default;
  const plusPrice = annual ? Math.round(PRICING.plus.annual / 12) : PRICING.plus.monthly;
  const proPrice  = annual ? Math.round(PRICING.pro.annual  / 12) : PRICING.pro.monthly;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.82)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px 16px",
        animation: "umFade .2s ease",
      }}
    >
      <style>{`
        @keyframes umFade  { from { opacity:0 } to { opacity:1 } }
        @keyframes umSlide { from { opacity:0; transform:translateY(28px) scale(.97) } to { opacity:1; transform:none } }
        .um-close:hover   { background:rgba(255,255,255,.12)!important }
        .um-plus-btn:hover { background:rgba(255,255,255,.09)!important }
        .um-pro-btn:hover  { transform:translateY(-2px)!important; box-shadow:0 10px 30px rgba(13,148,136,.55)!important }
        .um-comp-row:hover { background:rgba(255,255,255,.04)!important }
        @media(max-width:620px){
          .um-grid2{ grid-template-columns:1fr!important }
          .um-comptable{ display:none!important }
          .um-modal{ padding:24px 18px 20px!important }
        }
      `}</style>

      <div
        className="um-modal"
        onClick={e => e.stopPropagation()}
        style={{
          background: "#0E0E0E",
          border: "1px solid rgba(255,255,255,0.09)",
          borderRadius: 24,
          padding: "36px 32px 28px",
          maxWidth: 760, width: "100%",
          maxHeight: "92vh", overflowY: "auto",
          position: "relative",
          boxShadow: "0 32px 100px rgba(0,0,0,.72), 0 0 0 1px rgba(255,255,255,.04)",
          animation: "umSlide .35s cubic-bezier(.22,1,.36,1)",
          fontFamily: INTER,
        }}
      >
        {/* Close */}
        <button
          className="um-close"
          onClick={onClose}
          style={{
            position: "absolute", top: 16, right: 16,
            background: "rgba(255,255,255,.06)", border: "none",
            borderRadius: 8, width: 32, height: 32,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "#888", transition: "background .15s",
          }}
        >
          <X size={12} />
        </button>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <div style={{ fontSize: 38, marginBottom: 12, filter: "drop-shadow(0 2px 14px rgba(13,148,136,.45))" }}>
            {msg.emoji}
          </div>
          <h2 style={{
            fontSize: 22, fontWeight: 900, color: "#FAFAFA",
            margin: "0 0 8px", letterSpacing: "-0.03em", lineHeight: 1.2,
          }}>
            {msg.title}
          </h2>
          <p style={{ fontSize: 14, color: "#888", margin: "0 auto", lineHeight: 1.6, maxWidth: 400 }}>
            {msg.description}
          </p>
          {waitMinutes > 0 && (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              marginTop: 10, background: "rgba(251,146,60,.1)",
              border: "1px solid rgba(251,146,60,.25)", borderRadius: 8,
              padding: "5px 12px", fontSize: 13, color: "#fb923c", fontWeight: 600,
            }}>
              ⏱ Next available in {waitMinutes} min
            </div>
          )}
        </div>

        {/* "Cheaper than coaching" banner */}
        <div style={{
          display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap",
          background: "linear-gradient(135deg, rgba(13,148,136,.14), rgba(13,148,136,.04))",
          border: "1px solid rgba(13,148,136,.28)",
          borderRadius: 14, padding: "14px 20px", marginBottom: 22,
        }}>
          <div style={{ fontSize: 22 }}>💡</div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: "#FAFAFA", marginBottom: 3 }}>
              EurekaAI Pro is{" "}
              <span style={{ color: "#0D9488" }}>₹{EUREKA_PRO_MONTHLY}/mo</span>
              {" "}— less than a single coaching class.
            </div>
            <div style={{ fontSize: 12, color: "#777", lineHeight: 1.5 }}>
              BYJU&apos;s &amp; Unacademy charge ₹350–₹600/mo for less. You get
              unlimited AI tutoring at a fraction of the cost.
            </div>
          </div>
          <div style={{
            fontSize: 13, fontWeight: 800, color: "#4ade80", whiteSpace: "nowrap",
            background: "rgba(74,222,128,.1)", border: "1px solid rgba(74,222,128,.22)",
            borderRadius: 8, padding: "5px 12px",
          }}>
            74% cheaper
          </div>
        </div>

        {/* Billing toggle */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
          <div style={{ display: "flex", background: "rgba(255,255,255,.06)", borderRadius: 10, padding: 3, gap: 2 }}>
            {[["Monthly", false], ["Annual", true]].map(([label, isAnn]) => (
              <button
                key={label}
                onClick={() => setAnnual(isAnn)}
                style={{
                  padding: "7px 18px", borderRadius: 8, border: "none",
                  fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: INTER,
                  background: annual === isAnn ? "rgba(255,255,255,.12)" : "transparent",
                  color: annual === isAnn ? "#FAFAFA" : "#666",
                  transition: "all .15s",
                }}
              >
                {label} {isAnn && <span style={{ color: "#4ade80", fontSize: 11, marginLeft: 4 }}>Save 44%</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Plan cards */}
        <div className="um-grid2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 22 }}>

          {/* Plus */}
          <div style={{
            background: "rgba(255,255,255,.04)",
            border: "1px solid rgba(255,255,255,.08)",
            borderRadius: 18, padding: "22px 20px",
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#818cf8", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
              Plus
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 2 }}>
              <span style={{ fontSize: 34, fontWeight: 900, color: "#FAFAFA" }}>₹{plusPrice}</span>
              <span style={{ fontSize: 13, color: "#555" }}>/mo</span>
            </div>
            {annual && (
              <div style={{ fontSize: 12, color: "#818cf8", marginBottom: 12 }}>₹{PRICING.plus.annual}/year</div>
            )}
            <div style={{ height: 1, background: "rgba(255,255,255,.06)", margin: "14px 0" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {PLUS_FEATURES.map(f => (
                <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "#aaa" }}>
                  <span style={{ color: "#818cf8", marginTop: 1, flexShrink: 0 }}><Check color="#818cf8" /></span> {f}
                </div>
              ))}
              {PLUS_MISSING.map(f => (
                <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "#3a3a3a" }}>
                  <span style={{ color: "#333", marginTop: 1, flexShrink: 0 }}><X size={13} /></span> {f}
                </div>
              ))}
            </div>
            <button
              className="um-plus-btn"
              style={{
                marginTop: 18, width: "100%", padding: "11px 0", borderRadius: 10,
                border: "1px solid rgba(255,255,255,.12)", background: "transparent",
                color: "#FAFAFA", fontWeight: 700, fontSize: 13, cursor: "pointer",
                fontFamily: INTER, transition: "background .15s",
              }}
            >
              Get Plus
            </button>
          </div>

          {/* Pro */}
          <div style={{
            background: "linear-gradient(160deg, rgba(13,148,136,.16), rgba(13,148,136,.04))",
            border: "1px solid rgba(13,148,136,.38)",
            borderRadius: 18, padding: "22px 20px",
            position: "relative",
            boxShadow: "0 0 28px rgba(13,148,136,.12)",
          }}>
            <div style={{
              position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)",
              background: "linear-gradient(135deg, #0D9488, #0F766E)",
              color: "#fff", fontSize: 10, fontWeight: 800, padding: "3px 14px",
              borderRadius: "0 0 8px 8px", letterSpacing: "0.08em", textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}>
              Most Popular ⭐
            </div>

            <div style={{ fontSize: 11, fontWeight: 700, color: "#0D9488", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
              Pro
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 2 }}>
              <span style={{ fontSize: 34, fontWeight: 900, color: "#FAFAFA" }}>₹{proPrice}</span>
              <span style={{ fontSize: 13, color: "#555" }}>/mo</span>
            </div>
            {annual && (
              <div style={{ fontSize: 12, color: "#0D9488", marginBottom: 4 }}>₹{PRICING.pro.annual}/year</div>
            )}
            <div style={{
              display: "inline-flex", alignItems: "center",
              fontSize: 11, color: "#4ade80", fontWeight: 700,
              background: "rgba(74,222,128,.1)", border: "1px solid rgba(74,222,128,.2)",
              borderRadius: 6, padding: "2px 9px", marginBottom: 6,
            }}>
              Only ₹{proPrice - plusPrice}/mo more than Plus
            </div>
            <div style={{ height: 1, background: "rgba(255,255,255,.06)", margin: "14px 0" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {PRO_FEATURES.map(f => (
                <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "#ccc" }}>
                  <span style={{ color: "#0D9488", marginTop: 1, flexShrink: 0 }}><Check /></span> {f}
                </div>
              ))}
            </div>
            <button
              className="um-pro-btn"
              style={{
                marginTop: 18, width: "100%", padding: "13px 0", borderRadius: 10,
                border: "none",
                background: "linear-gradient(135deg, #0D9488, #0F766E)",
                color: "#fff", fontWeight: 800, fontSize: 14, cursor: "pointer",
                fontFamily: INTER,
                boxShadow: "0 4px 20px rgba(13,148,136,.42)",
                transition: "transform .2s, box-shadow .2s",
              }}
            >
              Get Pro →
            </button>
          </div>
        </div>

        {/* Competitor comparison table */}
        <div className="um-comptable" style={{ marginBottom: 20 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, color: "#444",
            letterSpacing: "0.08em", textTransform: "uppercase",
            textAlign: "center", marginBottom: 10,
          }}>
            vs. what you&apos;re currently paying elsewhere
          </div>
          <div style={{ border: "1px solid rgba(255,255,255,.07)", borderRadius: 12, overflow: "hidden" }}>
            {/* Header */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 80px 100px 80px",
              background: "rgba(255,255,255,.04)", padding: "8px 18px",
              fontSize: 11, fontWeight: 700, color: "#555", letterSpacing: "0.05em",
              textTransform: "uppercase", gap: 8,
            }}>
              <span>Platform</span>
              <span style={{ textAlign: "right" }}>Price</span>
              <span style={{ textAlign: "center" }}>AI Tutor</span>
              <span style={{ textAlign: "right" }}>Adaptive</span>
            </div>

            {COMPETITORS.map(c => (
              <div
                key={c.name}
                className="um-comp-row"
                style={{
                  display: "grid", gridTemplateColumns: "1fr 80px 100px 80px",
                  padding: "10px 18px", gap: 8,
                  borderTop: "1px solid rgba(255,255,255,.05)",
                  transition: "background .15s",
                }}
              >
                <span style={{ fontSize: 13, color: "#666" }}>{c.name}</span>
                <span style={{ fontSize: 13, color: "#777", textAlign: "right", fontWeight: 600 }}>
                  ₹{c.price}/mo
                </span>
                <span style={{ fontSize: 12, color: "#f87171", textAlign: "center" }}>Partial</span>
                <span style={{ fontSize: 13, color: "#f87171", textAlign: "right" }}>❌</span>
              </div>
            ))}

            {/* EurekaAI Pro row */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 80px 100px 80px",
              padding: "12px 18px", gap: 8,
              borderTop: "1px solid rgba(13,148,136,.3)",
              background: "linear-gradient(90deg, rgba(13,148,136,.14), rgba(13,148,136,.04))",
            }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: "#0D9488" }}>EurekaAI Pro ✦</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: "#0D9488", textAlign: "right" }}>
                ₹{EUREKA_PRO_MONTHLY}/mo
              </span>
              <span style={{ fontSize: 12, color: "#4ade80", textAlign: "center", fontWeight: 700 }}>Unlimited ✅</span>
              <span style={{ fontSize: 13, color: "#4ade80", textAlign: "right", fontWeight: 700 }}>✅</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p style={{ textAlign: "center", fontSize: 12, color: "#444", margin: 0 }}>
          Cancel anytime · No questions asked · Founding member pricing locks in forever
        </p>
      </div>
    </div>
  );
}
