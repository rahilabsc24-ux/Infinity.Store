import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, tokenStore } from "../lib/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore the session from a stored token on first load
  useEffect(() => {
    if (!tokenStore.get()) {
      setLoading(false);
      return;
    }
    api("/auth/me")
      .then(({ user }) => setUser(user))
      .catch(() => tokenStore.clear())
      .finally(() => setLoading(false));
  }, []);

  // Sign out when any request reports an expired session
  useEffect(() => {
    const onExpired = () => {
      tokenStore.clear();
      setUser(null);
    };
    window.addEventListener("auth:expired", onExpired);
    return () => window.removeEventListener("auth:expired", onExpired);
  }, []);

  const value = useMemo(() => {
    const persist = ({ token, user }) => {
      tokenStore.set(token);
      setUser(user);
      return user;
    };

    return {
      user,
      loading,
      isAdmin: user?.role === "admin",
      login: async (email, password) =>
        persist(await api("/auth/login", { method: "POST", body: { email, password }, auth: false })),
      register: async (name, email, password) =>
        persist(await api("/auth/register", { method: "POST", body: { name, email, password }, auth: false })),
      logout: () => {
        tokenStore.clear();
        setUser(null);
      },
    };
  }, [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
