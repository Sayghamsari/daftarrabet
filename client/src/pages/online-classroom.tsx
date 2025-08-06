import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Video, 
  Users, 
  Calendar, 
  Clock, 
  Play,
  Pause,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Monitor,
  Settings,
  Plus,
  ExternalLink
} from "lucide-react";
import LoadingSpinner from "@/components/common/loading-spinner";

export default function OnlineClassroom() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newClass, setNewClass] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    duration: "60"
  });

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
  const mockClasses = [
    {
      id: 1,
      title: "کلاس ریاضی - هندسه",
      description: "درس هندسه فصل 4",
      subject: "ریاضی",
      teacher: "فاطمه کریمی",
      date: "2024-08-06",
      time: "10:00",
      duration: 90,
      status: "live",
      participants: 25,
      maxParticipants: 30,
      meetingUrl: "https://meet.example.com/math-class"
    },
    {
      id: 2,
      title: "کلاس فیزیک - مکانیک",
      description: "بررسی حرکت و نیرو",
      subject: "فیزیک",
      teacher: "محمد رضایی",
      date: "2024-08-06",
      time: "14:00",
      duration: 60,
      status: "scheduled",
      participants: 0,
      maxParticipants: 25,
      meetingUrl: "https://meet.example.com/physics-class"
    },
    {
      id: 3,
      title: "کلاس شیمی - اتم",
      description: "ساختار اتم و جدول تناوبی",
      subject: "شیمی",
      teacher: "علی محمدی",
      date: "2024-08-05",
      time: "11:00",
      duration: 75,
      status: "completed",
      participants: 22,
      maxParticipants: 25,
      meetingUrl: "https://meet.example.com/chemistry-class"
    }
  ];

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      live: { label: "در حال برگزاری", variant: "default" as const, color: "bg-red-500" },
      scheduled: { label: "برنامه‌ریزی شده", variant: "secondary" as const, color: "bg-blue-500" },
      completed: { label: "تمام شده", variant: "outline" as const, color: "bg-gray-500" }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    
    return (
      <Badge variant={config.variant} className="gap-1">
        {status === 'live' && <div className={`w-2 h-2 rounded-full ${config.color} animate-pulse`}></div>}
        {config.label}
      </Badge>
    );
  };

  const handleCreateClass = () => {
    toast({
      title: "کلاس ایجاد شد",
      description: "کلاس آنلاین جدید با موفقیت ایجاد شد",
    });
    setIsCreateDialogOpen(false);
    setNewClass({ title: "", description: "", date: "", time: "", duration: "60" });
  };

  const handleJoinClass = (classData: any) => {
    toast({
      title: "ورود به کلاس",
      description: `در حال ورود به کلاس ${classData.title}...`,
    });
    // در آینده: window.open(classData.meetingUrl, '_blank');
  };

  const liveClasses = mockClasses.filter(c => c.status === 'live');
  const scheduledClasses = mockClasses.filter(c => c.status === 'scheduled');
  const completedClasses = mockClasses.filter(c => c.status === 'completed');

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
                  کلاس آنلاین
                </h1>
                <p className="text-gray-600">
                  مدیریت و شرکت در کلاس‌های آنلاین
                </p>
              </div>
              {(user?.role === 'teacher' || user?.role === 'principal') && (
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="w-4 h-4" />
                      ایجاد کلاس جدید
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>ایجاد کلاس آنلاین</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">عنوان کلاس</Label>
                        <Input
                          id="title"
                          value={newClass.title}
                          onChange={(e) => setNewClass(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="عنوان کلاس را وارد کنید"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">توضیحات</Label>
                        <Input
                          id="description"
                          value={newClass.description}
                          onChange={(e) => setNewClass(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="توضیحات کلاس"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="date">تاریخ</Label>
                          <Input
                            id="date"
                            type="date"
                            value={newClass.date}
                            onChange={(e) => setNewClass(prev => ({ ...prev, date: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="time">ساعت</Label>
                          <Input
                            id="time"
                            type="time"
                            value={newClass.time}
                            onChange={(e) => setNewClass(prev => ({ ...prev, time: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="duration">مدت زمان (دقیقه)</Label>
                        <Input
                          id="duration"
                          type="number"
                          value={newClass.duration}
                          onChange={(e) => setNewClass(prev => ({ ...prev, duration: e.target.value }))}
                          placeholder="60"
                        />
                      </div>
                      <Button onClick={handleCreateClass} className="w-full">
                        ایجاد کلاس
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">کل کلاس‌ها</p>
                      <p className="text-2xl font-bold text-blue-600">{mockClasses.length}</p>
                    </div>
                    <Video className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">در حال برگزاری</p>
                      <p className="text-2xl font-bold text-red-600">{liveClasses.length}</p>
                    </div>
                    <Play className="w-8 h-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">برنامه‌ریزی شده</p>
                      <p className="text-2xl font-bold text-orange-600">{scheduledClasses.length}</p>
                    </div>
                    <Clock className="w-8 h-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">تمام شده</p>
                      <p className="text-2xl font-bold text-gray-600">{completedClasses.length}</p>
                    </div>
                    <Monitor className="w-8 h-8 text-gray-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="live" className="space-y-6">
              <TabsList>
                <TabsTrigger value="live">در حال برگزاری</TabsTrigger>
                <TabsTrigger value="scheduled">برنامه‌ریزی شده</TabsTrigger>
                <TabsTrigger value="completed">تمام شده</TabsTrigger>
                <TabsTrigger value="settings">تنظیمات</TabsTrigger>
              </TabsList>

              {/* Live Classes */}
              <TabsContent value="live" className="space-y-6">
                {liveClasses.length > 0 ? (
                  <div className="space-y-4">
                    {liveClasses.map((classData) => (
                      <Card key={classData.id} className="border-red-200 bg-red-50">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold">{classData.title}</h3>
                                {getStatusBadge(classData.status)}
                              </div>
                              <p className="text-gray-600 mb-3">{classData.description}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  {classData.participants}/{classData.maxParticipants} شرکت‌کننده
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {classData.time} - {classData.duration} دقیقه
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {new Date(classData.date).toLocaleDateString('fa-IR')}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                onClick={() => handleJoinClass(classData)}
                                className="gap-2 bg-red-600 hover:bg-red-700"
                              >
                                <Video className="w-4 h-4" />
                                ورود به کلاس
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Video className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-semibold text-gray-500 mb-2">
                        هیچ کلاس زنده‌ای در حال برگزاری نیست
                      </h3>
                      <p className="text-gray-400">
                        کلاس‌های برنامه‌ریزی شده را در تب بعدی مشاهده کنید
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Scheduled Classes */}
              <TabsContent value="scheduled" className="space-y-4">
                {scheduledClasses.map((classData) => (
                  <Card key={classData.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{classData.title}</h3>
                            {getStatusBadge(classData.status)}
                          </div>
                          <p className="text-gray-600 mb-3">{classData.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              حداکثر {classData.maxParticipants} نفر
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {classData.time} - {classData.duration} دقیقه
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(classData.date).toLocaleDateString('fa-IR')}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="gap-2">
                            <ExternalLink className="w-4 h-4" />
                            لینک کلاس
                          </Button>
                          {(user?.role === 'teacher' || user?.role === 'principal') && (
                            <Button size="sm" className="gap-2">
                              <Play className="w-4 h-4" />
                              شروع کلاس
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Completed Classes */}
              <TabsContent value="completed" className="space-y-4">
                {completedClasses.map((classData) => (
                  <Card key={classData.id} className="opacity-75">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{classData.title}</h3>
                            {getStatusBadge(classData.status)}
                          </div>
                          <p className="text-gray-600 mb-3">{classData.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {classData.participants} شرکت‌کننده
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {classData.duration} دقیقه
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(classData.date).toLocaleDateString('fa-IR')}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="gap-2">
                            <Video className="w-4 h-4" />
                            مشاهده ضبط
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Settings */}
              <TabsContent value="settings" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        تنظیمات صوتی و تصویری
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">میکروفون</span>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Mic className="w-4 h-4" />
                            تست میکروفون
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">دوربین</span>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Camera className="w-4 h-4" />
                            تست دوربین
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">اشتراک صفحه</span>
                          <Button variant="outline" size="sm" className="gap-2">
                            <Monitor className="w-4 h-4" />
                            تست اشتراک
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>راهنمای استفاده</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                          <span>برای ورود به کلاس زنده روی دکمه "ورود به کلاس" کلیک کنید</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                          <span>میکروفون و دوربین خود را قبل از ورود تست کنید</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                          <span>کیفیت اینترنت پایدار برای تجربه بهتر ضروری است</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                          <span>در صورت مشکل فنی با پشتیبانی تماس بگیرید</span>
                        </div>
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