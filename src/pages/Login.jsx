import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
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
        const roles = decoded.roles || [];

        if (roles.includes("ROLE_ADMIN")) {
          navigate("/admin");
        } else {
          navigate("/products");
        }
      } else {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-50 to-blue-200 relative">

      {/* Fixed Home */}
      <Link
        to="/"
        className="fixed top-5 w-full flex justify-center
                  text-blue-700 hover:text-blue-900 font-semibold text-lg
                  underline-offset-4 hover:underline transition z-50"
      >
        🏠 Home
      </Link>

      {/* Center Card */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
        <div className="p-6 sm:p-8 rounded-3xl shadow-lg backdrop-blur-md bg-white/40 border border-white/30 text-slate-800">

          <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-8 text-blue-900">
            Log In
          </h1>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 sm:py-4 border border-blue-300 rounded-xl bg-white/50 text-blue-900 focus:ring-2 focus:ring-blue-400"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 sm:py-4 border border-blue-300 rounded-xl bg-white/50 text-blue-900 focus:ring-2 focus:ring-blue-400"
              required
            />

            {error && <p className="text-red-500 text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 sm:py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-70"
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

//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const success = await login(username, password);

//       if (!success) {
//         setError("Invalid credentials. Please try again.");
//         setLoading(false);
//         return;
//       }

//       const token = localStorage.getItem("token");
//       if (token) {
//         const decoded = jwtDecode(token);
//         const roles = decoded.roles || [];

//         if (roles.includes("ROLE_ADMIN")) {
//           navigate("/admin");
//         } else {
//           navigate("/products");
//         }
//       } else {
//         navigate("/products");
//       }
//     } catch (err) {
//       console.error("Login error:", err);
//       setError("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-200 via-blue-50 to-blue-200 px-4 py-10 sm:py-16 relative">

//       <Link
//         to="/"
//         className="fixed top-5 w-full flex justify-center
//                   text-blue-700 hover:text-blue-900 font-semibold text-lg
//                   underline-offset-4 hover:underline transition z-50"
//       >
//         🏠 Home
//       </Link>

//       <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl shadow-lg backdrop-blur-md bg-white/40 border border-white/30 text-slate-800 transition-all duration-300">
//         <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-8 text-blue-900">
//           Log In
//         </h1>

//         <form className="space-y-5" onSubmit={handleSubmit}>
//           <input
//             type="email"
//             placeholder="Email"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             className="w-full px-4 py-3 sm:py-4 border border-blue-300 rounded-xl bg-white/50 placeholder-blue-900 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
//             required
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full px-4 py-3 sm:py-4 border border-blue-300 rounded-xl bg-white/50 placeholder-blue-900 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
//             required
//           />

//           {error && (
//             <p className="text-red-500 text-center text-sm font-medium">{error}</p>
//           )}

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full py-3 sm:py-4 mt-2 bg-blue-600 text-white font-semibold rounded-xl 
//                       hover:bg-blue-700 active:bg-blue-800 
//                       transition duration-150 ease-in-out text-lg shadow-md 
//                       disabled:opacity-70 disabled:cursor-not-allowed"
//           >
//             {loading ? "Logging in..." : "Log In"}
//           </button>
//         </form>

//         <div className="flex items-center my-6">
//           <hr className="flex-grow border-blue-300/50" />
//           <span className="px-2 text-sm text-blue-700/60">OR</span>
//           <hr className="flex-grow border-blue-300/50" />
//         </div>

//         <p className="text-center text-blue-800 text-sm sm:text-base">
//           Don’t have an account?{" "}
//           <Link
//             to="/signup"
//             className="font-semibold hover:underline hover:text-blue-900"
//           >
//             Sign up
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default Login;
