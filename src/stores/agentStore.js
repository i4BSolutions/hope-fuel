import { deleteCookie } from "cookies-next";
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
  setHasHydrated: (hasHydrated) => set({ hasHydrated }),
  clearAgentInfo: () => {
    deleteCookie(COOKIE_KEY);
    set({ agent: null, hasHydrated: false });
  },
}));
