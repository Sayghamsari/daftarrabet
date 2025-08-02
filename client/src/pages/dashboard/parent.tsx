import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import PerformanceChart from "@/components/ai/performance-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import LoadingSpinner from "@/components/common/loading-spinner";
import EmptyState from "@/components/common/empty-state";
import { 
  Users, 
  GraduationCap, 
  Calendar, 
  TrendingUp,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  Clock,
  MessageSquare,
  Mail
} from "lucide-react";

export default function ParentDashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const params = useParams();
  
  const parentId = params.id || user?.id;

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
  const childrenData = [
    {
      id: "child-1",
      name: "سارا احمدی",
      grade: "نهم",
      class: "نهم الف",
      averageScore: 17.5,
      attendanceRate: 95,
      assignments: [
        { id: 1, subject: "ریاضی", title: "تمرین فصل 3", score: 18, maxScore: 20, dueDate: "1403/02/15" },
        { id: 2, subject: "فیزیک", title: "آزمایش نور", score: 16, maxScore: 20, dueDate: "1403/02/12" }
      ],
      attendance: [
        { date: "1403/02/10", status: "present" },
        { date: "1403/02/11", status: "present" },
        { date: "1403/02/12", status: "late" },
        { date: "1403/02/13", status: "present" }
      ],
      notifications: [
        { id: 1, message: "جلسه اولیا روز چهارشنبه", type: "info", date: "1403/02/10" },
        { id: 2, message: "تأخیر در کلاس ریاضی", type: "warning", date: "1403/02/12" }
      ]
    }
  ];

  const selectedChild = childrenData[0]; // In real app, this would be selected by parent

  const performanceData = [
    { name: 'مهر', value: 16.5 },
    { name: 'آبان', value: 17.2 },
    { name: 'آذر', value: 18.1 },
    { name: 'دی', value: 17.8 },
    { name: 'بهمن', value: 17.5 }
  ];

  const subjectData = [
    { name: 'ریاضی', value: 18 },
    { name: 'فیزیک', value: 16.5 },
    { name: 'شیمی', value: 17.5 },
    { name: 'زبان', value: 19 },
    { name: 'ادبیات', value: 18.5 }
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

  const getAttendanceColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'excused':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAttendanceLabel = (status: string) => {
    switch (status) {
      case 'present':
        return 'حاضر';
      case 'late':
        return 'تأخیر';
      case 'absent':
        return 'غایب';
      case 'excused':
        return 'موجه';
      default:
        return status;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

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
                <h1 className="text-3xl font-bold text-gray-900">داشبورد والدین</h1>
                <p className="text-gray-600 mt-1">نظارت بر پیشرفت تحصیلی فرزندان</p>
              </div>
              <Badge className="bg-pink-100 text-pink-800">
                <Users className="w-4 h-4 ml-1" />
                ولی
              </Badge>
            </div>

            {/* Child Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  انتخاب فرزند
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div>
                    <h3 className="font-medium text-blue-900">{selectedChild.name}</h3>
                    <p className="text-sm text-blue-700">
                      پایه {selectedChild.grade} - کلاس {selectedChild.class}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    تغییر فرزند
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">میانگین نمرات</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {selectedChild.averageScore}
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-blue-500" />
                  </div>
                  <Progress value={(selectedChild.averageScore / 20) * 100} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">درصد حضور</p>
                      <p className="text-2xl font-bold text-green-600">
                        {selectedChild.attendanceRate}%
                      </p>
                    </div>
                    <Calendar className="w-8 h-8 text-green-500" />
                  </div>
                  <Progress value={selectedChild.attendanceRate} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">تکالیف ارسالی</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {selectedChild.assignments.length}
                      </p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">اعلان‌های جدید</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {selectedChild.notifications.length}
                      </p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              <PerformanceChart 
                data={performanceData}
                type="line"
                title="روند عملکرد ماهانه"
              />
              <PerformanceChart 
                data={subjectData}
                type="bar"
                title="نمرات به تفکیک درس"
              />
            </div>

            {/* Recent Activities and Notifications */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Assignments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    آخرین تکالیف و نمرات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedChild.assignments.length > 0 ? (
                    <div className="space-y-4">
                      {selectedChild.assignments.map((assignment) => (
                        <div key={assignment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{assignment.title}</h3>
                            <p className="text-sm text-gray-500">
                              {assignment.subject} - مهلت: {assignment.dueDate}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-100 text-green-800">
                              {assignment.score}/{assignment.maxScore}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title="تکلیفی وجود ندارد"
                      description="هنوز تکلیفی ثبت نشده است"
                      icon={<BookOpen className="w-12 h-12" />}
                    />
                  )}
                </CardContent>
              </Card>

              {/* Notifications and Messages */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    اعلان‌ها و پیام‌ها
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedChild.notifications.length > 0 ? (
                    <div className="space-y-4">
                      {selectedChild.notifications.map((notification) => (
                        <div key={notification.id} className={`p-4 rounded-lg border ${getNotificationColor(notification.type)}`}>
                          <div className="flex items-start gap-2">
                            {notification.type === 'warning' && <AlertTriangle className="w-5 h-5 mt-0.5" />}
                            {notification.type === 'info' && <MessageSquare className="w-5 h-5 mt-0.5" />}
                            <div className="flex-1">
                              <p className="font-medium">{notification.message}</p>
                              <p className="text-sm mt-1">{notification.date}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title="پیامی وجود ندارد"
                      description="هنوز پیام یا اعلانی دریافت نکرده‌اید"
                      icon={<MessageSquare className="w-12 h-12" />}
                    />
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Attendance Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  وضعیت حضور اخیر
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  {selectedChild.attendance.map((record, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg text-center">
                      <p className="font-medium text-gray-900 mb-2">
                        {record.date}
                      </p>
                      <Badge className={getAttendanceColor(record.status)}>
                        {getAttendanceLabel(record.status)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Communication Tools */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  ارتباط با مدرسه
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button className="h-16 bg-blue-500 hover:bg-blue-600 text-white">
                    <div className="text-center">
                      <MessageSquare className="w-6 h-6 mx-auto mb-1" />
                      <span className="text-sm">پیام به معلم</span>
                    </div>
                  </Button>
                  
                  <Button className="h-16 bg-green-500 hover:bg-green-600 text-white">
                    <div className="text-center">
                      <Calendar className="w-6 h-6 mx-auto mb-1" />
                      <span className="text-sm">درخواست جلسه</span>
                    </div>
                  </Button>

                  <Button className="h-16 bg-purple-500 hover:bg-purple-600 text-white">
                    <div className="text-center">
                      <Clock className="w-6 h-6 mx-auto mb-1" />
                      <span className="text-sm">توجیه غیبت</span>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
