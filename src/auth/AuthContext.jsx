import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../api/client";
import { AuthContext } from "./context";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const response = await api.get("/api/auth/me");
      setUser(response.data);
      return response.data;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/api/auth/logout");
    } finally {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    api.get("/api/auth/me")
      .then((response) => {
        if (mounted) setUser(response.data);
      })
      .catch(() => {
        if (mounted) setUser(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    const onExpired = () => setUser(null);
    window.addEventListener("roadassist:session-expired", onExpired);
    return () => {
      mounted = false;
      window.removeEventListener("roadassist:session-expired", onExpired);
    };
  }, []);

  const value = useMemo(
    () => ({ user, setUser, loading, refreshUser, logout }),
    [user, loading, refreshUser, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
