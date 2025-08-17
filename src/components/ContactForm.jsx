import React, { useState } from "react";
import BackToTopBtn from "./BackToTopBtn";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({});
  const [showOverlay, setShowOverlay] = useState(false);

  // Regex patterns
  const nameRegex = /^[a-zA-Z\s]*$/;
  const emailRegex = /^[a-zA-Z][a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const validateField = (name, value) => {
    let error = "";
    if (name === "firstName" || name === "lastName") {
      if (!nameRegex.test(value)) {
        error = "Only letters and spaces are allowed.";
      }
    } else if (name === "email") {
      if (!emailRegex.test(value)) {
        error = "Please enter a valid email address (must start with a letter).";
      }
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
    return error === "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const validateForm = () => {
    let isValid = true;
    if (!validateField("firstName", formData.firstName)) isValid = false;
    if (!validateField("lastName", formData.lastName)) isValid = false;
    if (!validateField("email", formData.email)) isValid = false;
    return isValid && Object.values(errors).every((e) => e === "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setStatus("Please correct the errors in the form.");
      return;
    }

    setStatus("Sending message...");
    const payload = {
      access_key: process.env.REACT_APP_ACCESS_KEY,
      ...formData,
    };

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.success) {
        setStatus("Message sent successfully!");
        setFormData({ firstName: "", lastName: "", email: "", message: "" });
        setErrors({});
        setShowOverlay(true);

        setTimeout(() => setShowOverlay(false), 3000);
      } else {
        setStatus("Failed to send message.");
      }
    } catch (error) {
      console.error("Error:", error);
      setStatus("An error occurred. Please try again.");
    }
  };

  const errorTextStyle = {
    color: "red",
    fontSize: "12px",
    marginTop: "4px",
    display: "block",
  };

  return (
    <section
      className="contact-section"
      id="contact"
      style={{ padding: "80px 0", color: "white", backgroundColor: "white" }}
    >
      <div
        className="container contact-container"
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          background: "rgba(0, 123, 255, 0.15)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderRadius: "30px",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
          padding: "30px",
        }}
      >
        <h2
          className="section-title"
          style={{
            fontSize: "3rem",
            textAlign: "center",
            marginBottom: "50px",
            fontWeight: "bold",
          }}
        >
          Contact Us
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "25px" }}
        >
          {/* First + Last Name */}
          <div className="flex-contact">
            <div className="fullname" style={{ position: "relative" }}>
              <i
                className="fas fa-user fas-animation"
                style={{
                  position: "absolute",
                  top: "16px",
                  left: "16px",
                  color: "#ccc",
                  fontSize: "1.4rem",
                }}
              ></i>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="contact-input"
                style={{
                  padding: "18px 18px 18px 50px",
                  fontSize: "1.2rem",
                  width: "100%",
                  border: "none",
                  borderRadius: "15px",
                }}
              />
              {errors.firstName && (
                <span style={errorTextStyle}>{errors.firstName}</span>
              )}
            </div>

            <div className="fullname" style={{ position: "relative" }}>
              <i
                className="fas fa-id-card fas-animation"
                style={{
                  position: "absolute",
                  top: "16px",
                  left: "16px",
                  color: "#ccc",
                  fontSize: "1.4rem",
                }}
              ></i>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="contact-input"
                style={{
                  padding: "18px 18px 18px 50px",
                  fontSize: "1.2rem",
                  width: "100%",
                  border: "none",
                  borderRadius: "15px",
                }}
              />
              {errors.lastName && (
                <span style={errorTextStyle}>{errors.lastName}</span>
              )}
            </div>
          </div>

          {/* Email */}
          <div style={{ position: "relative" }}>
            <i
              className="fas fa-envelope fas-animation"
              style={{
                position: "absolute",
                top: "16px",
                left: "16px",
                color: "#ccc",
                fontSize: "1.4rem",
              }}
            ></i>
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="contact-input"
              style={{
                padding: "18px 18px 18px 50px",
                fontSize: "1.2rem",
                width: "100%",
                border: "none",
                borderRadius: "15px",
              }}
            />
            {errors.email && (
              <span style={errorTextStyle}>{errors.email}</span>
            )}
          </div>

          {/* Message */}
          <div style={{ position: "relative" }}>
            <i
              className="fas fa-comment-dots fas-animation"
              style={{
                position: "absolute",
                top: "16px",
                left: "16px",
                color: "#ccc",
                fontSize: "1.4rem",
              }}
            ></i>
            <textarea
              name="message"
              rows="6"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
              className="contact-textarea"
              style={{
                padding: "18px 18px 18px 50px",
                fontSize: "1.2rem",
                width: "100%",
                border: "none",
                borderRadius: "15px",
              }}
            ></textarea>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-bold text-lg hover:bg-green-600 transition-colors duration-300 shadow-md"
          >
            <i className="fas fa-paper-plane"></i> Send Message
          </button>
        </form>

        {/* Status */}
        {status && (
          <p
            className={`mt-5 text-center font-bold ${
              status.includes("successfully") ? "text-green-700" : "text-red-600"
            }`}
          >
            {status}
          </p>
        )}

        {/* Overlay */}
        <div
          className={`message-overlay ${showOverlay ? "opacity-100" : ""}`}
          style={{ opacity: showOverlay ? 1 : 0 }}
        >
          <div className="overlay-content">
            <i className="fas fa-check-circle"></i>
            <span>Message Sent Successfully!</span>
          </div>
        </div>

        
      </div>
    </section>
  );
};

export default ContactForm;
