import React, { createContext, useState } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("astronaut");

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    document.documentElement.className = `theme-${newTheme}`;
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
