import { useCallback, useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { supabase } from "../lib/backend";
import { demoHomes, demoRoommates } from "../lib/demo";
import {
  defaultPlan,
  isRutgersEmail,
  readLocal,
  storeLocal,
  type Connection,
  type Home,
  type Planner,
  type Roommate,
} from "../lib/model";
export function useCommunity() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(!!supabase);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [homes, setHomes] = useState<Home[]>(supabase ? [] : demoHomes);
  const [roommates, setRoommates] = useState<Roommate[]>(
    supabase ? [] : demoRoommates,
  );
  const [saves, setSaves] = useState<string[]>(() =>
    readLocal("scarlet-demo-saves", []),
  );
  const [connections, setConnections] = useState<Connection[]>([]);
  const [plan, setPlan] = useState<Planner>(() =>
    readLocal("scarlet-demo-plan", defaultPlan),
  );
  const generation = useRef(0);
  const demo = !supabase;
  useEffect(() => {
    if (!supabase) return;
    const accept = (u: User | null) => {
      if (u && (!u.email_confirmed_at || !isRutgersEmail(u.email || ""))) {
        void supabase!.auth.signOut();
        toast.error("A confirmed Rutgers email is required.");
        setUser(null);
      } else setUser(u);
      setAuthLoading(false);
    };
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, s) => accept(s?.user ?? null));
    supabase.auth
      .getUser()
      .then(({ data }) => accept(data.user))
      .catch(() => setAuthLoading(false));
    return () => subscription.unsubscribe();
  }, []);
  const refresh = useCallback(async () => {
    const run = ++generation.current;
    setError("");
    if (!user || !supabase) {
      setHomes(supabase ? [] : demoHomes);
      setRoommates(supabase ? [] : demoRoommates);
      setConnections([]);
      setSaves(supabase ? [] : readLocal("scarlet-demo-saves", []));
      setPlan(
        supabase ? defaultPlan : readLocal("scarlet-demo-plan", defaultPlan),
      );
      setLoading(false);
      return;
    }
    setHomes([]);
    setRoommates([]);
    setSaves([]);
    setConnections([]);
    setPlan(defaultPlan);
    setLoading(true);
    const results = await Promise.all([
      supabase
        .from("pad_listings")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase.from("pad_roommates").select("*"),
      supabase.from("pad_saves").select("listing_id").eq("user_id", user.id),
      supabase
        .from("pad_connections")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("pad_plans")
        .select("data")
        .eq("user_id", user.id)
        .maybeSingle(),
    ]);
    if (run !== generation.current) return;
    const failure = results.find((r) => r.error)?.error;
    if (failure) {
      setError(
        "Community data could not be loaded. Check your connection or try again.",
      );
      setLoading(false);
      return;
    }
    const loadedHomes = results[0].data as Home[];
    const paths = loadedHomes.flatMap((h) =>
      h.photo_path ? [h.photo_path] : [],
    );
    if (paths.length) {
      const { data: images, error: imageError } = await supabase.storage
        .from("pad-listing-photos")
        .createSignedUrls(paths, 3600);
      if (run !== generation.current) return;
      if (imageError)
        toast.error("Some home photos could not be loaded. Try refreshing.");
      const urls = new Map((images || []).map((i) => [i.path, i.signedUrl]));
      loadedHomes.forEach((h) => {
        if (h.photo_path) h.photo_url = urls.get(h.photo_path) || null;
      });
    }
    setHomes(loadedHomes);
    setRoommates(results[1].data as Roommate[]);
    setSaves((results[2].data || []).map((x) => x.listing_id));
    setConnections(results[3].data as Connection[]);
    setPlan((results[4].data?.data as unknown as Planner) || defaultPlan);
    setLoading(false);
  }, [user]);
  useEffect(() => {
    void refresh();
  }, [refresh]);
  const toggleSave = async (id: string) => {
    const next = saves.includes(id)
      ? saves.filter((x) => x !== id)
      : [...saves, id];
    if (user && supabase) {
      const { error } = saves.includes(id)
        ? await supabase
            .from("pad_saves")
            .delete()
            .eq("user_id", user.id)
            .eq("listing_id", id)
        : await supabase
            .from("pad_saves")
            .insert({ user_id: user.id, listing_id: id });
      if (error) {
        toast.error("Could not update your shortlist. Please try again.");
        return;
      }
    } else if (!storeLocal("scarlet-demo-saves", next)) {
      toast.error("Your browser could not save this shortlist.");
      return;
    }
    setSaves(next);
    toast.success(
      next.includes(id) ? "Added to your shortlist" : "Removed from shortlist",
    );
  };
  const savePlan = async (next: Planner) => {
    if (user && supabase) {
      const { error } = await supabase
        .from("pad_plans")
        .upsert({ user_id: user.id, data: next });
      if (error) throw error;
    } else if (!storeLocal("scarlet-demo-plan", next))
      throw new Error("Your browser could not save the plan.");
    setPlan(next);
  };
  return {
    user,
    authLoading,
    loading,
    error,
    homes,
    roommates,
    saves,
    connections,
    plan,
    demo,
    refresh,
    toggleSave,
    savePlan,
  };
}
export type Community = ReturnType<typeof useCommunity>;
