
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {jwtDecode} from "jwt-decode";

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState(""); // backend expects "username"
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const success = await login(username, password);

      if (!success) {
        setError("Invalid credentials. Please try again.");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
         console.log("Decoded JWT:", decoded); // 🔍 Debug
        const roles = decoded.roles || [];
           console.log("Roles:", roles); // 🔍 Debug
        if (roles.includes("ROLE_ADMIN")) {
          console.log("Going into admin");
          navigate("/admin"); // Admin goes to admin panel
        }else {
          console.log("Going into user");
          navigate("/products"); // Normal user goes to products
        }
      } else {
        // Fallback if token missing
        navigate("/products");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-blue-50 to-blue-200 px-4 py-10 sm:py-16">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl shadow-lg backdrop-blur-md bg-white/40 border border-white/30 text-slate-800 transition-all duration-300">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-8 text-blue-900">
          Log In
        </h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 sm:py-4 border border-blue-300 rounded-xl bg-white/50 placeholder-blue-900 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 sm:py-4 border border-blue-300 rounded-xl bg-white/50 placeholder-blue-900 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />

          {error && (
            <p className="text-red-500 text-center text-sm font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 sm:py-4 mt-2 bg-gradient-to-r from-blue-700 to-blue-500 text-white font-semibold rounded-xl shadow-md hover:scale-105 hover:shadow-lg transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="flex items-center my-6">
          <hr className="flex-grow border-blue-300/50" />
          <span className="px-2 text-sm text-blue-700/60">OR</span>
          <hr className="flex-grow border-blue-300/50" />
        </div>

        <p className="text-center text-blue-800 text-sm sm:text-base">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold hover:underline hover:text-blue-900"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
