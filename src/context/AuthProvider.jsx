// import { useState, useEffect } from "react";
// import { AuthContext } from "./AuthContext";
// import api from "../services/api";
// import { jwtDecode } from "jwt-decode";

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       try {
//         const decoded = jwtDecode(token);
//         setUser({ email: decoded.sub, role: decoded.role });
//       } catch (err) {
//         console.error("Token decode failed:", err);
//         localStorage.removeItem("token");
//       }
//     }
//     setLoading(false);
//   }, []);

//   // LOGIN
//   const login = async (username, password) => {
//     try {
//       const res = await api.post("/auth/login", { username, password });
//       localStorage.setItem("token", res.data.token);

//       // Decode token to get user info
//       const decoded = jwtDecode(res.data.token);
//       setUser({ email: decoded.sub, role: decoded.role });

//       localStorage.setItem("email", decoded.sub);
//       return true;
//     } catch (err) {
//       console.error("Login failed:", err.response?.data || err.message);
//       return false;
//     }
//   };

//   //  SIGNUP
//   const signup = async (username, password) => {
//     try {
//       await api.post("/auth/register", { username, password });
//       // registration doesn’t return token, so require login afterward
//       return true;
//     } catch (err) {
//       console.error("Signup failed:", err.response?.data || err.message);
//       return false;
//     }
//   };

//   // LOGOUT
//   const logout = () => {
//     localStorage.removeItem("token");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, login, signup, logout, setUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }


import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import api from "../services/api";
import { jwtDecode } from "jwt-decode";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          email: decoded.sub,
          roles: decoded.roles || [], // support multiple roles
        });
      } catch (err) {
        console.error("Token decode failed:", err);
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const res = await api.post("/auth/login", { username, password });
      localStorage.setItem("token", res.data.token);
      const decoded = jwtDecode(res.data.token);
      setUser({
        email: decoded.sub,
        roles: decoded.roles || [],
      });
      localStorage.setItem("email", decoded.sub);
      return true;
    } catch (err) {
      console.error("Login failed:", err.response?.data || err.message);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}




