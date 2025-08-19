import React from "react";
import { FaChartLine, FaClock, FaRobot } from "react-icons/fa";
import { MdOutlineDesignServices } from "react-icons/md";
import { FiRefreshCcw } from "react-icons/fi";
import { Link } from "react-router-dom";
import "../App.css";
import BackToTopBtn from "../components/BackToTopBtn";

const AboutComponent = () => {
  const iconColor = "var(--color-primary)";
  const headingStyle = { color: "var(--color-primary)" };
  
  return (
    <div className="about-container">
      <div id="About">
        <h1>About Us</h1>
        <h3>Welcome to our AI Stock Analyzer</h3>
        <p>Your personal companion for real-time stock insights.</p>
        <p>
          Our app offers real-time stock data, user-friendly interfaces, and
          secure authentication to ensure a seamless trading experience.
        </p>
        <p>
          Whether you are a beginner or an experienced trader, our platform is
          designed to help you make informed decisions and manage your
          investments effectively.
        </p>

        <div className="grid-container">
          <div className="grid-item">
            <FaChartLine size={40} color={iconColor} />
            <h2 style={headingStyle}>Real-Time Data</h2>
            <p>
              Access live stock prices and market trends to stay ahead in your
              trading journey.
            </p>
          </div>
          <div className="grid-item">
            <MdOutlineDesignServices size={40} color={iconColor} />
            <h2 style={headingStyle}>User-Friendly Interface</h2>
            <p>
              Navigate through our intuitive design that makes trading easy and
              efficient.
            </p>
          </div>
          <div className="grid-item">
            <FaRobot size={40} color={iconColor} />
            <h2 style={headingStyle}>AI-Powered Predictions</h2>
            <p>Accurate forecasts using Machine Learning and AI models.</p>
          </div>
          <div className="grid-item">
            <FaChartLine size={40} color={iconColor} />
            <h2 style={headingStyle}>Market Trend Analysis</h2>
            <p>Clear visuals to show current and future trends.</p>
          </div>
          <div className="grid-item">
            <FiRefreshCcw size={40} color={iconColor} />
            <h2 style={headingStyle}>Continuous Updates</h2>
            <p>
              We are constantly improving our app to provide you with the best
              trading experience.
            </p>
          </div>
          <div className="grid-item">
            <FaClock size={40} color={iconColor} />
            <h2 style={headingStyle}>24/7 Data Monitoring</h2>
            <p>Constant tracking for updated insights.</p>
          </div>
        </div>

        <div className="button-container">
          <Link to="/stocks">
            <button className="cta-button">Get Started Now</button>
          </Link>
        </div>
      </div>
      <BackToTopBtn />
    </div>
  );
};

export default AboutComponent;
