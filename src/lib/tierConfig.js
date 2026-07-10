// ─── EurekaAI Tier Configuration ─────────────────────────────────────────────
// Three tiers: free (explorer) → plus (decoy) → pro (the obvious choice)
// The "medium popcorn bucket" strategy — Plus exists to make Pro a no-brainer.

// ─── Launch Phase Flag ─────────────────────────────────────────────────────────
// During launch, free users get relaxed limits to hook them + serve as testers.
// Flip this to false when launch window ends.
export const IS_LAUNCH_PHASE = true;

// ─── Tier Definitions ──────────────────────────────────────────────────────────
export const TIERS = {
  free: {
    key: "free",
    label: "Explorer",
    tagline: "Enough to feel the magic",
    color: "#A1A1AA",

    // Daily session caps
    solverSessionsPerDay: 1,
    feynmanEvalsPerDay: 2,
    focusAiIntervalHours: 6,    // AI quiz/flashcards once every 6 hours
    questionsPerDay: 2,

    // Per-session limits
    turnsPerSession: 8,
    cooldownSeconds: 45,

    // Storage caps
    maxMistakes: 10,       // total entries ever
    maxProblems: 15,       // saved problems

    // Feature flags
    imageUpload: false,
    analytics: false,      // weak areas / trends
    fullHistory: false,    // only last 3 sessions
    historyLimit: 3,
    exportPdf: false,
    priorityAi: false,
  },

  plus: {
    key: "plus",
    label: "Plus",
    tagline: "Better, but Pro is obviously the move",
    color: "#818cf8",

    solverSessionsPerDay: 5,
    feynmanEvalsPerDay: 5,
    focusAiIntervalHours: 2,
    questionsPerDay: 8,

    turnsPerSession: 15,
    cooldownSeconds: 15,

    maxMistakes: 50,
    maxProblems: 50,

    imageUpload: true,
    analytics: false,      // basic scores only, no deep analysis
    fullHistory: false,
    historyLimit: 15,
    exportPdf: false,
    priorityAi: false,
  },

  pro: {
    key: "pro",
    label: "Pro",
    tagline: "Everything. Unlimited.",
    color: "#0D9488",

    solverSessionsPerDay: Infinity,
    feynmanEvalsPerDay: Infinity,
    focusAiIntervalHours: 0,    // unlimited
    questionsPerDay: Infinity,

    turnsPerSession: Infinity,
    cooldownSeconds: 0,

    maxMistakes: Infinity,
    maxProblems: Infinity,

    imageUpload: true,
    analytics: true,
    fullHistory: true,
    historyLimit: Infinity,
    exportPdf: true,
    priorityAi: true,
  },
};

// ─── Launch Phase Overrides for Free Tier ──────────────────────────────────────
// More generous free limits during beta to hook users as testers
export const LAUNCH_FREE_OVERRIDES = {
  solverSessionsPerDay: 3,
  feynmanEvalsPerDay: 5,
  focusAiIntervalHours: 2,
  questionsPerDay: 5,
  turnsPerSession: 12,
  cooldownSeconds: 20,
  maxMistakes: 25,
  maxProblems: 30,
};

// ─── Pricing ───────────────────────────────────────────────────────────────────
export const PRICING = {
  plus: {
    monthly: 99,
    annual: 799,      // ₹67/mo — 33% off
    currency: "₹",
  },
  pro: {
    monthly: 149,
    annual: 999,       // ₹83/mo — 44% off
    currency: "₹",
  },
  founding: {
    proMonthly: 99,     // locked forever
    proAnnual: 699,     // locked forever
    proLifetime: 999,   // one-time
    maxSpots: 500,
  },
};

// ─── Helper: Get effective tier config for a user ──────────────────────────────
export function getTierConfig(tierKey, isLaunchPhase = IS_LAUNCH_PHASE) {
  const tier = TIERS[tierKey] || TIERS.free;

  // Apply launch phase overrides for free users
  if (tier.key === "free" && isLaunchPhase) {
    return { ...tier, ...LAUNCH_FREE_OVERRIDES };
  }

  return tier;
}

// ─── Helper: Check if a feature is available for a tier ────────────────────────
export function hasFeature(tierKey, feature) {
  const tier = TIERS[tierKey] || TIERS.free;
  return !!tier[feature];
}

// ─── Helper: Get daily limit for a specific feature ────────────────────────────
export function getDailyLimit(tierKey, feature, isLaunchPhase = IS_LAUNCH_PHASE) {
  const cfg = getTierConfig(tierKey, isLaunchPhase);

  const map = {
    solver: cfg.solverSessionsPerDay,
    feynman: cfg.feynmanEvalsPerDay,
    questions: cfg.questionsPerDay,
  };

  return map[feature] ?? 10;
}
