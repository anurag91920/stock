import React from "react";
import { Outlet } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./theme.css"; // global theme tokens


export default function Layout() {
/* Layout owns ThemeProvider so theme is wired for all pages inside the layout */
return (
<ThemeProvider>
<div className="app-container" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
<Header />
<main style={{ flex: 1 }}>
<Outlet />
</main>
<Footer />
</div>
</ThemeProvider>
);
}