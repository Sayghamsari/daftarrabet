import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "wouter";
import {
  Home,
  BookOpen,
  Calendar,
  Users,
  Video,
  GraduationCap,
  BarChart3,
  FileText,
  MessageSquare,
  Settings,
  HelpCircle,
  Brain,
  ClipboardList,
  UserCheck,
  School,
  Smartphone,
  TrendingUp,
  PlusCircle,
  Shield,
  Award,
  UserPlus,
  CreditCard,
  AlertTriangle,
  Bell,
  LogOut,
  User
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const { user } = useAuth();
  const [location] = useLocation();

  const getMenuItems = (role: string) => {
    const commonItems = [
      { label: "خانه", href: "/", icon: Home },
    ];

    const roleMenus = {
      student: [
        ...commonItems,
        { label: "برنامه روزانه", href: "/daily-schedule", icon: Calendar },
        { label: "برنامه هفتگی", href: "/weekly-schedule", icon: Calendar },
        { label: "تکالیف", href: "/assignments", icon: BookOpen },
        { label: "حضور و غیاب", href: "/attendance", icon: Calendar },
        { label: "توجیه غیبت", href: "/absence-justification", icon: FileText },
        { label: "کلاس آنلاین", href: "/online-classroom", icon: Video },
        { label: "آزمون‌ها", href: "/examinations", icon: GraduationCap },
        { label: "برنامه امتحانات", href: "/exam-schedule", icon: GraduationCap },
        { label: "پیام به معلمان", href: "/teacher-messaging", icon: MessageSquare },
        { label: "اهداف تحصیلی", href: "/educational-goals", icon: TrendingUp },
        { label: "عملکرد", href: "/dashboard/student", icon: BarChart3 },
        { label: "اعلانات", href: "/notifications", icon: Bell },
      ],
      teacher: [
        ...commonItems,
        { label: "داشبورد معلم", href: "/dashboard/teacher", icon: BarChart3 },
        { label: "کلاس‌های من", href: "/dashboard/teacher", icon: Users },
        { label: "برنامه هفتگی", href: "/weekly-schedule", icon: Calendar },
        { label: "برنامه امتحانات", href: "/exam-schedule", icon: GraduationCap },
        { label: "تکالیف و نمرات", href: "/assignments", icon: BookOpen },
        { label: "حضور و غیاب", href: "/attendance", icon: UserCheck },
        { label: "بانک سؤال", href: "/question-bank", icon: Brain },
        { label: "آزمون‌ها", href: "/examinations", icon: ClipboardList },
        { label: "کلاس آنلاین", href: "/online-classroom", icon: Video },
        { label: "مدیریت نمرات", href: "/grade-dashboard", icon: TrendingUp },
        { label: "پیام‌ها", href: "/teacher-messaging", icon: MessageSquare },
        { label: "سازنده آزمون", href: "/exam-builder-dashboard", icon: PlusCircle },
        { label: "پیام‌رسانی SMS", href: "/sms-dashboard", icon: Smartphone },
        { label: "اعلانات", href: "/notifications", icon: Bell },
      ],
      counselor: [
        ...commonItems,
        { label: "داشبورد مشاور", href: "/dashboard/counselor", icon: BarChart3 },
        { label: "جلسات مشاوره", href: "/dashboard/counselor", icon: MessageSquare },
        { label: "دانش‌آموزان من", href: "/students", icon: Users },
        { label: "تحلیل عملکرد", href: "/dashboard/counselor", icon: Brain },
        { label: "پیام‌ها", href: "/teacher-messaging", icon: MessageSquare },
        { label: "حضور و غیاب", href: "/attendance", icon: Calendar },
        { label: "گزارش‌گیری", href: "/report-cards", icon: FileText },
        { label: "پیام‌رسانی SMS", href: "/sms-dashboard", icon: Smartphone },
        { label: "اعلانات", href: "/notifications", icon: Bell },
      ],
      educational_deputy: [
        ...commonItems,
        { label: "داشبورد معاون آموزش", href: "/dashboard/educational-deputy", icon: BarChart3 },
        { label: "نظارت بر کلاس‌ها", href: "/dashboard/educational-deputy", icon: Users },
        { label: "معلمان", href: "/dashboard/teacher", icon: Users },
        { label: "برنامه امتحانات", href: "/exam-schedule", icon: GraduationCap },
        { label: "مدیریت نمرات", href: "/grade-dashboard", icon: TrendingUp },
        { label: "سازنده آزمون", href: "/exam-builder-dashboard", icon: PlusCircle },
        { label: "پیام‌ها", href: "/teacher-messaging", icon: MessageSquare },
        { label: "گزارش‌گیری", href: "/report-cards", icon: FileText },
        { label: "پیام‌رسانی SMS", href: "/sms-dashboard", icon: Smartphone },
        { label: "اعلانات", href: "/notifications", icon: Bell },
      ],
      liaison_office: [
        ...commonItems,
        { label: "داشبورد", href: "/dashboard/liaison-office", icon: BarChart3 },
        { label: "مدیریت رویدادها", href: "/dashboard/liaison-office", icon: Calendar },
        { label: "ثبت‌نام جدید", href: "/dashboard/liaison-office", icon: Users },
        { label: "پیام‌رسانی SMS", href: "/sms-dashboard", icon: Smartphone },
      ],
      parent: [
        ...commonItems,
        { label: "داشبورد ولی", href: "/dashboard/parent", icon: BarChart3 },
        { label: "عملکرد فرزند", href: "/dashboard/parent", icon: TrendingUp },
        { label: "حضور و غیاب", href: "/attendance", icon: Calendar },
        { label: "تکالیف فرزند", href: "/assignments", icon: BookOpen },
        { label: "برنامه امتحانات", href: "/exam-schedule", icon: GraduationCap },
        { label: "پیام‌ها", href: "/teacher-messaging", icon: MessageSquare },
        { label: "کارنامه", href: "/report-cards", icon: FileText },
        { label: "پرداخت شهریه", href: "/tuition-warnings", icon: CreditCard },
        { label: "اعلانات", href: "/notifications", icon: Bell },
      ],
      principal: [
        ...commonItems,
        { label: "داشبورد مدیریت", href: "/dashboard/principal", icon: BarChart3 },
        { label: "مدیریت مدرسه", href: "/dashboard/principal", icon: School },
        { label: "معلمان", href: "/dashboard/principal", icon: Users },
        { label: "گزارش‌های کلی", href: "/dashboard/principal", icon: FileText },
        { label: "تخصیص دانش‌آموزان", href: "/student-teacher-assignments", icon: UserPlus },
        { label: "امور انضباطی", href: "/disciplinary-dashboard", icon: Shield },
        { label: "کارت امتیاز", href: "/achievements-dashboard", icon: Award },
        { label: "کارنامه انضباط", href: "/report-cards", icon: FileText },
        { label: "اعلانات", href: "/notifications", icon: Bell },
      ],
      vice_principal: [
        ...commonItems,
        { label: "داشبورد معاونت", href: "/dashboard/vice-principal", icon: BarChart3 },
        { label: "نظارت بر کلاس‌ها", href: "/dashboard/vice-principal", icon: Users },
        { label: "گزارش‌گیری", href: "/dashboard/vice-principal", icon: FileText },
        { label: "تخصیص دانش‌آموزان", href: "/student-teacher-assignments", icon: UserPlus },
        { label: "امور انضباطی", href: "/disciplinary-dashboard", icon: Shield },
        { label: "کارت امتیاز", href: "/achievements-dashboard", icon: Award },
        { label: "هشدار شهریه", href: "/tuition-warnings", icon: CreditCard },
        { label: "کارنامه انضباط", href: "/report-cards", icon: FileText },
        { label: "اعلانات", href: "/notifications", icon: Bell },
      ]
    };

    return roleMenus[role as keyof typeof roleMenus] || commonItems;
  };

  const menuItems = getMenuItems(user?.role || "student");

  return (
    <div className="w-64 glass border-r border-primary/20 h-screen backdrop-blur-md">
      <ScrollArea className="h-full">
        <div className="p-6">
          <div className="space-y-6">
            {/* User Info */}
            <div className="text-center">
              <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-3 animate-bounce-soft">
                <span className="text-lg font-bold text-white font-dana">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </span>
              </div>
              <h3 className="font-semibold text-gradient font-shabnam">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-sm text-muted-foreground font-vazir">{user?.email}</p>
              {user?.isTrialActive && (
                <Badge variant="outline" className="mt-2 text-xs font-dana bg-primary/10 text-primary border-primary/30">
                  دوره آزمایشی ۱۴ روزه
                </Badge>
              )}
            </div>

            <Separator />

            {/* Navigation Menu */}
            <nav className="space-y-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = location === item.href;
                
                return (
                  <Link key={index} href={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3 font-vazir card-hover",
                        isActive ? "btn-gradient text-white shadow-primary" : "hover:bg-primary/10 text-muted-foreground"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center",
                        isActive ? "bg-white/20" : "bg-primary/10"
                      )}>
                        <Icon className="w-5 h-5" />
                      </div>
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>

            <Separator />

            {/* Bottom Actions */}
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start gap-3 font-vazir hover:bg-primary/10 text-muted-foreground">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Settings className="w-5 h-5" />
                </div>
                تنظیمات
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 font-vazir hover:bg-primary/10 text-muted-foreground">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <HelpCircle className="w-5 h-5" />
                </div>
                راهنما
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 font-vazir hover:bg-red-50 text-red-600 hover:text-red-700"
                onClick={() => {
                  // Call logout API or redirect to login
                  window.location.href = '/auth';
                }}
              >
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <LogOut className="w-5 h-5" />
                </div>
                خروج از سیستم
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}