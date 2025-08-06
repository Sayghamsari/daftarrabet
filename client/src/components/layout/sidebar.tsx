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
  School
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
        { label: "تکالیف", href: "/assignments", icon: BookOpen },
        { label: "حضور و غیاب", href: "/attendance", icon: Calendar },
        { label: "کلاس آنلاین", href: "/online-classroom", icon: Video },
        { label: "آزمون‌ها", href: "/examinations", icon: GraduationCap },
        { label: "عملکرد", href: "/dashboard/student", icon: BarChart3 },
      ],
      teacher: [
        ...commonItems,
        { label: "داشبورد", href: "/dashboard/teacher", icon: BarChart3 },
        { label: "کلاس‌ها", href: "/dashboard/teacher", icon: Users },
        { label: "تکالیف", href: "/assignments", icon: BookOpen },
        { label: "حضور و غیاب", href: "/attendance", icon: UserCheck },
        { label: "بانک سؤال", href: "/question-bank", icon: GraduationCap },
        { label: "آزمون‌ها", href: "/examinations", icon: ClipboardList },
        { label: "کلاس آنلاین", href: "/online-classroom", icon: Video },
      ],
      counselor: [
        ...commonItems,
        { label: "داشبورد", href: "/dashboard/counselor", icon: BarChart3 },
        { label: "جلسات مشاوره", href: "/dashboard/counselor", icon: MessageSquare },
        { label: "تحلیل عملکرد", href: "/dashboard/counselor", icon: Brain },
      ],
      educational_deputy: [
        ...commonItems,
        { label: "داشبورد تحلیلی", href: "/dashboard/educational-deputy", icon: BarChart3 },
        { label: "نظارت بر کلاس‌ها", href: "/dashboard/educational-deputy", icon: Users },
        { label: "گزارش‌گیری", href: "/dashboard/educational-deputy", icon: FileText },
      ],
      liaison_office: [
        ...commonItems,
        { label: "داشبورد", href: "/dashboard/liaison-office", icon: BarChart3 },
        { label: "مدیریت رویدادها", href: "/dashboard/liaison-office", icon: Calendar },
        { label: "ثبت‌نام جدید", href: "/dashboard/liaison-office", icon: Users },
      ],
      parent: [
        ...commonItems,
        { label: "عملکرد فرزند", href: "/dashboard/parent", icon: BarChart3 },
        { label: "حضور و غیاب", href: "/attendance", icon: Calendar },
        { label: "تکالیف", href: "/assignments", icon: BookOpen },
      ],
      principal: [
        ...commonItems,
        { label: "داشبورد مدیریت", href: "/dashboard/principal", icon: BarChart3 },
        { label: "مدیریت مدرسه", href: "/dashboard/principal", icon: School },
        { label: "معلمان", href: "/dashboard/principal", icon: Users },
        { label: "گزارش‌های کلی", href: "/dashboard/principal", icon: FileText },
      ]
    };

    return roleMenus[role as keyof typeof roleMenus] || commonItems;
  };

  const menuItems = getMenuItems(user?.role || "student");

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen">
      <ScrollArea className="h-full">
        <div className="p-6">
          <div className="space-y-6">
            {/* User Info */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-primary">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-sm text-gray-500">{user?.email}</p>
              {user?.isTrialActive && (
                <Badge variant="outline" className="mt-2 text-xs">
                  دوره آزمایشی
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
                        "w-full justify-start gap-3",
                        isActive && "bg-primary text-primary-foreground"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>

            <Separator />

            {/* Bottom Actions */}
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start gap-3">
                <Settings className="w-5 h-5" />
                تنظیمات
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3">
                <HelpCircle className="w-5 h-5" />
                راهنما
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}