import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3,
  BookOpen,
  Calendar,
  FileText,
  GraduationCap,
  Home,
  MessageSquare,
  Users,
  Video,
  HelpCircle,
  Settings,
  Brain,
  ClipboardList,
  UserCheck
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";

interface MenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: string[];
  badge?: string;
}

const menuItems: MenuItem[] = [
  {
    label: "خانه",
    href: "/",
    icon: <Home className="w-5 h-5" />,
    roles: ["student", "teacher", "counselor", "educational_deputy", "liaison_office", "parent"]
  },
  {
    label: "داشبورد دانش‌آموز",
    href: "/dashboard/student",
    icon: <GraduationCap className="w-5 h-5" />,
    roles: ["student", "parent", "teacher", "counselor", "educational_deputy"]
  },
  {
    label: "داشبورد معلم",
    href: "/dashboard/teacher",
    icon: <Users className="w-5 h-5" />,
    roles: ["teacher", "educational_deputy"]
  },
  {
    label: "داشبورد مشاور",
    href: "/dashboard/counselor",
    icon: <MessageSquare className="w-5 h-5" />,
    roles: ["counselor", "educational_deputy"]
  },
  {
    label: "داشبورد معاون آموزشی",
    href: "/dashboard/educational-deputy",
    icon: <BarChart3 className="w-5 h-5" />,
    roles: ["educational_deputy"],
    badge: "AI"
  },
  {
    label: "داشبورد دفتر رابط",
    href: "/dashboard/liaison-office",
    icon: <FileText className="w-5 h-5" />,
    roles: ["liaison_office", "educational_deputy"]
  },
  {
    label: "داشبورد والدین",
    href: "/dashboard/parent",
    icon: <Users className="w-5 h-5" />,
    roles: ["parent"]
  },
  {
    label: "تکالیف",
    href: "/assignments",
    icon: <BookOpen className="w-5 h-5" />,
    roles: ["student", "teacher", "parent"]
  },
  {
    label: "حضور و غیاب",
    href: "/attendance",
    icon: <UserCheck className="w-5 h-5" />,
    roles: ["student", "teacher", "parent", "educational_deputy"]
  },
  {
    label: "کلاس آنلاین",
    href: "/online-classroom",
    icon: <Video className="w-5 h-5" />,
    roles: ["student", "teacher"]
  },
  {
    label: "بانک سؤال",
    href: "/question-bank",
    icon: <HelpCircle className="w-5 h-5" />,
    roles: ["teacher", "educational_deputy"]
  },
  {
    label: "آزمون‌ها",
    href: "/examinations",
    icon: <ClipboardList className="w-5 h-5" />,
    roles: ["student", "teacher", "educational_deputy"]
  }
];

export default function Sidebar() {
  const { user } = useAuth();
  const [location] = useLocation();

  const userRole = user?.role || "";
  const filteredMenuItems = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <div className="w-64 bg-white border-l border-gray-200 h-full">
      <ScrollArea className="h-full py-4">
        <div className="space-y-2 px-3">
          {filteredMenuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={location === item.href ? "secondary" : "ghost"}
                className={`w-full justify-start gap-3 ${
                  location === item.href 
                    ? "bg-primary/10 text-primary hover:bg-primary/20" 
                    : "hover:bg-gray-100"
                }`}
              >
                {item.icon}
                <span className="flex-1 text-right">{item.label}</span>
                {item.badge && (
                  <Badge variant="secondary" className="text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            </Link>
          ))}
        </div>
        
        {/* Bottom section */}
        <div className="mt-8 px-3 space-y-2">
          <Button variant="ghost" className="w-full justify-start gap-3">
            <Settings className="w-5 h-5" />
            <span className="flex-1 text-right">تنظیمات</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3">
            <HelpCircle className="w-5 h-5" />
            <span className="flex-1 text-right">راهنما</span>
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
}
