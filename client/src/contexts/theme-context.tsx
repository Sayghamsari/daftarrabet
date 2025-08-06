import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark";
type GenderTheme = "feminine" | "masculine";

interface ThemeContextType {
  theme: Theme;
  genderTheme: GenderTheme;
  setTheme: (theme: Theme) => void;
  setGenderTheme: (genderTheme: GenderTheme) => void;
  toggleTheme: () => void;
  toggleGenderTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("theme");
    return (saved as Theme) || "light";
  });

  const [genderTheme, setGenderTheme] = useState<GenderTheme>(() => {
    const saved = localStorage.getItem("gender-theme");
    return (saved as GenderTheme) || "feminine";
  });

  useEffect(() => {
    const root = document.documentElement;
    
    // Apply theme classes
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    
    // Apply gender theme classes
    root.classList.remove("theme-feminine", "theme-masculine");
    root.classList.add(`theme-${genderTheme}`);
    
    // Store preferences
    localStorage.setItem("theme", theme);
    localStorage.setItem("gender-theme", genderTheme);
  }, [theme, genderTheme]);

  const toggleTheme = () => {
    setTheme(prev => prev === "light" ? "dark" : "light");
  };

  const toggleGenderTheme = () => {
    setGenderTheme(prev => prev === "feminine" ? "masculine" : "feminine");
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      genderTheme,
      setTheme,
      setGenderTheme,
      toggleTheme,
      toggleGenderTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}