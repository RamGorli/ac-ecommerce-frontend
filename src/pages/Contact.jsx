import { useState } from "react";
import { addContactQuery } from "../services/contactApi";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    comment: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await addContactQuery(formData);
      alert(res.message || "Your message has been sent successfully!");
      setFormData({ name: "", email: "", phone: "", comment: "" });
    } catch (err) {
      console.error("Error submitting contact form:", err);
      alert("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-blue-50 to-blue-200 px-4 py-10 sm:py-16">
      <div className="w-full max-w-3xl p-6 sm:p-10 rounded-3xl shadow-lg backdrop-blur-md bg-white/40 border border-white/30 text-slate-800 transition-all duration-300">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-8 sm:mb-10 text-blue-900">
          Contact
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="flex-1 px-4 py-3 sm:py-4 border border-blue-300 rounded-xl bg-white/50 placeholder-blue-900 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email *"
              className="flex-1 px-4 py-3 sm:py-4 border border-blue-300 rounded-xl bg-white/50 placeholder-blue-900 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
          </div>

          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone number"
            className="w-full px-4 py-3 sm:py-4 border border-blue-300 rounded-xl bg-white/50 placeholder-blue-900 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />

          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            placeholder="Comment"
            rows="5"
            className="w-full px-4 py-3 sm:py-4 border border-blue-300 rounded-xl bg-white/50 placeholder-blue-900 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
            required
          ></textarea>

          <div className="text-center">
            <button
              type="submit"
              className="w-full sm:w-36 py-3 bg-gradient-to-r from-blue-700 to-blue-500 text-white font-semibold rounded-xl shadow-md hover:scale-105 hover:shadow-lg transition"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
