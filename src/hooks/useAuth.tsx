/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useStore } from "../store/useStore";

// Supabase user type
type SupabaseUser = {
  id: string;
  email: string;
  user_metadata?: any;
  created_at: string;
};

export function useAuth() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const setCurrentUser = useStore((state) => state.setCurrentUser);

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user as SupabaseUser);
        setCurrentUser({
          id: data.user.id,
          artistName: data.user.user_metadata?.artistName || "",
          email: data.user.email,
          isAdmin: data.user.user_metadata?.isAdmin || false,
          createdAt: new Date(data.user.created_at),
        });
      } else {
        setUser(null);
        setCurrentUser(null);
      }
      setLoading(false);
    };
    getUser();
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getUser();
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [setCurrentUser]);
  return { user, loading };
}
