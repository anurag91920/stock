import React, { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../components/firebase";
import { useNavigate, Link } from "react-router-dom";
import { syncLocalToFirebase } from "../utils/watchlistManager";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../components/AuthContext";  // Auth context import करें
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();     // Auth context से current user प्राप्त करें
  const navigate = useNavigate();

  // अगर user login है तो home page पर redirect कर दें
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Local watchlist Firebase में sync करें
      await syncLocalToFirebase(userCredential.user);

      toast.success("Login successful!");
      // यहाँ navigate() का इंतजार नहीं, क्योंकि useEffect user के आधार पर redirect करेगा
    } catch (err) {
      setError("Invalid email or password");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      await syncLocalToFirebase(result.user);

      toast.success("Login successful with Google!");
      // Redirect useEffect में होगा
    } catch (err) {
      const errorCode = err.code;

      if (errorCode === "auth/popup-closed-by-user") {
        setError("Sign-in cancelled by user");
      } else if (errorCode === "auth/popup-blocked") {
        setError("Popup blocked by browser. Please allow popups and try again.");
      } else {
        setError("An error occurred during login");
        console.error("Google Login error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Login</h2>

        {/* Google Sign-In Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="google-login-btn"
          type="button"
        >
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>

        <div className="divider">
          <span>or</span>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          {error && <p className="login-error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p>
          Don't have an account? <Link to="/signup">Signup</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
