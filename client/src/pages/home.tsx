import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
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
  AlertTriangle
} from "lucide-react";
import { Link } from "wouter";

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
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
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
      parent: "ولی"
    };
    return roleLabels[role as keyof typeof roleLabels] || role;
  };

  const getDashboardLink = (role: string) => {
    return `/dashboard/${role.replace('_', '-')}`;
  };

  const getQuickActions = (role: string) => {
    const actions = {
      student: [
        { label: "مشاهده تکالیف", href: "/assignments", icon: <BookOpen className="w-5 h-5" /> },
        { label: "ورود به کلاس", href: "/online-classroom", icon: <Video className="w-5 h-5" /> },
        { label: "حضور و غیاب", href: "/attendance", icon: <Calendar className="w-5 h-5" /> }
      ],
      teacher: [
        { label: "مدیریت کلاس‌ها", href: "/dashboard/teacher", icon: <Users className="w-5 h-5" /> },
        { label: "ایجاد تکلیف", href: "/assignments", icon: <BookOpen className="w-5 h-5" /> },
        { label: "بانک سؤال", href: "/question-bank", icon: <GraduationCap className="w-5 h-5" /> }
      ],
      counselor: [
        { label: "جلسات مشاوره", href: "/dashboard/counselor", icon: <Users className="w-5 h-5" /> },
        { label: "تحلیل عملکرد", href: "/dashboard/counselor", icon: <BarChart3 className="w-5 h-5" /> }
      ],
      educational_deputy: [
        { label: "داشبورد تحلیلی", href: "/dashboard/educational-deputy", icon: <BarChart3 className="w-5 h-5" /> },
        { label: "نظارت بر کلاس‌ها", href: "/dashboard/educational-deputy", icon: <Users className="w-5 h-5" /> }
      ],
      liaison_office: [
        { label: "مدیریت رویدادها", href: "/dashboard/liaison-office", icon: <Calendar className="w-5 h-5" /> },
        { label: "ثبت‌نام جدید", href: "/dashboard/liaison-office", icon: <Users className="w-5 h-5" /> }
      ],
      parent: [
        { label: "عملکرد فرزند", href: "/dashboard/parent", icon: <BarChart3 className="w-5 h-5" /> },
        { label: "حضور و غیاب", href: "/attendance", icon: <Calendar className="w-5 h-5" /> }
      ]
    };
    return actions[role as keyof typeof actions] || [];
  };

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
                    <Badge className="bg-primary/10 text-primary">
                      {getRoleLabel(user?.role || "")}
                    </Badge>
                    {user?.isTrialActive && (
                      <Badge variant="outline" className="text-orange-600 border-orange-300">
                        <Clock className="w-3 h-3 ml-1" />
                        دوره آزمایشی
                      </Badge>
                    )}
                  </div>
                </div>
                <Link href={getDashboardLink(user?.role || "")}>
                  <Button className="gap-2">
                    <BarChart3 className="w-4 h-4" />
                    مشاهده داشبورد
                  </Button>
                </Link>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">وضعیت امروز</p>
                      <p className="text-2xl font-bold text-green-600">فعال</p>
                    </div>
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">کلاس‌های امروز</p>
                      <p className="text-2xl font-bold text-blue-600">4</p>
                    </div>
                    <Calendar className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">تکالیف در انتظار</p>
                      <p className="text-2xl font-bold text-orange-600">2</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">عملکرد کلی</p>
                      <p className="text-2xl font-bold text-purple-600">85%</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">دسترسی سریع</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {getQuickActions(user?.role || "").map((action, index) => (
                      <Link key={index} href={action.href}>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start gap-3 hover:bg-primary/5"
                        >
                          {action.icon}
                          {action.label}
                        </Button>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">آخرین فعالیت‌ها</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">ورود به کلاس ریاضی</p>
                        <p className="text-xs text-gray-500">30 دقیقه پیش</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">ارسال تکلیف فیزیک</p>
                        <p className="text-xs text-gray-500">2 ساعت پیش</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">دریافت پیام از معلم</p>
                        <p className="text-xs text-gray-500">5 ساعت پیش</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Trial Info */}
            {user?.isTrialActive && (
              <Card className="mt-8 bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-orange-800 mb-2">
                        دوره آزمایشی 14 روزه
                      </h3>
                      <p className="text-orange-700">
                        شما در حال استفاده از نسخه آزمایشی هستید. برای ادامه استفاده از تمام امکانات، لطفاً اشتراک خود را تمدید کنید.
                      </p>
                    </div>
                    <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-200">
                      مشاهده پلان‌ها
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
