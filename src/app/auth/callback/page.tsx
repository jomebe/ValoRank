"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    const code = new URLSearchParams(window.location.search).get("code");
    if (!supabase || !code) {
      router.replace("/");
      return;
    }

    void supabase.auth.exchangeCodeForSession(code).finally(() => {
      router.replace("/");
    });
  }, [router]);

  return <main className="page-shell min-h-[70vh]" />;
}
