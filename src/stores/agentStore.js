import { deleteCookie, getCookie } from "cookies-next";
import { create } from "zustand";
import { COOKIE_KEY } from "../lib/constants";

const defaultAgent = {
  id: null,
  awsId: null,
  roleId: null,
  username: null,
  email: null,
};

export const useAgentStore = create((set) => ({
  agent: defaultAgent,
  hasHydrated: false,
  setAgent: (agent) => set({ agent }),
  hydrateFromCookie: () => {
    const cookie = getCookie(COOKIE_KEY);
    if (cookie) {
      try {
        const parsed = JSON.parse(cookie);
        console.log("Parsed cookie:", parsed);
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
