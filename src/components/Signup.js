import React, { useState, useEffect } from "react";
import {
    createUserWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
} from "firebase/auth";
import { auth, db } from "./firebase";  // database की जगह db लिया
import { doc, setDoc } from "firebase/firestore";  // Firestore के doc और setDoc
import { Link, useNavigate } from "react-router-dom";
import { syncLocalToFirebase } from "../utils/watchlistManager";
import "./Signup.css";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                navigate("/");
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [success, navigate]);

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess(false);
        setLoading(true);

        if (password !== confirm) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Firestore में यूजर डाटा सेव करना
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                createdAt: new Date().toISOString(),
            });

            await syncLocalToFirebase(user);
            setSuccess(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        setError("");
        setSuccess(false);
        setLoading(true);

        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                createdAt: new Date().toISOString(),
            });

            await syncLocalToFirebase(user);
            setSuccess(true);
        } catch (err) {
            const errorCode = err.code;

            if (errorCode === "auth/popup-closed-by-user") {
                setError("Sign-up cancelled by user");
            } else if (errorCode === "auth/popup-blocked") {
                setError("Popup blocked by browser. Please allow popups and try again.");
            } else if (errorCode === "auth/account-exists-with-different-credential") {
                setError("An account already exists with this email. Try signing in instead.");
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h2>Sign Up</h2>

                {success && <p className="success-message">Signup successful! Redirecting to home...</p>}

                <button
                    onClick={handleGoogleSignup}
                    disabled={loading}
                    className="google-login-btn"
                    type="button"
                >
                    {loading ? "Signing up..." : "Sign up with Google"}
                </button>

                <div className="divider">
                    <span>or</span>
                </div>

                <form onSubmit={handleSignup} className="login-form">
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
                        minLength="6"
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        required
                        disabled={loading}
                        minLength="6"
                    />
                    {error && <p className="login-error">{error}</p>}
                    <button type="submit" disabled={loading}>
                        {loading ? "Signing up..." : "Sign Up"}
                    </button>
                </form>

                <p>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
