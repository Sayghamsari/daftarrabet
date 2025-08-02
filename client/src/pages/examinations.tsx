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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingSpinner from "@/components/common/loading-spinner";
import EmptyState from "@/components/common/empty-state";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertExaminationSchema } from "@shared/schema";
import { z } from "zod";
import { 
  ClipboardList, 
  Plus, 
  Calendar,
  Clock,
  Users,
  Play,
  Settings,
  CheckCircle,
  AlertTriangle,
  FileText,
  BarChart3,
  Edit,
  Trash2,
  Eye
} from "lucide-react";

const examinationFormSchema = insertExaminationSchema.extend({
  scheduledAt: z.string(),
});

type ExaminationFormData = z.infer<typeof examinationFormSchema>;

export default function Examinations() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const form = useForm<ExaminationFormData>({
    resolver: zodResolver(examinationFormSchema),
    defaultValues: {
      title: "",
      description: "",
      classId: "",
      teacherId: user?.id || "",
      scheduledAt: "",
      duration: 60,
      totalScore: 20,
      isPublished: false,
    },
  });

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

  // Fetch classes for teacher/student
  const { data: classes } = useQuery({
    queryKey: user?.role === 'teacher' 
      ? ["/api/classes/teacher", user?.id]
      : ["/api/classes/student", user?.id],
    enabled: !!user?.id && isAuthenticated,
    retry: false,
  });

  // Fetch examinations
  const { data: examinations, isLoading } = useQuery({
    queryKey: user?.role === 'teacher'
      ? ["/api/examinations/teacher", user?.id]
      : ["/api/examinations/student", user?.id],
    enabled: !!user?.id && isAuthenticated,
    retry: false,
  });

  // Fetch specific class examinations if needed
  const { data: classExaminations } = useQuery({
    queryKey: ["/api/examinations/class", selectedExam?.classId],
    enabled: !!selectedExam?.classId && isAuthenticated,
    retry: false,
  });

  const createExaminationMutation = useMutation({
    mutationFn: async (examData: ExaminationFormData) => {
      const processedData = {
        ...examData,
        scheduledAt: new Date(examData.scheduledAt).toISOString(),
      };
      await apiRequest("POST", "/api/examinations", processedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/examinations"] });
      setShowCreateForm(false);
      form.reset();
      toast({
        title: "موفق",
        description: "آزمون با موفقیت ایجاد شد",
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
        description: "خطا در ایجاد آزمون",
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

  const getStatusColor = (exam: any) => {
    const now = new Date();
    const examDate = new Date(exam.scheduledAt);
    
    if (!exam.isPublished) {
      return 'bg-gray-100 text-gray-800';
    } else if (examDate > now) {
      return 'bg-blue-100 text-blue-800';
    } else {
      return 'bg-green-100 text-green-800';
    }
  };

  const getStatusLabel = (exam: any) => {
    const now = new Date();
    const examDate = new Date(exam.scheduledAt);
    
    if (!exam.isPublished) {
      return 'پیش‌نویس';
    } else if (examDate > now) {
      return 'برنامه‌ریزی شده';
    } else {
      return 'برگزار شده';
    }
  };

  const isUpcoming = (exam: any) => {
    const now = new Date();
    const examDate = new Date(exam.scheduledAt);
    return examDate > now && exam.isPublished;
  };

  const isPast = (exam: any) => {
    const now = new Date();
    const examDate = new Date(exam.scheduledAt);
    return examDate < now;
  };

  const onSubmit = (data: ExaminationFormData) => {
    createExaminationMutation.mutate(data);
  };

  const stats = {
    total: examinations?.length || 0,
    upcoming: examinations?.filter(isUpcoming).length || 0,
    past: examinations?.filter(isPast).length || 0,
    drafts: examinations?.filter((e: any) => !e.isPublished).length || 0,
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
                <h1 className="text-3xl font-bold text-gray-900">آزمون‌ها</h1>
                <p className="text-gray-600 mt-1">
                  {user?.role === 'teacher' 
                    ? 'مدیریت و برگزاری آزمون‌های آنلاین' 
                    : 'مشاهده و شرکت در آزمون‌ها'}
                </p>
              </div>
              {user?.role === 'teacher' && (
                <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="w-4 h-4" />
                      آزمون جدید
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>ایجاد آزمون جدید</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>عنوان آزمون</FormLabel>
                              <FormControl>
                                <Input placeholder="آزمون میان‌ترم ریاضی" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>توضیحات</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="توضیحات آزمون..."
                                  {...field}
                                  rows={3}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="classId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>کلاس</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="کلاس را انتخاب کنید" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {classes?.map((cls: any) => (
                                    <SelectItem key={cls.id} value={cls.id}>
                                      {cls.name} - {cls.subject}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="scheduledAt"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>زمان برگزاری</FormLabel>
                              <FormControl>
                                <Input type="datetime-local" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="duration"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>مدت زمان (دقیقه)</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="totalScore"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>نمره کل</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    step="0.5"
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="flex gap-2 pt-4">
                          <Button 
                            type="submit" 
                            disabled={createExaminationMutation.isPending}
                            className="flex-1"
                          >
                            {createExaminationMutation.isPending ? (
                              <LoadingSpinner size="sm" />
                            ) : (
                              "ایجاد آزمون"
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
                    </Form>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {/* Teacher View */}
            {user?.role === 'teacher' && (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="overview">نمای کلی</TabsTrigger>
                  <TabsTrigger value="questions">مدیریت سؤالات</TabsTrigger>
                  <TabsTrigger value="results">نتایج</TabsTrigger>
                  <TabsTrigger value="analytics">تحلیل‌ها</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  {/* Stats Cards */}
                  <div className="grid md:grid-cols-4 gap-6">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">کل آزمون‌ها</p>
                            <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                          </div>
                          <ClipboardList className="w-8 h-8 text-blue-500" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">آزمون‌های آتی</p>
                            <p className="text-2xl font-bold text-green-600">{stats.upcoming}</p>
                          </div>
                          <Calendar className="w-8 h-8 text-green-500" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">برگزار شده</p>
                            <p className="text-2xl font-bold text-purple-600">{stats.past}</p>
                          </div>
                          <CheckCircle className="w-8 h-8 text-purple-500" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">پیش‌نویس</p>
                            <p className="text-2xl font-bold text-orange-600">{stats.drafts}</p>
                          </div>
                          <FileText className="w-8 h-8 text-orange-500" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Examinations List */}
                  <Card>
                    <CardHeader>
                      <CardTitle>لیست آزمون‌ها</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {examinations && examinations.length > 0 ? (
                        <div className="space-y-4">
                          {examinations.map((exam: any) => (
                            <div key={exam.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div className="flex-1">
                                <h3 className="font-medium text-gray-900">{exam.title}</h3>
                                <p className="text-sm text-gray-500 mt-1">{exam.description}</p>
                                <div className="flex items-center gap-4 mt-2">
                                  <span className="text-xs text-gray-400 flex items-center">
                                    <Calendar className="w-3 h-3 ml-1" />
                                    {new Date(exam.scheduledAt).toLocaleDateString('fa-IR')}
                                  </span>
                                  <span className="text-xs text-gray-400 flex items-center">
                                    <Clock className="w-3 h-3 ml-1" />
                                    {exam.duration} دقیقه
                                  </span>
                                  <span className="text-xs text-gray-400 flex items-center">
                                    <BarChart3 className="w-3 h-3 ml-1" />
                                    {exam.totalScore} نمره
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={getStatusColor(exam)}>
                                  {getStatusLabel(exam)}
                                </Badge>
                                <Button size="sm" variant="outline">
                                  <Edit className="w-4 h-4 ml-1" />
                                  ویرایش
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Eye className="w-4 h-4 ml-1" />
                                  مشاهده
                                </Button>
                                {isUpcoming(exam) && (
                                  <Button size="sm">
                                    <Play className="w-4 h-4 ml-1" />
                                    شروع
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <EmptyState
                          title="آزمونی وجود ندارد"
                          description="شما هنوز آزمونی ایجاد نکرده‌اید"
                          icon={<ClipboardList className="w-12 h-12" />}
                          actionLabel="ایجاد آزمون جدید"
                          onAction={() => setShowCreateForm(true)}
                        />
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="questions" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>مدیریت سؤالات آزمون</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">مدیریت سؤالات در نسخه‌های بعدی اضافه خواهد شد.</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="results" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>نتایج آزمون‌ها</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">نتایج و گزارش‌ها در نسخه‌های بعدی اضافه خواهد شد.</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>تحلیل‌های آماری</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">تحلیل‌های تفصیلی در نسخه‌های بعدی اضافه خواهد شد.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}

            {/* Student View */}
            {user?.role === 'student' && (
              <div className="space-y-6">
                {/* Upcoming Exams */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      آزمون‌های آتی
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {examinations?.filter(isUpcoming).length > 0 ? (
                      <div className="grid gap-4">
                        {examinations.filter(isUpcoming).map((exam: any) => (
                          <div key={exam.id} className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-medium text-blue-900">{exam.title}</h3>
                                <p className="text-sm text-blue-700 mt-1">{exam.description}</p>
                                <div className="flex items-center gap-4 mt-2 text-sm text-blue-600">
                                  <span className="flex items-center">
                                    <Calendar className="w-4 h-4 ml-1" />
                                    {new Date(exam.scheduledAt).toLocaleDateString('fa-IR')}
                                  </span>
                                  <span className="flex items-center">
                                    <Clock className="w-4 h-4 ml-1" />
                                    {new Date(exam.scheduledAt).toLocaleTimeString('fa-IR', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                  <span className="flex items-center">
                                    <Clock className="w-4 h-4 ml-1" />
                                    {exam.duration} دقیقه
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className="bg-blue-100 text-blue-800">
                                  آماده شرکت
                                </Badge>
                                <Button>
                                  <Play className="w-4 h-4 ml-1" />
                                  شرکت در آزمون
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        title="آزمون آتی وجود ندارد"
                        description="در حال حاضر آزمونی برنامه‌ریزی نشده است"
                        icon={<Calendar className="w-12 h-12" />}
                      />
                    )}
                  </CardContent>
                </Card>

                {/* Past Exams */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      آزمون‌های برگزار شده
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {examinations?.filter(isPast).length > 0 ? (
                      <div className="space-y-4">
                        {examinations.filter(isPast).map((exam: any) => (
                          <div key={exam.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                              <h3 className="font-medium text-gray-900">{exam.title}</h3>
                              <p className="text-sm text-gray-500 mt-1">{exam.description}</p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                <span className="flex items-center">
                                  <Calendar className="w-4 h-4 ml-1" />
                                  {new Date(exam.scheduledAt).toLocaleDateString('fa-IR')}
                                </span>
                                <span className="flex items-center">
                                  <BarChart3 className="w-4 h-4 ml-1" />
                                  {exam.totalScore} نمره
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-green-100 text-green-800">
                                برگزار شده
                              </Badge>
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4 ml-1" />
                                مشاهده نتیجه
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        title="آزمون برگزار شده‌ای وجود ندارد"
                        description="هنوز در آزمونی شرکت نکرده‌اید"
                        icon={<CheckCircle className="w-12 h-12" />}
                      />
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
