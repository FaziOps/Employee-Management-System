import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import api, { getErrorMessage } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // On first load, restore session from localStorage.
  useEffect(() => {
    const storedUser = localStorage.getItem("ems_user");
    const token = localStorage.getItem("ems_token");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  async function login(email, password) {
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, user: loggedInUser } = res.data.data;
      localStorage.setItem("ems_token", token);
      localStorage.setItem("ems_user", JSON.stringify(loggedInUser));
      setUser(loggedInUser);
      return { success: true };
    } catch (err) {
      return { success: false, message: getErrorMessage(err) };
    }
  }

  function logout() {
    localStorage.removeItem("ems_token");
    localStorage.removeItem("ems_user");
    setUser(null);
    router.push("/login");
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
