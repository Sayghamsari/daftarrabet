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
import { Progress } from "@/components/ui/progress";
import LoadingSpinner from "@/components/common/loading-spinner";
import EmptyState from "@/components/common/empty-state";
import { 
  BookOpen, 
  Calendar, 
  GraduationCap, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function StudentDashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const params = useParams();
  
  // Get student ID from params or use current user ID
  const studentId = params.id || user?.id;

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
    queryKey: ["/api/dashboard/student", studentId],
    enabled: !!studentId && isAuthenticated,
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

  const assignments = dashboardData?.assignments || [];
  const attendance = dashboardData?.attendance || [];
  const analytics = dashboardData?.analytics || [];

  // Calculate stats
  const completedAssignments = assignments.filter(a => a.isGraded).length;
  const pendingAssignments = assignments.filter(a => !a.isGraded).length;
  const averageScore = assignments.length > 0 
    ? assignments.filter(a => a.score).reduce((sum, a) => sum + parseFloat(a.score), 0) / assignments.filter(a => a.score).length
    : 0;

  const attendanceRate = attendance.length > 0
    ? (attendance.filter(a => a.status === 'present' || a.status === 'late').length / attendance.length) * 100
    : 0;

  // Sample chart data
  const performanceData = [
    { name: 'هفته 1', value: 85 },
    { name: 'هفته 2', value: 90 },
    { name: 'هفته 3', value: 78 },
    { name: 'هفته 4', value: 92 },
    { name: 'هفته 5', value: 88 }
  ];

  const subjectData = [
    { name: 'ریاضی', value: 92 },
    { name: 'فیزیک', value: 85 },
    { name: 'شیمی', value: 88 },
    { name: 'زبان', value: 95 }
  ];

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
                <h1 className="text-3xl font-bold text-gray-900">داشبورد دانش‌آموز</h1>
                <p className="text-gray-600 mt-1">نمای کلی از عملکرد تحصیلی شما</p>
              </div>
              <Badge className="bg-blue-100 text-blue-800">
                <GraduationCap className="w-4 h-4 ml-1" />
                دانش‌آموز
              </Badge>
            </div>

            {/* Stats Overview */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">میانگین نمرات</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {averageScore.toFixed(1)}
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-blue-500" />
                  </div>
                  <Progress value={averageScore} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">درصد حضور</p>
                      <p className="text-2xl font-bold text-green-600">
                        {attendanceRate.toFixed(0)}%
                      </p>
                    </div>
                    <Calendar className="w-8 h-8 text-green-500" />
                  </div>
                  <Progress value={attendanceRate} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">تکالیف تکمیل شده</p>
                      <p className="text-2xl font-bold text-purple-600">{completedAssignments}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">تکالیف در انتظار</p>
                      <p className="text-2xl font-bold text-orange-600">{pendingAssignments}</p>
                    </div>
                    <Clock className="w-8 h-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              <PerformanceChart 
                data={performanceData}
                type="line"
                title="روند عملکرد هفتگی"
              />
              <PerformanceChart 
                data={subjectData}
                type="bar"
                title="نمرات به تفکیک درس"
              />
            </div>

            {/* Recent Activities and AI Analytics */}
            <div className="grid lg:grid-cols-2 gap-6">
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
                            <p className="font-medium text-gray-900">
                              {assignment.assignment?.title || 'بدون عنوان'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {assignment.submittedAt 
                                ? `ارسال شده در ${new Date(assignment.submittedAt).toLocaleDateString('fa-IR')}`
                                : 'ارسال نشده'
                              }
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {assignment.isGraded ? (
                              <Badge className="bg-green-100 text-green-800">
                                {assignment.score}/20
                              </Badge>
                            ) : (
                              <Badge variant="outline">
                                در انتظار نمره
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title="تکلیفی وجود ندارد"
                      description="هنوز تکلیفی ارسال نکرده‌اید"
                      icon={<BookOpen className="w-12 h-12" />}
                    />
                  )}
                </CardContent>
              </Card>

              {/* Attendance Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    وضعیت حضور اخیر
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {attendance.length > 0 ? (
                    <div className="space-y-4">
                      {attendance.slice(0, 5).map((record) => (
                        <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">
                              {new Date(record.date).toLocaleDateString('fa-IR')}
                            </p>
                            {record.notes && (
                              <p className="text-sm text-gray-500">{record.notes}</p>
                            )}
                          </div>
                          <Badge className={
                            record.status === 'present' ? 'bg-green-100 text-green-800' :
                            record.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {record.status === 'present' ? 'حاضر' :
                             record.status === 'late' ? 'تأخیر' : 'غایب'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title="رکورد حضوری وجود ندارد"
                      description="هنوز حضور و غیابی ثبت نشده است"
                      icon={<Calendar className="w-12 h-12" />}
                    />
                  )}
                </CardContent>
              </Card>
            </div>

            {/* AI Analytics */}
            {studentId && (
              <AnalyticsDashboard 
                entityType="student"
                entityId={studentId}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
