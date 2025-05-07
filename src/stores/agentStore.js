import { getCookie } from "cookies-next";
import { create } from "zustand";

const COOKIE_KEY = "hope_fuel_client";

export const useAgentStore = create((set) => ({
  agent: {
    id: null,
    awsId: null,
    roleId: null,
    username: null,
    email: null,
  },
  hasHydrated: false,

  hydrateFromCookie: () => {
    const cookie = getCookie(COOKIE_KEY);
    if (cookie) {
      try {
        const parsed = JSON.parse(cookie);
        set({ agent: parsed, hasHydrated: true });
      } catch (err) {
        console.error("Invalid client cookie:", err);
        set({ hasHydrated: true });
      }
    } else {
      set({ hasHydrated: true });
    }
  },

  clearAgentInfo: () => {
    deleteCookie(COOKIE_KEY);
    set({ agent: null, hasHydrated: false });
  },
}));

export const getAgent = useAgentStore((state) => state.agent);
