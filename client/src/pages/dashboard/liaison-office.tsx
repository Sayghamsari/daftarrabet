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
  FileText, 
  Users, 
  Calendar, 
  Building,
  Plus,
  UserPlus,
  Mail,
  Phone,
  CheckCircle,
  Clock,
  Star
} from "lucide-react";

export default function LiaisonOfficeDashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const params = useParams();
  
  const officeId = params.id || user?.id;

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
  const dashboardData = {
    events: [
      {
        id: 1,
        title: "مسابقه علمی ریاضی",
        date: "1403/02/15",
        status: "planned",
        participants: 45
      },
      {
        id: 2,
        title: "اردوی علمی",
        date: "1403/02/20",
        status: "ongoing",
        participants: 30
      }
    ],
    registrations: [
      {
        id: 1,
        studentName: "علی احمدی",
        grade: "نهم",
        status: "pending",
        date: "1403/02/10"
      },
      {
        id: 2,
        studentName: "مریم کریمی",
        grade: "دهم",
        status: "approved",
        date: "1403/02/12"
      }
    ],
    alumni: [
      {
        id: 1,
        name: "محمد رضایی",
        graduationYear: 1402,
        university: "دانشگاه تهران",
        field: "مهندسی کامپیوتر"
      },
      {
        id: 2,
        name: "زهرا محمدی",
        graduationYear: 1401,
        university: "دانشگاه شریف",
        field: "مهندسی برق"
      }
    ],
    externalPartners: [
      {
        id: 1,
        name: "موسسه آموزش عالی تکنیک",
        type: "educational",
        status: "active"
      },
      {
        id: 2,
        name: "شرکت فناوری پارس",
        type: "industry",
        status: "active"
      }
    ]
  };

  const stats = {
    upcomingEvents: dashboardData.events.filter(e => e.status === 'planned').length,
    ongoingEvents: dashboardData.events.filter(e => e.status === 'ongoing').length,
    pendingRegistrations: dashboardData.registrations.filter(r => r.status === 'pending').length,
    totalAlumni: dashboardData.alumni.length,
    activePartners: dashboardData.externalPartners.filter(p => p.status === 'active').length
  };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'active':
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'planned':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return 'تأیید شده';
      case 'pending':
        return 'در انتظار';
      case 'rejected':
        return 'رد شده';
      case 'active':
        return 'فعال';
      case 'inactive':
        return 'غیرفعال';
      case 'planned':
        return 'برنامه‌ریزی شده';
      case 'ongoing':
        return 'در حال اجرا';
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
                <h1 className="text-3xl font-bold text-gray-900">داشبورد دفتر رابط</h1>
                <p className="text-gray-600 mt-1">مدیریت ارتباطات خارجی و رویدادها</p>
              </div>
              <Badge className="bg-teal-100 text-teal-800">
                <FileText className="w-4 h-4 ml-1" />
                دفتر رابط
              </Badge>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-4 gap-4">
              <Button className="h-16 bg-blue-500 hover:bg-blue-600 text-white">
                <div className="text-center">
                  <Plus className="w-6 h-6 mx-auto mb-1" />
                  <span className="text-sm">رویداد جدید</span>
                </div>
              </Button>
              
              <Button className="h-16 bg-green-500 hover:bg-green-600 text-white">
                <div className="text-center">
                  <UserPlus className="w-6 h-6 mx-auto mb-1" />
                  <span className="text-sm">ثبت‌نام جدید</span>
                </div>
              </Button>

              <Button className="h-16 bg-purple-500 hover:bg-purple-600 text-white">
                <div className="text-center">
                  <Building className="w-6 h-6 mx-auto mb-1" />
                  <span className="text-sm">شراکت جدید</span>
                </div>
              </Button>

              <Button className="h-16 bg-orange-500 hover:bg-orange-600 text-white">
                <div className="text-center">
                  <Star className="w-6 h-6 mx-auto mb-1" />
                  <span className="text-sm">مدیریت فارغ‌التحصیلان</span>
                </div>
              </Button>
            </div>

            {/* Stats Overview */}
            <div className="grid md:grid-cols-5 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">رویدادهای آتی</p>
                      <p className="text-2xl font-bold text-blue-600">{stats.upcomingEvents}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">رویدادهای فعال</p>
                      <p className="text-2xl font-bold text-green-600">{stats.ongoingEvents}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">ثبت‌نام‌های در انتظار</p>
                      <p className="text-2xl font-bold text-orange-600">{stats.pendingRegistrations}</p>
                    </div>
                    <Clock className="w-8 h-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">فارغ‌التحصیلان</p>
                      <p className="text-2xl font-bold text-purple-600">{stats.totalAlumni}</p>
                    </div>
                    <Star className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">شرکای فعال</p>
                      <p className="text-2xl font-bold text-teal-600">{stats.activePartners}</p>
                    </div>
                    <Building className="w-8 h-8 text-teal-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Events and Registrations */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Events Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    رویدادها و فعالیت‌های فوق‌برنامه
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {dashboardData.events.length > 0 ? (
                    <div className="space-y-4">
                      {dashboardData.events.map((event) => (
                        <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{event.title}</h3>
                            <p className="text-sm text-gray-500">
                              {event.date} - {event.participants} شرکت‌کننده
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(event.status)}>
                              {getStatusLabel(event.status)}
                            </Badge>
                            <Button size="sm" variant="outline">
                              مدیریت
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title="رویدادی برنامه‌ریزی نشده"
                      description="هنوز رویدادی برنامه‌ریزی نکرده‌اید"
                      icon={<Calendar className="w-12 h-12" />}
                      actionLabel="ایجاد رویداد جدید"
                      onAction={() => {}}
                    />
                  )}
                </CardContent>
              </Card>

              {/* New Registrations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    ثبت‌نام‌های جدید
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {dashboardData.registrations.length > 0 ? (
                    <div className="space-y-4">
                      {dashboardData.registrations.map((registration) => (
                        <div key={registration.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{registration.studentName}</h3>
                            <p className="text-sm text-gray-500">
                              پایه {registration.grade} - {registration.date}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(registration.status)}>
                              {getStatusLabel(registration.status)}
                            </Badge>
                            {registration.status === 'pending' && (
                              <Button size="sm">
                                بررسی
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title="ثبت‌نام جدیدی وجود ندارد"
                      description="درخواست ثبت‌نام جدیدی ثبت نشده است"
                      icon={<UserPlus className="w-12 h-12" />}
                    />
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Alumni and External Partners */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Alumni Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    فارغ‌التحصیلان برتر
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {dashboardData.alumni.length > 0 ? (
                    <div className="space-y-4">
                      {dashboardData.alumni.map((alumnus) => (
                        <div key={alumnus.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{alumnus.name}</h3>
                            <p className="text-sm text-gray-500">
                              {alumnus.university} - {alumnus.field}
                            </p>
                            <p className="text-xs text-gray-400">
                              فارغ‌التحصیل {alumnus.graduationYear}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Mail className="w-4 h-4 ml-1" />
                              تماس
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title="اطلاعات فارغ‌التحصیل وجود ندارد"
                      description="هنوز اطلاعات فارغ‌التحصیلی ثبت نشده است"
                      icon={<Star className="w-12 h-12" />}
                      actionLabel="افزودن فارغ‌التحصیل"
                      onAction={() => {}}
                    />
                  )}
                </CardContent>
              </Card>

              {/* External Partners */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    شرکا و سازمان‌های همکار
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {dashboardData.externalPartners.length > 0 ? (
                    <div className="space-y-4">
                      {dashboardData.externalPartners.map((partner) => (
                        <div key={partner.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{partner.name}</h3>
                            <p className="text-sm text-gray-500">
                              {partner.type === 'educational' ? 'موسسه آموزشی' : 'صنعتی'}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(partner.status)}>
                              {getStatusLabel(partner.status)}
                            </Badge>
                            <Button size="sm" variant="outline">
                              <Phone className="w-4 h-4 ml-1" />
                              تماس
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title="شریک خارجی وجود ندارد"
                      description="هنوز با سازمان خارجی همکاری برقرار نشده است"
                      icon={<Building className="w-12 h-12" />}
                      actionLabel="افزودن شریک جدید"
                      onAction={() => {}}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
