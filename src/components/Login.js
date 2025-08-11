import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../components/firebase";
import { useNavigate, Link } from "react-router-dom";
import { syncLocalToFirebase } from "../utils/watchlistManager";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
   
    await syncLocalToFirebase(); 

    alert("Login successful!");
    navigate("/");
  } catch (err) {
    setError("Invalid email or password");
  }
};

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="auth-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="auth-error">{error}</p>}
        <button type="submit">Login</button>
      </form>
      <p>
        Don’t have an account? <Link to="/signup">Signup</Link>
      </p>
    </div>
  );
};

export default Login;
