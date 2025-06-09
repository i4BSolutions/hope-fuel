"use client";

import { getCookie } from "cookies-next";
import { decodeJwt } from "jose";
import { useEffect, useState } from "react";
import Loading from "../app/components/Loading";
import getAuthCurrentUser from "../app/utilites/getAuthCurrentUser";
import { useAgentStore } from "../stores/agentStore";
import { COOKIE_KEY } from "./constants";

export default function AuthGuard({ children }) {
  const { hasHydrated, setHasHydrated, setAgent } = useAgentStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hasHydrated) return;
    const cookie = getCookie(COOKIE_KEY);
    if (cookie) {
      const decoded = decodeJwt(cookie);
      setAgent(decoded);
      setHasHydrated(true);
      setLoading(false);
      return;
    }

    const callCheckOrCreate = async () => {
      try {
        const { userId, email } = await getAuthCurrentUser();
        if (!userId || !email) {
          throw new Error("User ID or email is missing");
        }
        setLoading(true);
        const res = await fetch("/api/checkAgent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ awsId: userId, email }),
          credentials: "include",
        });
        const json = await res.json();

        if (!res.ok || !json.success) {
          throw new Error(json.error || "Authentication failed");
        }
        const cookie = getCookie(COOKIE_KEY);
        const decoded = decodeJwt(cookie);
        setAgent(decoded);
        setHasHydrated(true);
      } catch (error) {
        console.error("[AuthGuard] Auth fallback failed:", error);
      } finally {
        setLoading(false);
      }
    };

    callCheckOrCreate();
  }, [hasHydrated]);

  if (loading) return <Loading />;

  return <>{children}</>;
}
