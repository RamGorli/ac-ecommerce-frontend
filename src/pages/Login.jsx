import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

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

    const success = await login(username, password);
    if (success) {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const role = decoded.role;
          if (role === "ADMIN") navigate("/admin");
          else navigate("/products");
        } catch {
          navigate("/products");
        }
      }
    } else {
      setError("Invalid credentials. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-200 via-blue-50 to-blue-200 px-4">
      <div className="w-full max-w-md p-8 rounded-3xl shadow-lg backdrop-blur-md bg-white/30 border border-white/30 text-slate-800">
        <h1 className="text-4xl font-extrabold text-center mb-6 text-blue-900">
          Log In
        </h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 border border-blue-300 rounded-xl bg-white/40 placeholder-blue-900 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-blue-300 rounded-xl bg-white/40 placeholder-blue-900 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />

          {error && (
            <p className="text-red-500 text-center text-sm font-medium">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 bg-gradient-to-r from-blue-700 to-blue-500 text-white font-semibold rounded-xl shadow-md hover:scale-105 transition"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="flex items-center my-6">
          <hr className="flex-grow border-blue-300/50" />
          <span className="px-2 text-sm text-blue-700/60">OR</span>
          <hr className="flex-grow border-blue-300/50" />
        </div>

        <p className="text-center text-blue-800">
          Don’t have an account?{" "}
          <Link to="/signup" className="font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;





// import { useContext, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import { jwtDecode } from "jwt-decode";

// function Login() {
//   const { login } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     const success = await login(email, password);
//     if (success) {
//       const token = localStorage.getItem("token");
//       const decoded = jwtDecode(token);
//       const role = decoded.role;

//       if (role === "ADMIN") navigate("/admin");
//       else navigate("/products");
//     } else {
//       setError("Invalid credentials. Please try again.");
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-200 via-blue-50 to-blue-200 px-4">
//     {/* <div className="min-h-screen flex flex-col items-center justify-center bg-blue-200 px-4"> */}

//       <div className="w-full max-w-md p-8 rounded-3xl shadow-lg backdrop-blur-md bg-white/30 border border-white/30 text-slate-800">
//         {/* Brand */}
//         <h1 className="text-4xl font-extrabold text-center mb-6 text-blue-900">
//           Log In
//         </h1>
     
//         {/* Login Form */}
//         <form className="space-y-5" onSubmit={handleSubmit}>
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full px-4 py-3 border border-blue-300 rounded-xl bg-white/40 placeholder-blue-900 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
//             required
//           />

//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full px-4 py-3 border border-blue-300 rounded-xl bg-white/40 placeholder-blue-900 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
//             required
//           />

//           {error && (
//             <p className="text-red-500 text-center text-sm font-medium">{error}</p>
//           )}

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full py-3 mt-2 bg-gradient-to-r from-blue-700 to-blue-500 text-white font-semibold rounded-xl shadow-md hover:scale-105 transition"
//           >
//             {loading ? "Logging in..." : "Log In"}
//           </button>
//         </form>

//         {/* Divider */}
//         <div className="flex items-center my-6">
//           <hr className="flex-grow border-blue-300/50" />
//           <span className="px-2 text-sm text-blue-700/60">OR</span>
//           <hr className="flex-grow border-blue-300/50" />
//         </div>

//         {/* Signup Link */}
//         <p className="text-center text-blue-800">
//           Don’t have an account?{" "}
//           <Link to="/signup" className="font-semibold hover:underline">
//             Sign up
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default Login;
