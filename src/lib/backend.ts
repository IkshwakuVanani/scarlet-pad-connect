import { createClient } from "@supabase/supabase-js";
import { isRutgersEmail } from "./model";
const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const supabase =
  url && key
    ? createClient(url, key, {
        auth: {
          flowType: "pkce",
          detectSessionInUrl: true,
          persistSession: true,
          autoRefreshToken: true,
        },
      })
    : null;
export const ssoProvider = import.meta.env.VITE_RUTGERS_SSO_PROVIDER_ID as
  | string
  | undefined;
export async function sendMagicLink(email: string) {
  if (!isRutgersEmail(email))
    throw new Error(
      "Use your @rutgers.edu or @scarletmail.rutgers.edu address.",
    );
  if (!supabase)
    throw new Error(
      "Community sign-in is not connected yet. You can explore the sample board in the meantime.",
    );
  const { error } = await supabase.auth.signInWithOtp({
    email: email.trim().toLowerCase(),
    options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
  });
  if (error) throw error;
}
export async function startSSO() {
  if (!supabase || !ssoProvider)
    throw new Error(
      "Rutgers NetID integration is awaiting institutional setup.",
    );
  const { error } = await supabase.auth.signInWithSSO({
    providerId: ssoProvider,
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  });
  if (error) throw error;
}
export function requireBackend() {
  if (!supabase) throw new Error("Connect Supabase to use community features.");
  return supabase;
}
