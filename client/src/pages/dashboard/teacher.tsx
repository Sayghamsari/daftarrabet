import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/common/loading-spinner";
import EmptyState from "@/components/common/empty-state";
import { 
  Users, 
  BookOpen, 
  ClipboardList, 
  TrendingUp,
  Plus,
  Calendar,
  FileText,
  CheckCircle
} from "lucide-react";
import { Link } from "wouter";

export default function TeacherDashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const params = useParams();
  
  const teacherId = params.id || user?.id;

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

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ["/api/dashboard/teacher", teacherId],
    enabled: !!teacherId && isAuthenticated,
    retry: false,
  });

  if (authLoading || isLoading) {
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

  const classes = dashboardData?.classes || [];
  const assignments = dashboardData?.assignments || [];
  const examinations = dashboardData?.examinations || [];

  // Calculate stats
  const totalStudents = classes.reduce((sum, cls) => sum + (cls.studentCount || 0), 0);
  const pendingGradings = assignments.filter(a => !a.isGraded).length;
  const upcomingExams = examinations.filter(e => new Date(e.scheduledAt) > new Date()).length;

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
                <h1 className="text-3xl font-bold text-gray-900">داشبورد معلم</h1>
                <p className="text-gray-600 mt-1">مدیریت کلاس‌ها و تکالیف</p>
              </div>
              <Badge className="bg-green-100 text-green-800">
                <Users className="w-4 h-4 ml-1" />
                معلم
              </Badge>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-4 gap-4">
              <Link href="/assignments">
                <Button className="w-full h-16 bg-blue-500 hover:bg-blue-600 text-white">
                  <div className="text-center">
                    <Plus className="w-6 h-6 mx-auto mb-1" />
                    <span className="text-sm">تکلیف جدید</span>
                  </div>
                </Button>
              </Link>
              
              <Link href="/examinations">
                <Button className="w-full h-16 bg-green-500 hover:bg-green-600 text-white">
                  <div className="text-center">
                    <ClipboardList className="w-6 h-6 mx-auto mb-1" />
                    <span className="text-sm">آزمون جدید</span>
                  </div>
                </Button>
              </Link>

              <Link href="/attendance">
                <Button className="w-full h-16 bg-orange-500 hover:bg-orange-600 text-white">
                  <div className="text-center">
                    <Calendar className="w-6 h-6 mx-auto mb-1" />
                    <span className="text-sm">ثبت حضور</span>
                  </div>
                </Button>
              </Link>

              <Link href="/question-bank">
                <Button className="w-full h-16 bg-purple-500 hover:bg-purple-600 text-white">
                  <div className="text-center">
                    <FileText className="w-6 h-6 mx-auto mb-1" />
                    <span className="text-sm">بانک سؤال</span>
                  </div>
                </Button>
              </Link>
            </div>

            {/* Stats Overview */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">تعداد کلاس‌ها</p>
                      <p className="text-2xl font-bold text-blue-600">{classes.length}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">کل دانش‌آموزان</p>
                      <p className="text-2xl font-bold text-green-600">{totalStudents}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">تکالیف بدون نمره</p>
                      <p className="text-2xl font-bold text-orange-600">{pendingGradings}</p>
                    </div>
                    <BookOpen className="w-8 h-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">آزمون‌های آتی</p>
                      <p className="text-2xl font-bold text-purple-600">{upcomingExams}</p>
                    </div>
                    <ClipboardList className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Classes and Recent Activities */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* My Classes */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    کلاس‌های من
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {classes.length > 0 ? (
                    <div className="space-y-4">
                      {classes.map((cls) => (
                        <div key={cls.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <h3 className="font-medium text-gray-900">{cls.name}</h3>
                            <p className="text-sm text-gray-500">
                              {cls.subject} - پایه {cls.grade}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {cls.studentCount || 0} دانش‌آموز
                            </Badge>
                            <Button size="sm" variant="outline">
                              مشاهده
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title="کلاسی تعریف نشده"
                      description="هنوز کلاسی برای شما تعریف نشده است"
                      icon={<Users className="w-12 h-12" />}
                    />
                  )}
                </CardContent>
              </Card>

              {/* Recent Assignments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    آخرین تکالیف
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {assignments.length > 0 ? (
                    <div className="space-y-4">
                      {assignments.slice(0, 5).map((assignment) => (
                        <div key={assignment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{assignment.title}</p>
                            <p className="text-sm text-gray-500">
                              مهلت: {new Date(assignment.dueDate).toLocaleDateString('fa-IR')}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {assignment.isPublished ? (
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="w-3 h-3 ml-1" />
                                منتشر شده
                              </Badge>
                            ) : (
                              <Badge variant="outline">
                                پیش‌نویس
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title="تکلیفی وجود ندارد"
                      description="شما هنوز تکلیفی ایجاد نکرده‌اید"
                      icon={<BookOpen className="w-12 h-12" />}
                      actionLabel="ایجاد تکلیف جدید"
                      onAction={() => window.location.href = '/assignments'}
                    />
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Examinations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="w-5 h-5" />
                  آزمون‌های آتی
                </CardTitle>
              </CardHeader>
              <CardContent>
                {examinations.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {examinations
                      .filter(exam => new Date(exam.scheduledAt) > new Date())
                      .slice(0, 6)
                      .map((exam) => (
                        <div key={exam.id} className="p-4 bg-gray-50 rounded-lg">
                          <h3 className="font-medium text-gray-900 mb-2">{exam.title}</h3>
                          <p className="text-sm text-gray-500 mb-2">
                            {new Date(exam.scheduledAt).toLocaleDateString('fa-IR')}
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">
                              {exam.duration} دقیقه
                            </Badge>
                            <Badge className={exam.isPublished ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                              {exam.isPublished ? "منتشر شده" : "در انتظار"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <EmptyState
                    title="آزمونی برنامه‌ریزی نشده"
                    description="شما هنوز آزمونی برنامه‌ریزی نکرده‌اید"
                    icon={<ClipboardList className="w-12 h-12" />}
                    actionLabel="ایجاد آزمون جدید"
                    onAction={() => window.location.href = '/examinations'}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
