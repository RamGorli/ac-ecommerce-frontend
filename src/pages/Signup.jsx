import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [step, setStep] = useState(1); // 1 = signup form, 2 = OTP verification
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Step 1: Send OTP
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await api.get(`/otp/send/${email}`);
      setStep(2);
      setMessage("OTP sent to your email.");
    } catch (err) {
      setMessage("Failed to send OTP. Try again.");
    }
    setLoading(false);
  };

  // Step 2: Verify OTP and register user
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await api.get(`/otp/verify/${email}/${otp}`);
      if (res.data.message.includes("Success")) {
        await api.post("/auth/register", { username: email, password });
        setMessage("Registration successful!");
        navigate("/login");
      } else {
        setMessage("Invalid OTP. Try again.");
      }
    } catch (err) {
      setMessage("Verification failed. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-blue-50 to-blue-200 px-4 py-10">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl shadow-lg backdrop-blur-md bg-white/40 border border-white/30 text-slate-800">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-8 text-blue-900">
          {step === 1 ? "Create Account" : "Verify OTP"}
        </h1>

        {step === 1 ? (
          <form onSubmit={handleSignup} className="space-y-5">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-blue-300 rounded-xl bg-white/50"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-blue-300 rounded-xl bg-white/50"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-xl"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 border border-blue-300 rounded-xl bg-white/50"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-green-600 text-white rounded-xl"
            >
              {loading ? "Verifying..." : "Verify & Register"}
            </button>
            <button
              type="button"
              onClick={() => api.get(`/otp/re-send/${email}`)}
              className="w-full py-3 bg-blue-400 text-white rounded-xl"
            >
              Resend OTP
            </button>
          </form>
        )}

        {message && (
          <p className="text-center mt-4 text-blue-800 font-medium">{message}</p>
        )}
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

//   const [username, setUsername] = useState(""); // backend expects "username"
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     const success = await signup(username, password);
//     if (success) navigate("/login");
//     else setError("Signup failed. Try again.");
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-blue-50 to-blue-200 px-4 py-10 sm:py-16">
//       <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl shadow-lg backdrop-blur-md bg-white/40 border border-white/30 text-slate-800 transition-all duration-300">
//         {/* Title */}
//         <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-8 text-blue-900">
//           Create Account
//         </h1>

//         {/* Signup Form */}
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
//             {loading ? "Signing up..." : "Sign Up"}
//           </button>

//         </form>

//         {/* Login Link */}
//         <p className="mt-4 text-center text-blue-800 text-sm sm:text-base">
//           Already have an account?{" "}
//           <Link
//             to="/login"
//             className="font-semibold hover:underline hover:text-blue-900"
//           >
//             Log in
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default Signup;
