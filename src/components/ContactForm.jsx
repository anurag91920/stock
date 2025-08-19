import React, { useState } from "react";
import BackToTopBtn from "../components/BackToTopBtn";

const ContactForm = () => {
  const formStyles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem',
      backgroundColor: 'var(--color-bg-secondary)',
      borderRadius: 'var(--form-border-radius)',
      boxShadow: '0 4px 6px var(--color-shadow)',
    },
    input: {
      width: '100%',
      padding: '0.75rem 1rem 0.75rem 3rem',
      margin: '0.5rem 0',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--form-border-radius)',
      backgroundColor: 'var(--input-bg)',
      color: 'var(--input-text)',
      fontSize: '1rem',
      transition: 'all var(--transition-speed) ease',
      '&:focus': {
        borderColor: 'var(--input-focus)',
        boxShadow: '0 0 0 0.2rem rgba(79, 209, 197, 0.25)',
        outline: 'none',
      },
      '&::placeholder': {
        color: 'var(--input-placeholder)',
      },
    },
    textarea: {
      width: '100%',
      padding: '1rem 1rem 1rem 3rem',
      margin: '0.5rem 0',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--form-border-radius)',
      backgroundColor: 'var(--input-bg)',
      color: 'var(--input-text)',
      fontSize: '1rem',
      minHeight: '150px',
      resize: 'vertical',
      transition: 'all var(--transition-speed) ease',
      '&:focus': {
        borderColor: 'var(--input-focus)',
        boxShadow: '0 0 0 0.2rem rgba(79, 209, 197, 0.25)',
        outline: 'none',
      },
      '&::placeholder': {
        color: 'var(--input-placeholder)',
      },
    },
  };
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
        setTimeout(() => setShowOverlay(false), 5000); // Show success overlay for 5 seconds
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

  const errorTextStyle = {
    color: "var(--color-danger)",
    fontSize: "0.875rem",
    margin: "0.25rem 0 0 0.5rem",
    display: "block",
    textAlign: "left",
    transition: "opacity 0.3s ease, transform 0.3s ease",
    opacity: 1,
    transform: "translateY(0)",
    animation: "fadeInUp 0.3s ease-out"
  };
  
  const statusMessageStyle = {
    marginTop: "1.5rem",
    padding: "1rem 1.25rem",
    borderRadius: "var(--form-border-radius)",
    textAlign: "center",
    fontWeight: "500",
    backgroundColor: status?.includes("successfully") 
      ? "rgba(25, 135, 84, 0.08)" 
      : status?.includes("error") || status?.includes("Failed") 
        ? "rgba(220, 53, 69, 0.08)" 
        : "rgba(13, 110, 253, 0.08)",
    color: status?.includes("successfully") 
      ? "var(--color-success)" 
      : status?.includes("error") || status?.includes("Failed") 
        ? "var(--color-danger)" 
        : "var(--color-primary)",
    border: "1px solid",
    borderColor: status?.includes("successfully") 
      ? "rgba(25, 135, 84, 0.15)" 
      : status?.includes("error") || status?.includes("Failed") 
        ? "rgba(220, 53, 69, 0.15)" 
        : "rgba(13, 110, 253, 0.15)",
    transition: "all 0.3s ease-in-out",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.75rem",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
    animation: "fadeInUp 0.4s ease-out",
    position: "relative",
    overflow: "hidden"
  };

  return (
    <section
      className="contact-section"
      id="contact"
      style={{
        padding: "4rem 0",
        backgroundColor: "var(--color-bg-secondary)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center"
      }}
    >
      <div
        className="container contact-container"
        style={{
          maxWidth: "1000px",
          width: "90%",
          margin: "2rem auto",
          padding: "2.5rem",
          backgroundColor: "var(--color-card-bg)",
          borderRadius: "12px",
          boxShadow: "0 4px 20px var(--color-shadow)",
          border: "1px solid var(--color-border)"
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
              <label htmlFor="firstName" className="sr-only">First Name</label>
              <div style={{ position: 'relative' }}>
                <i
                  className="fas fa-user fas-animation"
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "1rem",
                    transform: "translateY(-50%)",
                    color: "var(--color-text-secondary)",
                    fontSize: "1.2rem",
                    zIndex: 1,
                    pointerEvents: "none"
                  }}
                ></i>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  aria-required="true"
                  aria-invalid={!!errors.firstName}
                  aria-describedby={errors.firstName ? "firstName-error" : undefined}
                  style={{
                    width: "100%",
                    margin: "8px 0",
                    padding: "0.75rem 1rem 0.75rem 3rem"
                  }}
                  className="form-input"
                />
              </div>
              {errors.firstName && (
                <span style={errorTextStyle}>{errors.firstName}</span>
              )}
            </div>

            <div className="fullname" style={{ position: "relative" }}>
              <label htmlFor="lastName" className="sr-only">Last Name</label>
              <div style={{ position: 'relative' }}>
                <i
                  className="fas fa-id-card fas-animation"
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "1rem",
                    transform: "translateY(-50%)",
                    color: "var(--color-text-secondary)",
                    fontSize: "1.2rem",
                    zIndex: 1,
                    pointerEvents: "none"
                  }}
                ></i>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  aria-required="true"
                  aria-invalid={!!errors.lastName}
                  aria-describedby={errors.lastName ? "lastName-error" : undefined}
                  style={{
                    width: "100%",
                    margin: "8px 0",
                    padding: "0.75rem 1rem 0.75rem 3rem"
                  }}
                  className="form-input"
                />
              </div>
              {errors.lastName && (
                <span style={errorTextStyle}>{errors.lastName}</span>
              )}
            </div>
          </div>

          {/* Email */}
          <div style={{ position: "relative" }}>
            <label htmlFor="email" className="sr-only">Email Address</label>
            <div style={{ position: 'relative' }}>
              <i
                className="fas fa-envelope fas-animation"
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "1rem",
                  transform: "translateY(-50%)",
                  color: "var(--color-text-secondary)",
                  fontSize: "1.2rem",
                  zIndex: 1,
                  pointerEvents: "none"
                }}
              ></i>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
                aria-required="true"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                style={{
                  width: "100%",
                  margin: "8px 0",
                  padding: "0.75rem 1rem 0.75rem 3rem"
                }}
                className="form-input"
              />
            </div>
            {errors.email && (
              <span style={errorTextStyle}>{errors.email}</span>
            )}
          </div>

          {/* Message */}
          <div style={{ position: "relative" }}>
            <label htmlFor="message" className="sr-only">Your Message</label>
            <div style={{ position: 'relative' }}>
              <i
                className="fas fa-comment-dots fas-animation"
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: "1.5rem",
                  left: "1rem",
                  color: "var(--color-text-secondary)",
                  fontSize: "1.2rem",
                  zIndex: 1,
                  pointerEvents: "none"
                }}
              ></i>
              <textarea
                id="message"
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                aria-required="true"
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "message-error" : undefined}
                style={{
                  width: "100%",
                  margin: "8px 0",
                  padding: "1rem 1rem 1rem 3rem",
                  resize: "vertical"
                }}
                className="form-input"
              ></textarea>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              opacity: isSubmitting ? 0.8 : 1,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {isSubmitting ? (
              <>
                <span 
                  className="spinner"
                  style={{
                    display: 'inline-block',
                    width: '1.25rem',
                    height: '1.25rem',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '50%',
                    borderTopColor: 'white',
                    animation: 'spin 1s ease-in-out infinite'
                  }}
                ></span>
                Sending...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane"></i>
                Send Message
              </>
            )}
            {isSubmitting && (
              <div 
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '100%',
                  width: '0%',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  animation: 'progressBar 5s linear forwards'
                }}
              />
            )}
          </button>
        </form>

        {/* Status Message */}
        {status && (
          <div style={statusMessageStyle}>
            {status}
          </div>
        )}

        {/* Success Overlay */}
        {showOverlay && (
          <div 
            className="success-overlay"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              backdropFilter: 'blur(4px)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
              color: 'white',
              fontSize: '1.5rem',
              flexDirection: 'column',
              gap: '1.5rem',
              padding: '2rem',
              textAlign: 'center',
              opacity: showOverlay ? 1 : 0,
              transition: 'opacity 0.4s ease-in-out',
              pointerEvents: showOverlay ? 'auto' : 'none'
            }}
          >
            <div 
              style={{
                backgroundColor: 'rgba(25, 135, 84, 0.1)',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '3px solid var(--color-success)',
                animation: 'pulse 2s infinite'
              }}
            >
              <i 
                className="fas fa-check" 
                style={{
                  fontSize: '3rem',
                  color: 'var(--color-success)'
                }}
              ></i>
            </div>
            
            <h3 style={{
              fontSize: '2rem',
              fontWeight: '600',
              margin: '0',
              color: 'var(--color-text)'
            }}>
              Thank You!
            </h3>
            
            <p style={{
              fontSize: '1.25rem',
              maxWidth: '500px',
              margin: '0',
              color: 'var(--color-text-secondary)',
              lineHeight: '1.6'
            }}>
              Your message has been sent successfully. We'll get back to you soon!
            </p>
            
            <button
              onClick={() => setShowOverlay(false)}
              style={{
                marginTop: '1.5rem',
                padding: '0.75rem 2rem',
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-primary)')}
            >
              <i className="fas fa-times"></i> Close
            </button>
          </div>
        )}

        
      </div>
    </section>
  );
};

export default ContactForm;
