import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  toPersianNumber, 
  formatPersianDate, 
  formatPersianTime, 
  formatPersianPercentage,
  formatPersianDuration,
  formatPersianCount
} from "@/lib/persian-utils";
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
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <h1 className="text-4xl font-bold text-gradient font-shabnam animate-float">
                    خوش آمدید، {user?.firstName} {user?.lastName}
                  </h1>
                  <div className="flex items-center gap-3">
                    <p className="text-muted-foreground font-vazir text-lg">
                      {getRoleLabel(user?.role || "")}
                    </p>
                    {user?.isTrialActive && (
                      <Badge variant="outline" className="text-xs font-dana bg-primary/10 text-primary border-primary/30">
                        دوره آزمایشی ۱۴ روزه
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <span className="text-sm text-primary font-dana">
                      داشبورد {getRoleLabel(user?.role || "")}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="gap-2 font-dana hover:bg-primary/10">
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
                  <Card key={index} className="card-gradient card-hover">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground font-vazir">{stat.label}</p>
                          <p className={`text-3xl font-bold text-gradient font-dana persian-nums`}>
                            {typeof stat.value === 'string' && stat.value.includes('%') 
                              ? formatPersianPercentage(parseInt(stat.value))
                              : toPersianNumber(stat.value)
                            }
                          </p>
                        </div>
                        <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center animate-bounce-soft">
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              <Card className="card-gradient">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gradient font-shabnam">
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
                            className="w-full justify-start gap-3 h-auto p-4 hover:bg-primary/10 border-primary/20 font-vazir"
                          >
                            <div className="w-10 h-10 gradient-primary rounded-lg flex items-center justify-center">
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-right flex-1">
                              <div className="font-semibold font-dana">{action.label}</div>
                              <div className="text-xs text-muted-foreground font-vazir">{action.description}</div>
                            </div>
                          </Button>
                        </Link>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity or Notifications */}
              <Card className="card-gradient">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gradient font-shabnam">
                    <Bell className="w-5 h-5" />
                    آخرین فعالیت‌ها
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 glass rounded-xl backdrop-blur-sm border border-primary/20">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-blue-600 mt-0.5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold font-vazir">تکلیف جدید ریاضی</p>
                        <p className="text-xs text-muted-foreground font-dana">{toPersianNumber(2)} ساعت پیش</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 glass rounded-xl backdrop-blur-sm border border-green-200/30">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold font-vazir">حضور در کلاس فیزیک ثبت شد</p>
                        <p className="text-xs text-muted-foreground font-dana">{toPersianNumber(4)} ساعت پیش</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 glass rounded-xl backdrop-blur-sm border border-orange-200/30">
                      <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold font-vazir">مهلت تحویل پروژه شیمی</p>
                        <p className="text-xs text-muted-foreground font-dana">فردا</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Current Time and Schedule */}
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gradient font-shabnam">
                  <Calendar className="w-5 h-5" />
                  برنامه امروز
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-4 glass rounded-xl backdrop-blur-sm border border-blue-200/30">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <Video className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold font-vazir">کلاس ریاضی</p>
                      <p className="text-sm text-muted-foreground font-dana">{formatPersianTime("10:00")} - {formatPersianTime("11:30")}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 glass rounded-xl backdrop-blur-sm border border-green-200/30">
                    <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold font-vazir">آزمون فیزیک</p>
                      <p className="text-sm text-muted-foreground font-dana">{formatPersianTime("14:00")} - {formatPersianTime("15:30")}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 glass rounded-xl backdrop-blur-sm border border-purple-200/30">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold font-vazir">مهلت تحویل انشا</p>
                      <p className="text-sm text-muted-foreground font-dana">تا پایان روز</p>
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