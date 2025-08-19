import React, { useState } from "react";
import BackToTopBtn from "./BackToTopBtn";
import styles from "./ContactForm.module.css";
import { FaUser, FaEnvelope, FaComment, FaPaperPlane, FaCheck, FaTimes } from 'react-icons/fa';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    setIsSubmitting(true);
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
        setTimeout(() => setShowOverlay(false), 5000); // auto hide
      } else {
        setStatus("Failed to send message. Please try again later.");
      }
    } catch (error) {
      console.error("Error:", error);
      setStatus("An error occurred. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.sectionTitle}>Contact Us</h2>
        </div>

        <form onSubmit={handleSubmit} className={styles.contactForm}>
          <div className={styles.flexContact}>
            <div className={styles.formGroup}>
              <label htmlFor="firstName" className={styles.label}>
                First Name
              </label>
              <div className={styles.inputWrapper}>
                <FaUser className={styles.icon} />
                <input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.firstName ? styles.errorInput : ''}`}
                  placeholder="Enter your first name"
                  required
                  aria-required="true"
                  aria-invalid={!!errors.firstName}
                  aria-describedby={errors.firstName ? "firstname-error" : undefined}
                />
              </div>
              {errors.firstName && (
                <span id="firstname-error" className={styles.error}>
                  {errors.firstName}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="lastName" className={styles.label}>
                Last Name
              </label>
              <div className={styles.inputWrapper}>
                <FaUser className={styles.icon} />
                <input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.lastName ? styles.errorInput : ''}`}
                  placeholder="Enter your last name"
                  required
                  aria-required="true"
                  aria-invalid={!!errors.lastName}
                  aria-describedby={errors.lastName ? "lastname-error" : undefined}
                />
              </div>
              {errors.lastName && (
                <span id="lastname-error" className={styles.error}>
                  {errors.lastName}
                </span>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email Address
            </label>
            <div className={styles.inputWrapper}>
              <FaEnvelope className={styles.icon} />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`${styles.input} ${errors.email ? styles.errorInput : ''}`}
                placeholder="Enter your email address"
                required
                aria-required="true"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
            </div>
            {errors.email && (
              <span id="email-error" className={styles.error}>
                {errors.email}
              </span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="message" className={styles.label}>
              Message
            </label>
            <div className={styles.inputWrapper}>
              <FaComment className={styles.icon} />
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className={`${styles.textarea} ${errors.message ? styles.errorInput : ''}`}
                placeholder="Enter your message"
                required
              />
            </div>
            {errors.message && (
              <span id="message-error" className={styles.error}>
                {errors.message}
              </span>
            )}
          </div>

          {status && (
            <div 
              className={`${styles.statusMessage} ${
                status.includes('success') ? styles.statusSuccess : 
                status.includes('error') || status.includes('Failed') ? styles.statusError : ''
              }`}
              role="status"
              aria-live="polite"
            >
              {status}
            </div>
          )}

          <button
            type="submit"
            className={`${styles.button} ${isSubmitting ? styles.buttonLoading : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className={styles.spinner}></span>
                Sending...
              </>
            ) : (
              <>
                <FaPaperPlane className={styles.buttonIcon} />
                Send Message
              </>
            )}
          </button>
        </form>

        {showOverlay && (
          <div className={styles.successOverlay}>
            <div className={styles.successIcon}>
              <FaCheck className={styles.icon} style={{ fontSize: '3rem', color: 'var(--color-success)' }} />
            </div>
            <h3 className={styles.successTitle}>Thank You!</h3>
            <p className={styles.successText}>
              Your message has been sent successfully. We'll get back to you soon!
            </p>
            <button onClick={() => setShowOverlay(false)} className={styles.closeBtn}>
              <FaTimes className={styles.icon} />
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactForm;
