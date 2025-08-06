import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  BookOpen, 
  Calendar, 
  GraduationCap, 
  Users, 
  Video,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Bell,
  ArrowRight
} from "lucide-react";
import { Link } from "wouter";
import LoadingSpinner from "@/components/common/loading-spinner";

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "غیر مجاز",
        description: "شما از سیستم خارج شده‌اید. در حال ورود مجدد...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/auth";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const getRoleLabel = (role: string) => {
    const roleLabels = {
      student: "دانش‌آموز",
      teacher: "معلم",
      counselor: "مشاور",
      educational_deputy: "معاون آموزشی",
      liaison_office: "دفتر رابط",
      parent: "ولی",
      principal: "مدیر"
    };
    return roleLabels[role as keyof typeof roleLabels] || role;
  };

  const getQuickActions = (role: string) => {
    const actions = {
      student: [
        { label: "مشاهده تکالیف", href: "/assignments", icon: BookOpen, description: "تکالیف و پروژه‌های درسی" },
        { label: "ورود به کلاس", href: "/online-classroom", icon: Video, description: "کلاس‌های آنلاین" },
        { label: "حضور و غیاب", href: "/attendance", icon: Calendar, description: "وضعیت حضور در کلاس‌ها" },
        { label: "آزمون‌ها", href: "/examinations", icon: GraduationCap, description: "آزمون‌ها و نمرات" }
      ],
      teacher: [
        { label: "مدیریت کلاس‌ها", href: "/dashboard/teacher", icon: Users, description: "کلاس‌ها و دانش‌آموزان" },
        { label: "ایجاد تکلیف", href: "/assignments", icon: BookOpen, description: "تکالیف و پروژه‌ها" },
        { label: "بانک سؤال", href: "/question-bank", icon: GraduationCap, description: "مدیریت سؤالات" },
        { label: "کلاس آنلاین", href: "/online-classroom", icon: Video, description: "برگزاری کلاس مجازی" }
      ],
      counselor: [
        { label: "جلسات مشاوره", href: "/dashboard/counselor", icon: Users, description: "برنامه‌ریزی جلسات" },
        { label: "تحلیل عملکرد", href: "/dashboard/counselor", icon: BarChart3, description: "بررسی وضعیت دانش‌آموزان" }
      ],
      principal: [
        { label: "داشبورد مدیریت", href: "/dashboard/principal", icon: BarChart3, description: "آمار و گزارش‌ها" },
        { label: "مدیریت معلمان", href: "/dashboard/principal", icon: Users, description: "کادر آموزشی" },
        { label: "گزارش‌های کلی", href: "/dashboard/principal", icon: TrendingUp, description: "عملکرد کلی مدرسه" }
      ]
    };
    return actions[role as keyof typeof actions] || actions.student;
  };

  // Mock data for dashboard
  const mockStats = {
    student: {
      pendingAssignments: 3,
      completedAssignments: 12,
      attendanceRate: 92,
      upcomingExams: 2
    },
    teacher: {
      totalStudents: 120,
      activeClasses: 5,
      pendingGrades: 18,
      upcomingClasses: 3
    },
    principal: {
      totalStudents: 450,
      totalTeachers: 25,
      activeClasses: 30,
      monthlyAttendance: 88
    }
  };

  const getCurrentStats = () => {
    if (user?.role === 'teacher' || user?.role === 'principal') {
      return mockStats[user.role] || mockStats.teacher;
    }
    return mockStats.student;
  };

  const getStatCards = (role: string) => {
    const stats = getCurrentStats();
    
    if (role === 'student') {
      return [
        { label: "تکالیف باقی‌مانده", value: stats.pendingAssignments, icon: BookOpen, color: "text-orange-600" },
        { label: "تکالیف تکمیل شده", value: stats.completedAssignments, icon: CheckCircle2, color: "text-green-600" },
        { label: "درصد حضور", value: `${stats.attendanceRate}%`, icon: Calendar, color: "text-blue-600" },
        { label: "آزمون‌های پیش رو", value: stats.upcomingExams, icon: GraduationCap, color: "text-purple-600" }
      ];
    } else if (role === 'teacher') {
      return [
        { label: "کل دانش‌آموزان", value: stats.totalStudents, icon: Users, color: "text-blue-600" },
        { label: "کلاس‌های فعال", value: stats.activeClasses, icon: Video, color: "text-green-600" },
        { label: "نمرات معلق", value: stats.pendingGrades, icon: GraduationCap, color: "text-orange-600" },
        { label: "کلاس‌های آینده", value: stats.upcomingClasses, icon: Clock, color: "text-purple-600" }
      ];
    } else {
      return [
        { label: "کل دانش‌آموزان", value: stats.totalStudents, icon: Users, color: "text-blue-600" },
        { label: "کل معلمان", value: stats.totalTeachers, icon: Users, color: "text-green-600" },
        { label: "کلاس‌های فعال", value: stats.activeClasses, icon: Video, color: "text-orange-600" },
        { label: "حضور ماهانه", value: `${stats.monthlyAttendance}%`, icon: TrendingUp, color: "text-purple-600" }
      ];
    }
  };

  const quickActions = getQuickActions(user?.role || "student");
  const statCards = getStatCards(user?.role || "student");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    خوش آمدید، {user?.firstName} {user?.lastName}
                  </h1>
                  <div className="flex items-center gap-2">
                    <p className="text-gray-600">
                      {getRoleLabel(user?.role || "")}
                    </p>
                    {user?.isTrialActive && (
                      <Badge variant="outline" className="text-xs">
                        دوره آزمایشی
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Bell className="w-4 h-4" />
                    اعلان‌ها
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              {statCards.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                          <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                        </div>
                        <Icon className={`w-8 h-8 ${stat.color.replace('text-', 'text-')}`} />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowRight className="w-5 h-5" />
                    دسترسی سریع
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4">
                    {quickActions.map((action, index) => {
                      const Icon = action.icon;
                      return (
                        <Link key={index} href={action.href}>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start gap-3 h-auto p-4"
                          >
                            <Icon className="w-5 h-5" />
                            <div className="text-left">
                              <div className="font-medium">{action.label}</div>
                              <div className="text-xs text-gray-500">{action.description}</div>
                            </div>
                          </Button>
                        </Link>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity or Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    آخرین فعالیت‌ها
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <BookOpen className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">تکلیف جدید ریاضی</p>
                        <p className="text-xs text-gray-500">2 ساعت پیش</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">حضور در کلاس فیزیک ثبت شد</p>
                        <p className="text-xs text-gray-500">4 ساعت پیش</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">مهلت تحویل پروژه شیمی</p>
                        <p className="text-xs text-gray-500">فردا</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Current Time and Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  برنامه امروز
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                    <Video className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="font-medium">کلاس ریاضی</p>
                      <p className="text-sm text-gray-500">10:00 - 11:30</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                    <GraduationCap className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-medium">آزمون فیزیک</p>
                      <p className="text-sm text-gray-500">14:00 - 15:30</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                    <BookOpen className="w-6 h-6 text-purple-600" />
                    <div>
                      <p className="font-medium">مهلت تحویل انشا</p>
                      <p className="text-sm text-gray-500">تا پایان روز</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}