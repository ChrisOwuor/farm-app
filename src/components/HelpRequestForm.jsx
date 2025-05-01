import React, { useState } from "react";
import axios from "axios";

const HelpRequestForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState({
    loading: false,
    success: null,
    error: null,
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: null, error: null });

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/help`,
        formData
      ); // adjust to full URL if needed
      setStatus({ loading: false, success: res.data.message, error: null });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus({
        loading: false,
        success: null,
        error: err.response?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Online Help</h2>
      {status.success && (
        <p className="text-green-600 mb-2">{status.success}</p>
      )}
      {status.error && <p className="text-red-600 mb-2">{status.error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          className="w-full p-2 border rounded"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          className="w-full p-2 border rounded"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          className="w-full p-2 border rounded"
          value={formData.subject}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Your message"
          rows="4"
          className="w-full p-2 border rounded"
          value={formData.message}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          disabled={status.loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {status.loading ? "Sending..." : "Submit Help Request"}
        </button>
      </form>
    </div>
  );
};

export default HelpRequestForm;
