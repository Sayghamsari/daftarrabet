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
  MessageSquare, 
  Users, 
  Calendar, 
  TrendingUp,
  Plus,
  Clock,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

export default function CounselorDashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const params = useParams();
  
  const counselorId = params.id || user?.id;

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

  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ["/api/counseling-sessions/counselor", counselorId],
    enabled: !!counselorId && isAuthenticated,
    retry: false,
  });

  if (authLoading || sessionsLoading) {
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

  const counselingSessions = sessions || [];

  // Calculate stats
  const todaySessions = counselingSessions.filter(s => 
    new Date(s.scheduledAt).toDateString() === new Date().toDateString()
  ).length;

  const upcomingSessions = counselingSessions.filter(s => 
    new Date(s.scheduledAt) > new Date() && s.status === 'scheduled'
  ).length;

  const completedSessions = counselingSessions.filter(s => s.status === 'completed').length;

  const totalStudents = new Set(counselingSessions.map(s => s.studentId)).size;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'تکمیل شده';
      case 'scheduled':
        return 'برنامه‌ریزی شده';
      case 'cancelled':
        return 'لغو شده';
      default:
        return status;
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
                <h1 className="text-3xl font-bold text-gray-900">داشبورد مشاور</h1>
                <p className="text-gray-600 mt-1">مدیریت جلسات مشاوره و پیگیری دانش‌آموزان</p>
              </div>
              <Badge className="bg-orange-100 text-orange-800">
                <MessageSquare className="w-4 h-4 ml-1" />
                مشاور
              </Badge>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-4">
              <Button className="h-16 bg-blue-500 hover:bg-blue-600 text-white">
                <div className="text-center">
                  <Plus className="w-6 h-6 mx-auto mb-1" />
                  <span className="text-sm">جلسه مشاوره جدید</span>
                </div>
              </Button>
              
              <Button className="h-16 bg-green-500 hover:bg-green-600 text-white">
                <div className="text-center">
                  <Calendar className="w-6 h-6 mx-auto mb-1" />
                  <span className="text-sm">برنامه امروز</span>
                </div>
              </Button>

              <Button className="h-16 bg-purple-500 hover:bg-purple-600 text-white">
                <div className="text-center">
                  <TrendingUp className="w-6 h-6 mx-auto mb-1" />
                  <span className="text-sm">تحلیل عملکرد</span>
                </div>
              </Button>
            </div>

            {/* Stats Overview */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">جلسات امروز</p>
                      <p className="text-2xl font-bold text-blue-600">{todaySessions}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">جلسات آتی</p>
                      <p className="text-2xl font-bold text-green-600">{upcomingSessions}</p>
                    </div>
                    <Clock className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">جلسات تکمیل شده</p>
                      <p className="text-2xl font-bold text-purple-600">{completedSessions}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">دانش‌آموزان تحت پوشش</p>
                      <p className="text-2xl font-bold text-orange-600">{totalStudents}</p>
                    </div>
                    <Users className="w-8 h-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Today's Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  جلسات امروز
                </CardTitle>
              </CardHeader>
              <CardContent>
                {counselingSessions.filter(s => 
                  new Date(s.scheduledAt).toDateString() === new Date().toDateString()
                ).length > 0 ? (
                  <div className="space-y-4">
                    {counselingSessions
                      .filter(s => new Date(s.scheduledAt).toDateString() === new Date().toDateString())
                      .map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-gray-900">
                                جلسه {session.sessionType === 'individual' ? 'فردی' : 'گروهی'}
                              </p>
                              <Badge className={getStatusColor(session.status)}>
                                {getStatusLabel(session.status)}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500">
                              {new Date(session.scheduledAt).toLocaleTimeString('fa-IR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })} - مدت: {session.duration} دقیقه
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {session.status === 'scheduled' && (
                              <Button size="sm">
                                شروع جلسه
                              </Button>
                            )}
                            <Button size="sm" variant="outline">
                              جزئیات
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <EmptyState
                    title="جلسه‌ای برای امروز برنامه‌ریزی نشده"
                    description="امروز جلسه مشاوره‌ای ندارید"
                    icon={<Calendar className="w-12 h-12" />}
                    actionLabel="برنامه‌ریزی جلسه جدید"
                    onAction={() => {}}
                  />
                )}
              </CardContent>
            </Card>

            {/* Recent Sessions and Statistics */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Sessions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    آخرین جلسات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {counselingSessions.length > 0 ? (
                    <div className="space-y-4">
                      {counselingSessions.slice(0, 5).map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              جلسه {session.sessionType === 'individual' ? 'فردی' : 'گروهی'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(session.scheduledAt).toLocaleDateString('fa-IR')}
                            </p>
                          </div>
                          <Badge className={getStatusColor(session.status)}>
                            {getStatusLabel(session.status)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title="جلسه‌ای وجود ندارد"
                      description="هنوز جلسه مشاوره‌ای برنامه‌ریزی نکرده‌اید"
                      icon={<MessageSquare className="w-12 h-12" />}
                      actionLabel="ایجاد جلسه جدید"
                      onAction={() => {}}
                    />
                  )}
                </CardContent>
              </Card>

              {/* Alert Students */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    دانش‌آموزان نیازمند توجه
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <p className="font-medium text-red-800">افت تحصیلی</p>
                      </div>
                      <p className="text-sm text-red-700">
                        3 دانش‌آموز در معرض ریزش تحصیلی قرار دارند
                      </p>
                    </div>
                    
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        <p className="font-medium text-yellow-800">غیبت مکرر</p>
                      </div>
                      <p className="text-sm text-yellow-700">
                        2 دانش‌آموز غیبت‌های مکرر دارند
                      </p>
                    </div>

                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-orange-500" />
                        <p className="font-medium text-orange-800">نیاز به مشاوره</p>
                      </div>
                      <p className="text-sm text-orange-700">
                        5 دانش‌آموز درخواست جلسه مشاوره داده‌اند
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
