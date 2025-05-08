"use client";

import { getCookie } from "cookies-next";
import { useEffect } from "react";
import getAuthCurrentUser from "../app/utilites/getAuthCurrentUser";
import { useAgentStore } from "../stores/agentStore";
import { COOKIE_KEY } from "./constants";

export default function AuthGuard({ children }) {
  const { hasHydrated, clearAgentInfo, setAgent } = useAgentStore();

  useEffect(() => {
    console.log("AuthGuard mounted");
    if (hasHydrated) return;
    console.log("Hydrating from cookie");
    const cookie = getCookie(COOKIE_KEY);
    if (cookie) {
      setAgent(JSON.parse(cookie));
      return;
    }
    console.log("Cookie not found, calling checkAgent API");
    const callCheckOrCreate = async () => {
      try {
        const { userId, email } = await getAuthCurrentUser();
        if (!userId || !email) {
          throw new Error("User ID or email is missing");
        }
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
        setAgent(JSON.parse(cookie));
      } catch (error) {
        console.error("[AuthGuard] Auth fallback failed:", error);
        // clearAgentInfo();
      }
    };

    callCheckOrCreate();
  }, [hasHydrated]);

  return <>{children}</>;
}
