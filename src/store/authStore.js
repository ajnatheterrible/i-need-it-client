import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoggedIn: false,
  hasRefreshed: false,
  fetchedData: {},

  setFetchedData: (newFetchedData) =>
    set((s) => ({
      fetchedData: {
        ...s.fetchedData,
        ...newFetchedData,
      },
    })),

  login: (userData, newToken) => {
    set((s) => ({
      user: userData ?? s.user,
      token: newToken ?? s.token,
      isLoggedIn: true,
    }));
  },

  logout: async (req, res) => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Failed to log out", err);
    }

    set({
      user: null,
      token: null,
      isLoggedIn: false,
      hasRefreshed: true,
      fetchedData: {},
    });
  },

  loadUserFromRefresh: async () => {
    try {
      const res = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      set((s) => ({
        user: data.user,
        token: data.accessToken,
        isLoggedIn: true,
        hasRefreshed: true,
        fetchedData: s.fetchedData,
      }));
    } catch (err) {
      console.error("Could not refresh user:", err);

      set({
        user: null,
        token: null,
        isLoggedIn: false,
        hasRefreshed: true,
        fetchedData: {},
      });
    }
  },
}));

export default useAuthStore;
