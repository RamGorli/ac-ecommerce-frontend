import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Signup() {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState(""); // backend expects "username"
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const success = await signup(username, password);
    if (success) navigate("/login");
    else setError("Signup failed. Try again.");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-blue-50 to-blue-200 px-4 py-10 sm:py-16">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl shadow-lg backdrop-blur-md bg-white/40 border border-white/30 text-slate-800 transition-all duration-300">
        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-8 text-blue-900">
          Create Account
        </h1>

        {/* Signup Form */}
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
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-4 text-center text-blue-800 text-sm sm:text-base">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold hover:underline hover:text-blue-900"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
