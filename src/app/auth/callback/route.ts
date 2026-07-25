import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }

    console.error("[Auth Callback] Failed to exchange code for session:", error.message);
  } else {
    console.warn("[Auth Callback] No code provided in callback URL");
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth-callback-failed`);
}
