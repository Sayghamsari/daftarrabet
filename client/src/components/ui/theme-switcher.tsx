import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type ThemeColor = "feminine" | "masculine" | "neutral";

interface ThemeOption {
  id: ThemeColor;
  name: string;
  description: string;
  primary: string;
  secondary: string;
  gradient: string;
}

const themeOptions: ThemeOption[] = [
  {
    id: "feminine",
    name: "دخترانه",
    description: "بنفش و صورتی ملایم",
    primary: "#8b5fbf",
    secondary: "#d1c4e9",
    gradient: "linear-gradient(135deg, #8b5fbf 0%, #a569bd 100%)"
  },
  {
    id: "masculine", 
    name: "پسرانه",
    description: "آبی و تیل ملایم",
    primary: "#5b9bd5",
    secondary: "#b3d9f2",
    gradient: "linear-gradient(135deg, #5b9bd5 0%, #7bb3e0 100%)"
  },
  {
    id: "neutral",
    name: "خنثی",
    description: "سبز و طوسی ملایم", 
    primary: "#4caf50",
    secondary: "#c8e6c9",
    gradient: "linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)"
  }
];

export function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState<ThemeColor>("feminine");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load saved theme preference
    const savedTheme = localStorage.getItem("theme-color") as ThemeColor;
    if (savedTheme && themeOptions.find(t => t.id === savedTheme)) {
      setCurrentTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (theme: ThemeColor) => {
    const selectedTheme = themeOptions.find(t => t.id === theme);
    if (!selectedTheme) return;

    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('theme-masculine', 'theme-neutral');
    
    // Add new theme class
    if (theme === 'masculine') {
      root.classList.add('theme-masculine');
    } else if (theme === 'neutral') {
      root.classList.add('theme-neutral');
    }
    
    // Update CSS variables
    root.style.setProperty('--theme-primary', selectedTheme.primary);
    root.style.setProperty('--theme-secondary', selectedTheme.secondary);
    root.style.setProperty('--theme-gradient', selectedTheme.gradient);
    
    // Update Tailwind CSS variables for better integration
    root.style.setProperty('--primary', `hsl(${hexToHsl(selectedTheme.primary)})`);
    
    // Apply theme-specific font adjustments for better readability
    if (theme === 'feminine') {
      root.style.setProperty('--font-weight-normal', '400');
      root.style.setProperty('--font-weight-medium', '500');
      root.style.setProperty('--font-weight-bold', '600');
    } else if (theme === 'masculine') {
      root.style.setProperty('--font-weight-normal', '450');
      root.style.setProperty('--font-weight-medium', '550');
      root.style.setProperty('--font-weight-bold', '650');
    } else {
      root.style.setProperty('--font-weight-normal', '425');
      root.style.setProperty('--font-weight-medium', '525');
      root.style.setProperty('--font-weight-bold', '625');
    }
    
    // Save preference
    localStorage.setItem("theme-color", theme);
    setCurrentTheme(theme);
    setIsOpen(false);
  };

  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return `${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Palette className="w-4 h-4" />
          <span className="hidden sm:inline">انتخاب رنگ</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-shabnam text-center">انتخاب تم رنگی</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {themeOptions.map((theme) => (
            <Card 
              key={theme.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                currentTheme === theme.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => applyTheme(theme.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-vazir">{theme.name}</CardTitle>
                    <p className="text-xs text-muted-foreground font-dana">{theme.description}</p>
                  </div>
                  {currentTheme === theme.id && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex gap-2">
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                    style={{ background: theme.gradient }}
                  />
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: theme.primary }}
                  />
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: theme.secondary }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}