
import { useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-blue-50 to-blue-200 px-4 py-10 relative">

     <Link
        to="/"
        className="fixed top-5 left-1/2 -translate-x-1/2 w-[200px] text-center flex items-center gap-2
                  text-blue-700 hover:text-blue-900 font-semibold text-lg
                  underline-offset-4 hover:underline transition"
      >
        🏠 Home
      </Link>
      


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

        <div className="flex items-center my-6">
          <hr className="flex-grow border-blue-300/50" />
          <span className="px-2 text-sm text-blue-700/60">OR</span>
          <hr className="flex-grow border-blue-300/50" />
        </div>

        <p className="text-center mt-6 text-blue-800 text-sm sm:text-base">
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



