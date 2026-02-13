import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    setLoading(false);
  });

  // THEN get initial session
  const getSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setSession(session);
    setUser(session?.user ?? null);
    if (session?.user) {
      await checkAdminStatus(session.user.id);
    }
    setLoading(false);
  };

  getSession();

  return () => subscription.unsubscribe();
}, []);

const [isAdmin, setIsAdmin] = useState(false);

const checkAdminStatus = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (data && data.role === 'admin') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  } catch (e) {
    console.error("Error checking admin status:", e);
    setIsAdmin(false);
  }
};

// Re-check admin status when user changes
useEffect(() => {
  if (user) {
    checkAdminStatus(user.id);
  } else {
    setIsAdmin(false);
  }
}, [user]);

return { user, session, loading, isAdmin };
}
