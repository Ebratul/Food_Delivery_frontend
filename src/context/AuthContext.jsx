import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { TOKEN_KEY, api, onSessionExpired } from "../lib/api.js";
import { tokenExpiry } from "../lib/utils.js";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));

  const logout = useCallback((reason) => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
    setLoading(false);
    queryClient.removeQueries({ predicate: (q) => q.queryKey[0] === "me" || q.queryKey[0] === "dashboard" || q.queryKey[0] === "admin" });
    if (reason === "expired") toast.info("Your session has expired. Please log in again.");
  }, [queryClient]);

  const login = useCallback(({ token: newToken, user: newUser }) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    setUser(newUser);
  }, []);

  // load the current user when a token exists
  useEffect(() => {
    if (!token) return undefined;
    let cancelled = false;
    api.get("/auth/me")
      .then((r) => { if (!cancelled) setUser(r.data.data); })
      .catch(() => { if (!cancelled) logout(); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [token, logout]);

  // auto-logout exactly when the JWT expires
  useEffect(() => {
    if (!token) return undefined;
    const exp = tokenExpiry(token);
    if (!exp) return undefined;
    const ms = Math.max(0, exp - Date.now());
    const id = setTimeout(() => logout("expired"), Math.min(ms, 2 ** 31 - 1));
    return () => clearTimeout(id);
  }, [token, logout]);

  // the API reports expired/invalid tokens on any request
  useEffect(() => onSessionExpired(() => logout("expired")), [logout]);

  const value = useMemo(
    () => ({ user, token, loading, isAuthenticated: Boolean(user), isAdmin: user?.role === "ADMIN", login, logout, setUser }),
    [user, token, loading, login, logout],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
