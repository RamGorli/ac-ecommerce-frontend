import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import api from "../services/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.get("/auth/me")
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Login
  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);

      const profile = await api.get("/auth/me");
      setUser(profile.data);

      return true;
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      return false;
    }
  };

  // Signup
  const signup = async (name, email, password) => {
    try {
      const res =await api.post("/auth/signup", { name, email, password });
      localStorage.setItem("token", res.data.token);

      const profile = await api.get("/auth/me");
      setUser(profile.data);

      return true;
    } catch (err) {
      console.error("Signup failed:", err.response?.data || err.message);
      return false;
    }
  };
  
  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout,setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

