import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Signup() {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState(""); // backend expects "username" not "email"
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-200 via-blue-50 to-blue-200 px-4">
      <div className="w-full max-w-md p-8 rounded-3xl shadow-lg backdrop-blur-md bg-white/30 border border-white/30 text-slate-800">
        <h1 className="text-4xl font-extrabold text-center mb-6 text-blue-900">
          Create Account
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

          {error && <p className="text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 bg-gradient-to-r from-blue-700 to-blue-500 text-white font-semibold rounded-xl shadow-md hover:scale-105 transition"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-center text-blue-900">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;












// import { useContext, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";

// function Signup() {
//   const { signup } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     const success = await signup(name, email, password);
//     if (success) navigate("/products");
//     else setError("Signup failed. Try again.");
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-200 via-blue-50 to-blue-200 px-4">
//       <div className="w-full max-w-md p-8 rounded-3xl shadow-lg backdrop-blur-md bg-white/30 border border-white/30 text-slate-800">
//         <h1 className="text-4xl font-extrabold text-center mb-6 text-blue-900">
//           Create Account
//         </h1>

//         <form className="space-y-5" onSubmit={handleSubmit}>
//           <input
//             type="text"
//             placeholder="Full Name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="w-full px-4 py-3 border border-blue-300 rounded-xl bg-white/40 placeholder-blue-900 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
//             required
//           />
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

//           {error && <p className="text-red-500 text-center">{error}</p>}

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full py-3 mt-2 bg-gradient-to-r from-blue-700 to-blue-500 text-white font-semibold rounded-xl shadow-md hover:scale-105 transition"
//           >
//             {loading ? "Signing up..." : "Sign Up"}
//           </button>
//         </form>

//         <p className="mt-4 text-center text-blue-900">
//           Already have an account?{" "}
//           <Link to="/login" className="font-semibold hover:underline">
//             Log in
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default Signup;

