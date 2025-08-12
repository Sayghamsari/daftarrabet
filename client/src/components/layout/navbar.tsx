import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { Bell, Settings, LogOut, User, Sparkles, Star } from "lucide-react";

export default function Navbar() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications] = useState(3); // Mock notification count

  const handleLogout = () => {
    toast({
      title: "خروج موفق",
      description: "شما با موفقیت از سیستم خارج شدید",
    });
    // Redirect to auth page after a short delay
    setTimeout(() => {
      window.location.href = "/auth";
    }, 1000);
  };

  const getRoleText = (role: string) => {
    const roleMap = {
      student: "دانش‌آموز",
      teacher: "معلم",
      principal: "مدیر",
      parent: "والدین",
      counselor: "مشاور",
      deputy: "معاون آموزشی",
      liaison: "رابط"
    };
    return roleMap[role as keyof typeof roleMap] || role;
  };

  const getRoleBadgeVariant = (role: string): "default" | "secondary" | "destructive" | "outline" => {
    const variantMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      student: "default",
      teacher: "secondary",
      principal: "destructive",
      parent: "outline",
      counselor: "secondary",
      deputy: "default",
      liaison: "outline"
    };
    return variantMap[role] || "default";
  };

  return (
    <nav className="gradient-card backdrop-blur-md border-b border-white/20 px-6 py-4 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 space-x-reverse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center animate-pulse-soft">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient font-shabnam">
                دفتر رابط
              </h1>
              <p className="text-xs text-muted-foreground font-vazir">
                سامانه آموزشی هوشمند
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4 space-x-reverse">
          {/* Theme Switcher */}
          <ThemeSwitcher />
          
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative glass hover:shadow-primary">
            <Bell className="w-5 h-5" />
            {notifications > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs p-0 animate-bounce-soft"
              >
                {notifications}
              </Badge>
            )}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-3 space-x-reverse card-hover glass">
                <Avatar className="w-8 h-8 ring-2 ring-primary/20">
                  <AvatarFallback className="gradient-primary text-white font-bold">
                    {user?.firstName?.charAt(0) || user?.nationalId?.charAt(0) || "ک"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-right">
                  <span className="text-sm font-medium font-dana">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}` 
                      : `کاربر ${user?.nationalId?.slice(-4) || 'ناشناس'}`
                    }
                  </span>
                  <Badge variant={getRoleBadgeVariant(user?.role || '')} className="text-xs font-vazir">
                    <Star className="w-3 h-3 ml-1" />
                    {getRoleText(user?.role || '')}
                  </Badge>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 glass backdrop-blur-md">
              <DropdownMenuItem className="flex items-center space-x-2 space-x-reverse font-vazir hover:bg-primary/10">
                <User className="w-4 h-4" />
                <span>پروفایل</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center space-x-2 space-x-reverse font-vazir hover:bg-primary/10">
                <Settings className="w-4 h-4" />
                <span>تنظیمات</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="flex items-center space-x-2 space-x-reverse text-red-600 hover:text-red-700 hover:bg-red-50 font-vazir"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                <span>خروج</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}