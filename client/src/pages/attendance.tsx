import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import AttendanceTracker from "@/components/attendance/attendance-tracker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingSpinner from "@/components/common/loading-spinner";
import EmptyState from "@/components/common/empty-state";
import { 
  Calendar as CalendarIcon, 
  Users, 
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  UserCheck
} from "lucide-react";

export default function Attendance() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState("overview");

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

  // Fetch attendance data based on user role
  const { data: attendanceData, isLoading } = useQuery({
    queryKey: user?.role === 'student' 
      ? ["/api/attendance/student", user?.id]
      : ["/api/attendance/teacher", user?.id],
    enabled: !!user?.id && isAuthenticated,
    retry: false,
  });

  // Fetch classes for teachers
  const { data: classes } = useQuery({
    queryKey: ["/api/classes/teacher", user?.id],
    enabled: user?.role === 'teacher' && isAuthenticated,
    retry: false,
  });

  const recordAttendanceMutation = useMutation({
    mutationFn: async (attendanceRecord: any) => {
      await apiRequest("POST", "/api/attendance", attendanceRecord);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/attendance"] });
      toast({
        title: "موفق",
        description: "حضور و غیاب با موفقیت ثبت شد",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "خطا",
        description: "خطا در ثبت حضور و غیاب",
        variant: "destructive",
      });
    }
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

  const getStatusColor = (status: string) => {
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

  const getStatusLabel = (status: string) => {
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

  const calculateStats = () => {
    if (!attendanceData || attendanceData.length === 0) {
      return {
        totalDays: 0,
        presentDays: 0,
        lateDays: 0,
        absentDays: 0,
        attendanceRate: 0
      };
    }

    const totalDays = attendanceData.length;
    const presentDays = attendanceData.filter((a: any) => a.status === 'present').length;
    const lateDays = attendanceData.filter((a: any) => a.status === 'late').length;
    const absentDays = attendanceData.filter((a: any) => a.status === 'absent').length;
    const attendanceRate = ((presentDays + lateDays) / totalDays) * 100;

    return {
      totalDays,
      presentDays,
      lateDays,
      absentDays,
      attendanceRate: Math.round(attendanceRate)
    };
  };

  const stats = calculateStats();

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
                <h1 className="text-3xl font-bold text-gray-900">حضور و غیاب</h1>
                <p className="text-gray-600 mt-1">
                  {user?.role === 'teacher' 
                    ? 'ثبت و مدیریت حضور و غیاب دانش‌آموزان' 
                    : 'مشاهده وضعیت حضور و غیاب شما'}
                </p>
              </div>
              <Badge className="bg-teal-100 text-teal-800">
                <UserCheck className="w-4 h-4 ml-1" />
                {user?.role === 'teacher' ? 'معلم' : 'دانش‌آموز'}
              </Badge>
            </div>

            {/* Student View */}
            {user?.role === 'student' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid md:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">درصد حضور</p>
                          <p className="text-2xl font-bold text-green-600">
                            {stats.attendanceRate}%
                          </p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">روزهای حاضر</p>
                          <p className="text-2xl font-bold text-blue-600">{stats.presentDays}</p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">تأخیرات</p>
                          <p className="text-2xl font-bold text-yellow-600">{stats.lateDays}</p>
                        </div>
                        <Clock className="w-8 h-8 text-yellow-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">غیبت‌ها</p>
                          <p className="text-2xl font-bold text-red-600">{stats.absentDays}</p>
                        </div>
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Attendance Calendar and Recent Records */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5" />
                        تقویم حضور
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        className="rounded-md border"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <UserCheck className="w-5 h-5" />
                        آخرین وضعیت‌ها
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {attendanceData && attendanceData.length > 0 ? (
                        <div className="space-y-3">
                          {attendanceData.slice(0, 5).map((record: any) => (
                            <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <p className="font-medium text-gray-900">
                                  {new Date(record.date).toLocaleDateString('fa-IR')}
                                </p>
                                {record.entryTime && (
                                  <p className="text-sm text-gray-500">
                                    ورود: {new Date(record.entryTime).toLocaleTimeString('fa-IR', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                )}
                                {record.notes && (
                                  <p className="text-xs text-gray-400">{record.notes}</p>
                                )}
                              </div>
                              <Badge className={getStatusColor(record.status)}>
                                {getStatusLabel(record.status)}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <EmptyState
                          title="رکورد حضوری وجود ندارد"
                          description="هنوز حضور و غیابی ثبت نشده است"
                          icon={<UserCheck className="w-12 h-12" />}
                        />
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Teacher View */}
            {user?.role === 'teacher' && (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="overview">نمای کلی</TabsTrigger>
                  <TabsTrigger value="record">ثبت حضور</TabsTrigger>
                  <TabsTrigger value="reports">گزارش‌ها</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  {/* Teacher Stats */}
                  <div className="grid md:grid-cols-4 gap-6">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">تعداد کلاس‌ها</p>
                            <p className="text-2xl font-bold text-blue-600">{classes?.length || 0}</p>
                          </div>
                          <Users className="w-8 h-8 text-blue-500" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">حضور امروز</p>
                            <p className="text-2xl font-bold text-green-600">-</p>
                          </div>
                          <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">تأخیرات امروز</p>
                            <p className="text-2xl font-bold text-yellow-600">-</p>
                          </div>
                          <Clock className="w-8 h-8 text-yellow-500" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">غیبت‌های امروز</p>
                            <p className="text-2xl font-bold text-red-600">-</p>
                          </div>
                          <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Classes List */}
                  <Card>
                    <CardHeader>
                      <CardTitle>کلاس‌های من</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {classes && classes.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {classes.map((cls: any) => (
                            <div key={cls.id} className="p-4 bg-gray-50 rounded-lg">
                              <h3 className="font-medium text-gray-900">{cls.name}</h3>
                              <p className="text-sm text-gray-500">
                                {cls.subject} - پایه {cls.grade}
                              </p>
                              <div className="mt-3 flex gap-2">
                                <Button size="sm" onClick={() => setActiveTab("record")}>
                                  ثبت حضور
                                </Button>
                                <Button size="sm" variant="outline">
                                  مشاهده گزارش
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
                </TabsContent>

                <TabsContent value="record" className="space-y-6">
                  <AttendanceTracker 
                    classes={classes || []}
                    selectedDate={selectedDate}
                    onRecordAttendance={(record) => recordAttendanceMutation.mutate(record)}
                    isLoading={recordAttendanceMutation.isPending}
                  />
                </TabsContent>

                <TabsContent value="reports" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>گزارش‌های حضور و غیاب</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">گزارش‌های تفصیلی در نسخه‌های بعدی اضافه خواهد شد.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
