import { useTheme } from "@/contexts/theme-context";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { 
  Sun, 
  Moon, 
  Palette,
  Heart,
  Zap
} from "lucide-react";

export function ThemeSwitcher() {
  const { theme, genderTheme, toggleTheme, toggleGenderTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Palette className="w-4 h-4" />
          <span className="hidden sm:inline">طراحی</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>تنظیمات ظاهری</DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={toggleTheme} className="gap-2 cursor-pointer">
          {theme === "light" ? (
            <>
              <Moon className="w-4 h-4" />
              حالت تاریک
            </>
          ) : (
            <>
              <Sun className="w-4 h-4" />
              حالت روشن
            </>
          )}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel>طراحی کلی</DropdownMenuLabel>
        
        <DropdownMenuItem onClick={toggleGenderTheme} className="gap-2 cursor-pointer">
          {genderTheme === "feminine" ? (
            <>
              <Zap className="w-4 h-4 text-blue-500" />
              طراحی پسرانه
            </>
          ) : (
            <>
              <Heart className="w-4 h-4 text-pink-500" />
              طراحی دخترانه
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}