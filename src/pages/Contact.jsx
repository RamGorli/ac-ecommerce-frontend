import { useState } from "react";

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Your message has been sent successfully!");
    setFormData({ name: "", email: "", phone: "", comment: "" });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-200 via-blue-50 to-blue-200 px-4">
      <div className="w-full max-w-3xl p-10 rounded-3xl shadow-lg backdrop-blur-md bg-white/30 border border-white/30 text-slate-800">
        {/* Title */}
        <h1 className="text-5xl font-extrabold text-center mb-10 text-blue-900">
          Contact
        </h1>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name and Email */}
          <div className="flex flex-col sm:flex-row gap-6">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="flex-1 px-4 py-3 border border-blue-300 rounded-xl bg-white/40 placeholder-blue-900 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email *"
              className="flex-1 px-4 py-3 border border-blue-300 rounded-xl bg-white/40 placeholder-blue-900 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
          </div>

          {/* Phone */}
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone number"
            className="w-full px-4 py-3 border border-blue-300 rounded-xl bg-white/40 placeholder-blue-900 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />

          {/* Comment */}
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            placeholder="Comment"
            rows="5"
            className="w-full px-4 py-3 border border-blue-300 rounded-xl bg-white/40 placeholder-blue-900 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
            required
          ></textarea>

          {/* Send Button */}
          <div className="text-center">
            <button
              type="submit"
              className="w-32 py-3 bg-gradient-to-r from-blue-700 to-blue-500 text-white font-semibold rounded-xl shadow-md hover:scale-105 transition"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
