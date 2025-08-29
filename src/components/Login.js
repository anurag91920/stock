import React, { useState } from "react";
import {
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../components/firebase";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { syncLocalToFirebase } from "../utils/watchlistManager";
import "./Login.css";

const provider = new GoogleAuthProvider();

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(""); // Success message state
    const navigate = useNavigate();
    const location = useLocation();
    const loginMessage = location.state?.message;

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            await syncLocalToFirebase(userCredential.user);
<<<<<<< HEAD

            setSuccess("Login successful! Redirecting...");

            // Delay navigation by 1.5 seconds to show message
            setTimeout(() => {
                navigate("/"); // redirect to home page
            }, 1500);
=======
            navigate("/"); // redirect to home
>>>>>>> 6d4a9ebf2593ee6fb926ba6789c07bab650abc2b
        } catch (err) {
            setError(err.message || "Failed to login. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError("");
        setSuccess("");
        setLoading(true);
        try {
            const result = await signInWithPopup(auth, provider);
            await syncLocalToFirebase(result.user);
<<<<<<< HEAD

            setSuccess("Login successful! Redirecting...");

            setTimeout(() => {
                navigate("/"); // redirect to home page
            }, 1500);
=======
            navigate("/");
>>>>>>> 6d4a9ebf2593ee6fb926ba6789c07bab650abc2b
        } catch (err) {
            if (err.code === "auth/popup-closed-by-user") {
                setError("Sign-in cancelled by user.");
            } else if (err.code === "auth/popup-blocked") {
                setError("Popup blocked by browser. Please allow popups.");
            } else {
                setError(err.message || "Google sign-in failed.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h2>Login</h2>

                {loginMessage && (
                    <div className="login-message">{loginMessage}</div>
                )}

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
<<<<<<< HEAD
                    {success && <p className="login-success">{success}</p>}
=======

>>>>>>> 6d4a9ebf2593ee6fb926ba6789c07bab650abc2b
                    <button type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p>
                    Don&apos;t have an account?{" "}
                    <Link to="/signup">Signup</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
