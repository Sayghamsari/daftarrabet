import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import AnalyticsDashboard from "@/components/ai/analytics-dashboard";
import PerformanceChart from "@/components/ai/performance-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/common/loading-spinner";
import { 
  BarChart3, 
  Users, 
  GraduationCap, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Brain,
  BookOpen,
  Calendar
} from "lucide-react";

export default function EducationalDeputyDashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const params = useParams();
  
  const deputyId = params.id || user?.id;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
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
  }, [isAuthenticated, authLoading, toast]);

  // Mock data for demonstration - in real app this would come from API
  const schoolStats = {
    totalStudents: 1250,
    totalTeachers: 65,
    totalClasses: 42,
    averagePerformance: 78.5,
    attendanceRate: 92.3,
    activeOnlineClasses: 8
  };

  const performanceData = [
    { name: 'مهر', value: 75 },
    { name: 'آبان', value: 78 },
    { name: 'آذر', value: 82 },
    { name: 'دی', value: 79 },
    { name: 'بهمن', value: 85 }
  ];

  const gradePerformance = [
    { name: 'پایه 7', value: 82 },
    { name: 'پایه 8', value: 78 },
    { name: 'پایه 9', value: 85 },
    { name: 'پایه 10', value: 74 },
    { name: 'پایه 11', value: 79 },
    { name: 'پایه 12', value: 88 }
  ];

  const subjectDistribution = [
    { name: 'ریاضی', value: 25 },
    { name: 'علوم', value: 20 },
    { name: 'ادبیات', value: 18 },
    { name: 'زبان', value: 15 },
    { name: 'سایر', value: 22 }
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="flex items-center justify-center h-64">
              <LoadingSpinner />
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">داشبورد معاون آموزشی</h1>
                <p className="text-gray-600 mt-1">نمای کلی از وضعیت آموزشی مدرسه با تحلیل‌های هوشمند</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-100 text-purple-800">
                  <BarChart3 className="w-4 h-4 ml-1" />
                  معاون آموزشی
                </Badge>
                <Badge className="bg-blue-100 text-blue-800">
                  <Brain className="w-4 h-4 ml-1" />
                  AI Analytics
                </Badge>
              </div>
            </div>

            {/* Overview Stats */}
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <GraduationCap className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">{schoolStats.totalStudents}</p>
                    <p className="text-sm text-gray-600">کل دانش‌آموزان</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">{schoolStats.totalTeachers}</p>
                    <p className="text-sm text-gray-600">معلمان</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <BookOpen className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-600">{schoolStats.totalClasses}</p>
                    <p className="text-sm text-gray-600">کلاس‌ها</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <TrendingUp className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-orange-600">{schoolStats.averagePerformance}%</p>
                    <p className="text-sm text-gray-600">میانگین عملکرد</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <Calendar className="w-8 h-8 text-teal-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-teal-600">{schoolStats.attendanceRate}%</p>
                    <p className="text-sm text-gray-600">نرخ حضور</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <CheckCircle className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-indigo-600">{schoolStats.activeOnlineClasses}</p>
                    <p className="text-sm text-gray-600">کلاس آنلاین فعال</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Alerts and Notifications */}
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                    <div>
                      <h3 className="font-semibold text-red-800">هشدارهای هوشمند</h3>
                      <p className="text-sm text-red-600">5 دانش‌آموز در معرض ریزش</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Clock className="w-8 h-8 text-yellow-500" />
                    <div>
                      <h3 className="font-semibold text-yellow-800">تکالیف عقب‌مانده</h3>
                      <p className="text-sm text-yellow-600">12 تکلیف بدون نمره</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Brain className="w-8 h-8 text-blue-500" />
                    <div>
                      <h3 className="font-semibold text-blue-800">تحلیل‌های جدید</h3>
                      <p className="text-sm text-blue-600">3 گزارش AI جدید</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              <PerformanceChart 
                data={performanceData}
                type="line"
                title="روند عملکرد ماهانه مدرسه"
              />
              <PerformanceChart 
                data={gradePerformance}
                type="bar"
                title="عملکرد به تفکیک پایه تحصیلی"
              />
            </div>

            {/* Subject Distribution and Recent Activities */}
            <div className="grid lg:grid-cols-3 gap-6">
              <PerformanceChart 
                data={subjectDistribution}
                type="pie"
                title="توزیع دروس"
              />
              
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    آخرین فعالیت‌های مدرسه
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-800">آزمون ریاضی پایه نهم برگزار شد</p>
                        <p className="text-sm text-green-600">2 ساعت پیش</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <BookOpen className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-800">5 تکلیف جدید ایجاد شد</p>
                        <p className="text-sm text-blue-600">4 ساعت پیش</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-orange-800">غیبت غیرموجه در کلاس شیمی</p>
                        <p className="text-sm text-orange-600">6 ساعت پیش</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                      <Users className="w-5 h-5 text-purple-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-purple-800">جلسه هیئت علمی برگزار شد</p>
                        <p className="text-sm text-purple-600">1 روز پیش</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Analytics Dashboard */}
            {deputyId && (
              <AnalyticsDashboard 
                entityType="school"
                entityId={user?.schoolId || "school-1"}
              />
            )}

            {/* Teacher Performance Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  عملکرد معلمان
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">معلمان برتر</h4>
                    <div className="space-y-2">
                      <p className="text-sm text-green-600">احمد محمدی - ریاضی</p>
                      <p className="text-sm text-green-600">فاطمه کریمی - فیزیک</p>
                      <p className="text-sm text-green-600">علی رضایی - شیمی</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">میانگین نمره‌دهی</h4>
                    <p className="text-2xl font-bold text-blue-600">16.8</p>
                    <p className="text-sm text-blue-600">از 20</p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-800 mb-2">کلاس‌های فعال</h4>
                    <p className="text-2xl font-bold text-purple-600">38</p>
                    <p className="text-sm text-purple-600">از 42 کلاس</p>
                  </div>
                  
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-medium text-orange-800 mb-2">نیاز به بررسی</h4>
                    <p className="text-2xl font-bold text-orange-600">3</p>
                    <p className="text-sm text-orange-600">معلم</p>
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
