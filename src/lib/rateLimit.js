/**
 * lib/rateLimit.js
 * Tier-aware per-user rate limiting via Supabase.
 *
 * - Fetches user's tier from profiles table
 * - Applies tier-specific daily limits from tierConfig
 * - Supports storage cap checks (mistakes, problems)
 * - Supports cooldown enforcement per tier
 * - Supports per-session turn counting
 *
 * Fails OPEN (allows request) if Supabase is unreachable.
 */

import { getDailyLimit, getTierConfig, TIERS } from "./tierConfig";

// ─── Fetch user tier from Supabase ─────────────────────────────────────────────
export async function getUserTier(supabase, userId) {
    try {
        const { data: profile } = await supabase
            .from("profiles")
            .select("tier, is_founding_member, is_launch_phase")
            .eq("id", userId)
            .single();

        return {
            tier: profile?.tier || "free",
            isFoundingMember: profile?.is_founding_member || false,
            isLaunchPhase: profile?.is_launch_phase ?? true,
        };
    } catch {
        return { tier: "free", isFoundingMember: false, isLaunchPhase: true };
    }
}

// ─── Daily rate limit check ────────────────────────────────────────────────────
/** Returns { allowed: bool, used: number, limit: number, tier: string } */
export async function checkRateLimit(supabase, userId, feature, tierOverride = null) {
    let userTier = tierOverride;
    let isLaunchPhase = true;

    if (!userTier) {
        const info = await getUserTier(supabase, userId);
        userTier = info.tier;
        isLaunchPhase = info.isLaunchPhase;
    }

    const limit = getDailyLimit(userTier, feature, isLaunchPhase);

    // Unlimited = always allowed
    if (limit === Infinity) {
        return { allowed: true, used: 0, limit: Infinity, tier: userTier };
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    try {
        if (feature === "feynman") {
            const { count, error } = await supabase
                .from("feynman_attempts")
                .select("*", { count: "exact", head: true })
                .eq("user_id", userId)
                .gte("created_at", startOfDay.toISOString());
            if (error) return { allowed: true, used: 0, limit, tier: userTier }; // fail open
            return { allowed: (count ?? 0) < limit, used: count ?? 0, limit, tier: userTier };
        }

        // solver / questions → api_usage table
        const { count, error } = await supabase
            .from("api_usage")
            .select("*", { count: "exact", head: true })
            .eq("user_id", userId)
            .eq("feature", feature)
            .gte("created_at", startOfDay.toISOString());
        if (error) return { allowed: true, used: 0, limit, tier: userTier }; // fail open if table missing
        return { allowed: (count ?? 0) < limit, used: count ?? 0, limit, tier: userTier };
    } catch {
        return { allowed: true, used: 0, limit, tier: userTier }; // fail open on any error
    }
}

// ─── Storage cap check (mistakes, problems) ────────────────────────────────────
/** Returns { allowed: bool, used: number, cap: number, tier: string } */
export async function checkStorageCap(supabase, userId, resource) {
    const { tier, isLaunchPhase } = await getUserTier(supabase, userId);
    const cfg = getTierConfig(tier, isLaunchPhase);

    const capMap = {
        mistakes: cfg.maxMistakes,
        problems: cfg.maxProblems,
    };
    const cap = capMap[resource] ?? Infinity;

    if (cap === Infinity) {
        return { allowed: true, used: 0, cap: Infinity, tier };
    }

    try {
        const table = resource === "mistakes" ? "mistakes" : "problem_attempts";
        const { count, error } = await supabase
            .from(table)
            .select("*", { count: "exact", head: true })
            .eq("user_id", userId);

        if (error) return { allowed: true, used: 0, cap, tier };
        return { allowed: (count ?? 0) < cap, used: count ?? 0, cap, tier };
    } catch {
        return { allowed: true, used: 0, cap, tier };
    }
}

// ─── Cooldown check ────────────────────────────────────────────────────────────
/** Returns { allowed: bool, waitSeconds: number, tier: string } */
export async function checkCooldown(supabase, userId, feature) {
    const { tier, isLaunchPhase } = await getUserTier(supabase, userId);
    const cfg = getTierConfig(tier, isLaunchPhase);
    const cooldown = cfg.cooldownSeconds;

    if (cooldown === 0) {
        return { allowed: true, waitSeconds: 0, tier };
    }

    try {
        const { data, error } = await supabase
            .from("api_usage")
            .select("created_at")
            .eq("user_id", userId)
            .eq("feature", feature)
            .order("created_at", { ascending: false })
            .limit(1);

        if (error || !data || data.length === 0) {
            return { allowed: true, waitSeconds: 0, tier };
        }

        const lastUsed = new Date(data[0].created_at);
        const elapsed = (Date.now() - lastUsed.getTime()) / 1000;
        const remaining = Math.ceil(cooldown - elapsed);

        if (remaining > 0) {
            return { allowed: false, waitSeconds: remaining, tier };
        }

        return { allowed: true, waitSeconds: 0, tier };
    } catch {
        return { allowed: true, waitSeconds: 0, tier }; // fail open
    }
}

// ─── Focus Mode AI interval check ──────────────────────────────────────────────
/** Returns { allowed: bool, waitMinutes: number, tier: string } */
export async function checkFocusAiInterval(supabase, userId) {
    const { tier, isLaunchPhase } = await getUserTier(supabase, userId);
    const cfg = getTierConfig(tier, isLaunchPhase);
    const intervalHours = cfg.focusAiIntervalHours;

    if (intervalHours === 0) {
        return { allowed: true, waitMinutes: 0, tier };
    }

    try {
        const { data, error } = await supabase
            .from("api_usage")
            .select("created_at")
            .eq("user_id", userId)
            .eq("feature", "questions")
            .order("created_at", { ascending: false })
            .limit(1);

        if (error || !data || data.length === 0) {
            return { allowed: true, waitMinutes: 0, tier };
        }

        const lastUsed = new Date(data[0].created_at);
        const elapsedMs = Date.now() - lastUsed.getTime();
        const intervalMs = intervalHours * 60 * 60 * 1000;
        const remainingMs = intervalMs - elapsedMs;

        if (remainingMs > 0) {
            return { allowed: false, waitMinutes: Math.ceil(remainingMs / 60000), tier };
        }

        return { allowed: true, waitMinutes: 0, tier };
    } catch {
        return { allowed: true, waitMinutes: 0, tier }; // fail open
    }
}

// ─── Fire-and-forget: record one usage event ──────────────────────────────────
export async function trackUsage(supabase, userId, feature) {
    if (feature === "feynman") return; // feynman_attempts insert already tracks this
    try {
        await supabase.from("api_usage").insert({ user_id: userId, feature });
    } catch { /* non-fatal */ }
}
