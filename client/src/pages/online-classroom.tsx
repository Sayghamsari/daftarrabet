import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingSpinner from "@/components/common/loading-spinner";
import EmptyState from "@/components/common/empty-state";
import { 
  Video, 
  Plus, 
  Calendar,
  Clock,
  Users,
  Play,
  Settings,
  Monitor,
  Mic,
  Camera,
  Share,
  MessageSquare
} from "lucide-react";

export default function OnlineClassroom() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState(null);

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

  // Fetch classes for teachers/students
  const { data: classes } = useQuery({
    queryKey: user?.role === 'teacher' 
      ? ["/api/classes/teacher", user?.id]
      : ["/api/classes/student", user?.id],
    enabled: !!user?.id && isAuthenticated,
    retry: false,
  });

  // Fetch online classrooms
  const { data: onlineClassrooms, isLoading } = useQuery({
    queryKey: ["/api/online-classrooms", user?.id],
    enabled: !!user?.id && isAuthenticated,
    retry: false,
  });

  const createClassroomMutation = useMutation({
    mutationFn: async (classroomData: any) => {
      await apiRequest("POST", "/api/online-classrooms", classroomData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/online-classrooms"] });
      setShowCreateForm(false);
      toast({
        title: "موفق",
        description: "کلاس آنلاین با موفقیت ایجاد شد",
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
        description: "خطا در ایجاد کلاس آنلاین",
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

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (isActive: boolean) => {
    return isActive ? 'فعال' : 'غیرفعال';
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'adobe_connect':
        return <Monitor className="w-5 h-5" />;
      case 'bigbluebutton':
        return <Video className="w-5 h-5" />;
      case 'skyroom':
        return <Camera className="w-5 h-5" />;
      default:
        return <Video className="w-5 h-5" />;
    }
  };

  const getPlatformLabel = (platform: string) => {
    switch (platform) {
      case 'adobe_connect':
        return 'Adobe Connect';
      case 'bigbluebutton':
        return 'BigBlueButton';
      case 'skyroom':
        return 'SkyRoom';
      default:
        return platform;
    }
  };

  const handleCreateClassroom = (formData: FormData) => {
    const classroomData = {
      classId: formData.get('classId'),
      platform: formData.get('platform'),
      meetingUrl: formData.get('meetingUrl'),
      meetingId: formData.get('meetingId'),
      password: formData.get('password'),
      scheduledAt: formData.get('scheduledAt'),
      duration: parseInt(formData.get('duration') as string)
    };

    createClassroomMutation.mutate(classroomData);
  };

  const joinClassroom = (classroom: any) => {
    // In a real application, this would handle the platform-specific join logic
    if (classroom.meetingUrl) {
      window.open(classroom.meetingUrl, '_blank');
    } else {
      toast({
        title: "خطا",
        description: "لینک کلاس در دسترس نیست",
        variant: "destructive",
      });
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
                <h1 className="text-3xl font-bold text-gray-900">کلاس آنلاین</h1>
                <p className="text-gray-600 mt-1">
                  {user?.role === 'teacher' 
                    ? 'مدیریت کلاس‌های آنلاین و جلسات ویدئویی' 
                    : 'مشاهده و ورود به کلاس‌های آنلاین'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-100 text-blue-800">
                  <Video className="w-4 h-4 ml-1" />
                  کلاس آنلاین
                </Badge>
                {user?.role === 'teacher' && (
                  <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Plus className="w-4 h-4" />
                        کلاس جدید
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>ایجاد کلاس آنلاین جدید</DialogTitle>
                      </DialogHeader>
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          const formData = new FormData(e.target as HTMLFormElement);
                          handleCreateClassroom(formData);
                        }}
                        className="space-y-4"
                      >
                        <div>
                          <Label htmlFor="classId">انتخاب کلاس</Label>
                          <Select name="classId" required>
                            <SelectTrigger>
                              <SelectValue placeholder="کلاس را انتخاب کنید" />
                            </SelectTrigger>
                            <SelectContent>
                              {classes?.map((cls: any) => (
                                <SelectItem key={cls.id} value={cls.id}>
                                  {cls.name} - {cls.subject}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="platform">پلتفرم</Label>
                          <Select name="platform" required>
                            <SelectTrigger>
                              <SelectValue placeholder="پلتفرم را انتخاب کنید" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="adobe_connect">Adobe Connect</SelectItem>
                              <SelectItem value="bigbluebutton">BigBlueButton</SelectItem>
                              <SelectItem value="skyroom">SkyRoom</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="meetingUrl">لینک جلسه</Label>
                          <Input
                            name="meetingUrl"
                            type="url"
                            placeholder="https://example.com/meeting"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="meetingId">شناسه جلسه (اختیاری)</Label>
                          <Input
                            name="meetingId"
                            placeholder="123-456-789"
                          />
                        </div>

                        <div>
                          <Label htmlFor="password">رمز عبور (اختیاری)</Label>
                          <Input
                            name="password"
                            type="password"
                            placeholder="رمز عبور جلسه"
                          />
                        </div>

                        <div>
                          <Label htmlFor="scheduledAt">زمان برگزاری</Label>
                          <Input
                            name="scheduledAt"
                            type="datetime-local"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="duration">مدت زمان (دقیقه)</Label>
                          <Input
                            name="duration"
                            type="number"
                            placeholder="60"
                            min="1"
                            required
                          />
                        </div>

                        <div className="flex gap-2 pt-4">
                          <Button 
                            type="submit" 
                            disabled={createClassroomMutation.isPending}
                            className="flex-1"
                          >
                            {createClassroomMutation.isPending ? (
                              <LoadingSpinner size="sm" />
                            ) : (
                              "ایجاد کلاس"
                            )}
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setShowCreateForm(false)}
                            className="flex-1"
                          >
                            لغو
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>

            <Tabs defaultValue="active">
              <TabsList>
                <TabsTrigger value="active">کلاس‌های فعال</TabsTrigger>
                <TabsTrigger value="scheduled">برنامه‌ریزی شده</TabsTrigger>
                <TabsTrigger value="history">تاریخچه</TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="space-y-6">
                {/* Active Classrooms */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {onlineClassrooms?.filter((classroom: any) => classroom.isActive).map((classroom: any) => (
                    <Card key={classroom.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getPlatformIcon(classroom.platform)}
                            <div>
                              <CardTitle className="text-lg">کلاس فعال</CardTitle>
                              <p className="text-sm text-gray-500">
                                {getPlatformLabel(classroom.platform)}
                              </p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(classroom.isActive)}>
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                            زنده
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            {new Date(classroom.scheduledAt).toLocaleDateString('fa-IR')}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-4 h-4 mr-2" />
                            {classroom.duration} دقیقه
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="w-4 h-4 mr-2" />
                            {classroom.participantCount || 0} شرکت‌کننده
                          </div>
                          <div className="pt-3 flex gap-2">
                            <Button 
                              onClick={() => joinClassroom(classroom)}
                              className="flex-1 bg-green-600 hover:bg-green-700"
                            >
                              <Play className="w-4 h-4 ml-2" />
                              ورود به کلاس
                            </Button>
                            {user?.role === 'teacher' && (
                              <Button size="sm" variant="outline">
                                <Settings className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )) || []}
                </div>

                {(!onlineClassrooms || onlineClassrooms.filter((c: any) => c.isActive).length === 0) && (
                  <EmptyState
                    title="کلاس فعالی وجود ندارد"
                    description="در حال حاضر کلاس آنلاین فعالی برگزار نمی‌شود"
                    icon={<Video className="w-12 h-12" />}
                  />
                )}
              </TabsContent>

              <TabsContent value="scheduled" className="space-y-6">
                {/* Scheduled Classrooms */}
                <div className="grid gap-4">
                  {onlineClassrooms?.filter((classroom: any) => 
                    !classroom.isActive && new Date(classroom.scheduledAt) > new Date()
                  ).map((classroom: any) => (
                    <Card key={classroom.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                              {getPlatformIcon(classroom.platform)}
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">
                                کلاس برنامه‌ریزی شده
                              </h3>
                              <p className="text-sm text-gray-500">
                                {getPlatformLabel(classroom.platform)}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                <span className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {new Date(classroom.scheduledAt).toLocaleDateString('fa-IR')}
                                </span>
                                <span className="flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {new Date(classroom.scheduledAt).toLocaleTimeString('fa-IR', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                                <span className="flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {classroom.duration} دقیقه
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              برنامه‌ریزی شده
                            </Badge>
                            {user?.role === 'teacher' && (
                              <Button size="sm" variant="outline">
                                <Settings className="w-4 h-4 ml-1" />
                                تنظیمات
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )) || []}
                </div>

                {(!onlineClassrooms || onlineClassrooms.filter((c: any) => 
                  !c.isActive && new Date(c.scheduledAt) > new Date()
                ).length === 0) && (
                  <EmptyState
                    title="کلاس برنامه‌ریزی شده‌ای وجود ندارد"
                    description="هنوز کلاس آنلاینی برنامه‌ریزی نشده است"
                    icon={<Calendar className="w-12 h-12" />}
                    actionLabel={user?.role === 'teacher' ? "برنامه‌ریزی کلاس جدید" : undefined}
                    onAction={user?.role === 'teacher' ? () => setShowCreateForm(true) : undefined}
                  />
                )}
              </TabsContent>

              <TabsContent value="history" className="space-y-6">
                {/* Past Classrooms */}
                <div className="grid gap-4">
                  {onlineClassrooms?.filter((classroom: any) => 
                    !classroom.isActive && new Date(classroom.scheduledAt) < new Date()
                  ).map((classroom: any) => (
                    <Card key={classroom.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-gray-100 rounded-lg">
                              {getPlatformIcon(classroom.platform)}
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">
                                کلاس برگزار شده
                              </h3>
                              <p className="text-sm text-gray-500">
                                {getPlatformLabel(classroom.platform)}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                <span className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {new Date(classroom.scheduledAt).toLocaleDateString('fa-IR')}
                                </span>
                                <span className="flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {classroom.duration} دقیقه
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">
                              برگزار شده
                            </Badge>
                            <Button size="sm" variant="outline">
                              <MessageSquare className="w-4 h-4 ml-1" />
                              گزارش
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )) || []}
                </div>

                {(!onlineClassrooms || onlineClassrooms.filter((c: any) => 
                  !c.isActive && new Date(c.scheduledAt) < new Date()
                ).length === 0) && (
                  <EmptyState
                    title="تاریخچه کلاس وجود ندارد"
                    description="هنوز کلاس آنلاینی برگزار نشده است"
                    icon={<Calendar className="w-12 h-12" />}
                  />
                )}
              </TabsContent>
            </Tabs>

            {/* Platform Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="w-5 h-5" />
                  پلتفرم‌های پشتیبانی شده
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Monitor className="w-8 h-8 text-blue-600" />
                      <h3 className="font-medium text-blue-900">Adobe Connect</h3>
                    </div>
                    <p className="text-sm text-blue-700">
                      پلتفرم حرفه‌ای برای برگزاری وبینار و کلاس‌های آنلاین با کیفیت بالا
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Video className="w-8 h-8 text-green-600" />
                      <h3 className="font-medium text-green-900">BigBlueButton</h3>
                    </div>
                    <p className="text-sm text-green-700">
                      پلتفرم متن‌باز و رایگان برای برگزاری کلاس‌های آنلاین و جلسات ویدئویی
                    </p>
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Camera className="w-8 h-8 text-purple-600" />
                      <h3 className="font-medium text-purple-900">SkyRoom</h3>
                    </div>
                    <p className="text-sm text-purple-700">
                      پلتفرم ایرانی برای برگزاری جلسات آنلاین با پشتیبانی کامل از زبان فارسی
                    </p>
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
