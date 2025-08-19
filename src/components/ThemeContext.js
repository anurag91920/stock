import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    
    // Set initial theme class without transition
    const root = document.documentElement;
    root.classList.add('theme-initial');
    root.setAttribute('data-theme', initialTheme);
    
    // Remove initial class after first render to enable transitions
    const timer = setTimeout(() => {
      root.classList.remove('theme-initial');
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  // Apply theme class and save preference
  useEffect(() => {
    if (!theme) return;
    
    try {
      const root = document.documentElement;
      // Remove all theme classes first
      root.classList.remove('light', 'dark');
      // Add the current theme class
      root.classList.add(theme);
      // Also set data-theme attribute for CSS variables
      root.setAttribute('data-theme', theme);
      // Save to localStorage
      localStorage.setItem('theme', theme);
    } catch (e) {
      console.warn('Could not save theme preference:', e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
