import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  UserCheck,
  BarChart3,
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import LoadingSpinner from "@/components/common/loading-spinner";

export default function Attendance() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

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

  // Mock data - در آینده از API واقعی دریافت خواهد شد
  const mockAttendanceData = [
    {
      date: "2024-08-05",
      status: "present",
      subject: "ریاضی",
      teacher: "فاطمه کریمی",
      startTime: "08:00",
      endTime: "09:30"
    },
    {
      date: "2024-08-05",
      status: "present",
      subject: "فیزیک",
      teacher: "محمد رضایی",
      startTime: "09:45",
      endTime: "11:15"
    },
    {
      date: "2024-08-05",
      status: "absent",
      subject: "شیمی",
      teacher: "علی محمدی",
      startTime: "11:30",
      endTime: "13:00"
    },
    {
      date: "2024-08-04",
      status: "present",
      subject: "ریاضی",
      teacher: "فاطمه کریمی",
      startTime: "08:00",
      endTime: "09:30"
    },
    {
      date: "2024-08-04",
      status: "late",
      subject: "فیزیک",
      teacher: "محمد رضایی",
      startTime: "09:45",
      endTime: "11:15"
    }
  ];

  const mockStats = {
    totalDays: 30,
    presentDays: 25,
    absentDays: 3,
    lateDays: 2,
    attendancePercentage: 83.3
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      present: { label: "حاضر", variant: "default" as const, icon: CheckCircle2, color: "text-green-600" },
      absent: { label: "غایب", variant: "destructive" as const, icon: XCircle, color: "text-red-600" },
      late: { label: "تأخیر", variant: "secondary" as const, icon: Clock, color: "text-orange-600" }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getTodayAttendance = () => {
    const today = new Date().toISOString().split('T')[0];
    return mockAttendanceData.filter(record => record.date === today);
  };

  const getSelectedDateAttendance = () => {
    if (!selectedDate) return [];
    const dateStr = selectedDate.toISOString().split('T')[0];
    return mockAttendanceData.filter(record => record.date === dateStr);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  حضور و غیاب
                </h1>
                <p className="text-gray-600">
                  مشاهده و مدیریت حضور و غیاب کلاس‌های درسی
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-5 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">کل روزها</p>
                      <p className="text-2xl font-bold text-blue-600">{mockStats.totalDays}</p>
                    </div>
                    <CalendarIcon className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">حاضر</p>
                      <p className="text-2xl font-bold text-green-600">{mockStats.presentDays}</p>
                    </div>
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">غایب</p>
                      <p className="text-2xl font-bold text-red-600">{mockStats.absentDays}</p>
                    </div>
                    <XCircle className="w-8 h-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">تأخیر</p>
                      <p className="text-2xl font-bold text-orange-600">{mockStats.lateDays}</p>
                    </div>
                    <Clock className="w-8 h-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">درصد حضور</p>
                      <p className="text-2xl font-bold text-purple-600">{mockStats.attendancePercentage}%</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="today" className="space-y-6">
              <TabsList>
                <TabsTrigger value="today">امروز</TabsTrigger>
                <TabsTrigger value="calendar">تقویم</TabsTrigger>
                <TabsTrigger value="history">تاریخچه</TabsTrigger>
                <TabsTrigger value="reports">گزارش‌ها</TabsTrigger>
              </TabsList>

              {/* Today's Attendance */}
              <TabsContent value="today" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5" />
                      حضور و غیاب امروز
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {getTodayAttendance().length > 0 ? (
                        getTodayAttendance().map((record, index) => (
                          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold">{record.subject}</h3>
                                {getStatusBadge(record.status)}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <UserCheck className="w-4 h-4" />
                                  {record.teacher}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {record.startTime} - {record.endTime}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                          <p>هیچ کلاسی برای امروز ثبت نشده است</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Calendar View */}
              <TabsContent value="calendar" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>انتخاب تاریخ</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rounded-md border"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5" />
                        حضور و غیاب {selectedDate?.toLocaleDateString('fa-IR')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {getSelectedDateAttendance().length > 0 ? (
                          getSelectedDateAttendance().map((record, index) => (
                            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-lg font-semibold">{record.subject}</h3>
                                  {getStatusBadge(record.status)}
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <UserCheck className="w-4 h-4" />
                                    {record.teacher}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {record.startTime} - {record.endTime}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>هیچ کلاسی برای این تاریخ ثبت نشده است</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* History */}
              <TabsContent value="history" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      تاریخچه حضور و غیاب
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockAttendanceData.map((record, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold">{record.subject}</h3>
                              {getStatusBadge(record.status)}
                              <span className="text-sm text-gray-500">
                                {new Date(record.date).toLocaleDateString('fa-IR')}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <UserCheck className="w-4 h-4" />
                                {record.teacher}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {record.startTime} - {record.endTime}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Reports */}
              <TabsContent value="reports" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        آمار عملکرد
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">درصد حضور کلی</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 h-2 bg-gray-200 rounded-full">
                              <div 
                                className="h-2 bg-green-500 rounded-full" 
                                style={{width: `${mockStats.attendancePercentage}%`}}
                              ></div>
                            </div>
                            <span className="text-sm font-bold">{mockStats.attendancePercentage}%</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>حاضر</span>
                            <span>{mockStats.presentDays} روز</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>غایب</span>
                            <span>{mockStats.absentDays} روز</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>تأخیر</span>
                            <span>{mockStats.lateDays} روز</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        هشدارها
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mockStats.absentDays > 2 && (
                          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <AlertTriangle className="w-4 h-4 text-red-600" />
                              <span className="text-sm font-medium text-red-800">تعداد غیبت بالا</span>
                            </div>
                            <p className="text-xs text-red-700">
                              شما {mockStats.absentDays} روز غیبت دارید. لطفاً به حضور در کلاس‌ها توجه کنید.
                            </p>
                          </div>
                        )}
                        
                        {mockStats.lateDays > 1 && (
                          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="w-4 h-4 text-orange-600" />
                              <span className="text-sm font-medium text-orange-800">تأخیرهای مکرر</span>
                            </div>
                            <p className="text-xs text-orange-700">
                              شما {mockStats.lateDays} بار تأخیر داشته‌اید. سعی کنید به موقع در کلاس حاضر شوید.
                            </p>
                          </div>
                        )}

                        {mockStats.attendancePercentage >= 85 && (
                          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-medium text-green-800">عملکرد عالی</span>
                            </div>
                            <p className="text-xs text-green-700">
                              درصد حضور شما بالای 85% است. ادامه دهید!
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}