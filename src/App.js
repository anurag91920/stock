// App.js
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import "./App.css";
import "./styles/global.css";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import StocksList from "./components/StockList";
import Stockdata from "./components/Stockdata";
import AboutComponent from "./components/About";
import ContactForm from "./components/ContactForm";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Watchlist from "./components/Watchlist";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./components/firebase";
import { AuthProvider } from "./components/AuthContext";

// Theme
import { ThemeProvider, useTheme } from "./components/ThemeContext";


// PrivateRoute for protecting watchlist
function PrivateRoute({ children }) {
  const [user, loading] = useAuthState(auth);
  const location = useLocation();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{
          message: "Please log in to view your watchlist.",
          from: location,
        }}
        replace
      />
    );
  }

  return children;
}

// Global styles for smooth transitions
const GlobalStyles = () => {
  const { theme } = useTheme();

  useEffect(() => {
    document.documentElement.classList.remove("no-js");
    document.documentElement.classList.add("js");

    // Instead of overwriting all classes, toggle theme classes
    document.body.classList.remove("theme-light", "theme-dark");
    document.body.classList.add(`theme-${theme}`);

    const timer = setTimeout(() => {
      document.documentElement.classList.add("theme-transition-ready");
    }, 100);

    return () => clearTimeout(timer);
  }, [theme]);

  return null;
};

const App = () => {
  return (
    <ThemeProvider>
      <GlobalStyles />
      <AuthProvider>
        <Router>
          <div className="app-container">
            <Header />
            <div className="content">
              <Routes>
                <Route path="/" element={<StocksList />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/stock/:ticker" element={<Stockdata />} />
                <Route path="/about" element={<AboutComponent />} />
                <Route path="/stocks" element={<StocksList />} />
                <Route
                  path="/watchlist"
                  element={
                    <PrivateRoute>
                      <Watchlist />
                    </PrivateRoute>
                  }
                />
                <Route path="/contact" element={<ContactForm />} />
                {/* Catch-all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
