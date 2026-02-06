import { supabase } from "@/integrations/supabase/client";

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon_url: string;
    category: string;
    awarded_at?: string; // If user has it
}

export const gamificationService = {
    // Check and Update Daily Streak
    async checkStreak() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
            .from("profiles")
            .select("streak_count, last_login")
            .eq("id", user.id)
            .single();

        if (!profile) return;

        const lastLogin = profile.last_login ? new Date(profile.last_login) : null;
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        // Default to 1 if first time
        let newStreak = 1;
        let shouldUpdate = false;

        if (lastLogin) {
            const lastLoginDate = new Date(lastLogin.getFullYear(), lastLogin.getMonth(), lastLogin.getDate());
            const diffTime = Math.abs(today.getTime() - lastLoginDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 0) {
                // Already logged in today, do nothing
                shouldUpdate = false;
            } else if (diffDays === 1) {
                // Logged in yesterday, increment streak
                newStreak = (profile.streak_count || 0) + 1;
                shouldUpdate = true;
            } else {
                // Break in streak, reset to 1
                newStreak = 1;
                shouldUpdate = true;
            }
        } else {
            shouldUpdate = true;
        }

        if (shouldUpdate) {
            const { error } = await supabase
                .from("profiles")
                .update({
                    streak_count: newStreak,
                    last_login: now.toISOString()
                })
                .eq("id", user.id);

            if (!error && newStreak >= 7) {
                this.awardBadge('week_warrior');
            }
        }
    },

    // Get User Badges
    async getUserBadges(): Promise<Badge[]> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        // Get all defined badges
        const { data: allBadges, error: badgesError } = await supabase
            .from("badges")
            .select("*");

        if (badgesError) {
            console.error("Error fetching badges:", badgesError);
            return [];
        }

        // Get user's earned badges
        const { data: userBadges, error: userBadgesError } = await supabase
            .from("user_badges")
            .select("badge_id, awarded_at")
            .eq("user_id", user.id);

        if (userBadgesError) {
            console.error("Error fetching user badges:", userBadgesError);
            return [];
        }

        // Merge them
        return allBadges.map((badge) => {
            const earned = userBadges.find((ub) => ub.badge_id === badge.id);
            return {
                ...badge,
                awarded_at: earned?.awarded_at,
            };
        });
    },

    // Award a specific badge
    async awardBadge(badgeId: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Check if already has badge
        const { data: existing } = await supabase
            .from("user_badges")
            .select("*")
            .eq("user_id", user.id)
            .eq("badge_id", badgeId)
            .single();

        if (existing) return; // Already awarded

        // Insert
        // Note: This relies on RLS allowing insert, or a backend function. 
        // If RLS blocks, we might need a Postgres Function.
        const { error } = await supabase
            .from("user_badges")
            .insert({
                user_id: user.id,
                badge_id: badgeId
            });

        if (error) {
            console.error(`Error awarding badge ${badgeId}:`, error);
        } else {
            console.log(`Badge ${badgeId} awarded!`);
            // Optional: Show toast notification here
        }
    }
};
