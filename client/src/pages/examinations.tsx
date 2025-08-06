import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
  GraduationCap, 
  Plus, 
  Clock, 
  Calendar,
  Users,
  FileText,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  Award,
  Target,
  BarChart3,
  Eye
} from "lucide-react";
import LoadingSpinner from "@/components/common/loading-spinner";

export default function Examinations() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [newExam, setNewExam] = useState({
    title: "",
    description: "",
    subject: "",
    duration: "60",
    totalQuestions: "20",
    date: "",
    time: "",
    passingScore: "60"
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
  const mockExams = [
    {
      id: 1,
      title: "آزمون میان‌ترم ریاضی",
      description: "آزمون میان‌ترم فصل هندسه و جبر",
      subject: "ریاضی",
      teacher: "فاطمه کریمی",
      date: "2024-08-10",
      time: "09:00",
      duration: 90,
      totalQuestions: 25,
      passingScore: 60,
      status: "scheduled",
      participants: 0,
      maxParticipants: 30,
      myScore: null,
      attempts: 0,
      maxAttempts: 1
    },
    {
      id: 2,
      title: "آزمون عملی فیزیک",
      description: "آزمون عملی آزمایشگاه فیزیک",
      subject: "فیزیک",
      teacher: "محمد رضایی",
      date: "2024-08-08",
      time: "14:00",
      duration: 60,
      totalQuestions: 15,
      passingScore: 70,
      status: "in_progress",
      participants: 12,
      maxParticipants: 25,
      myScore: null,
      attempts: 0,
      maxAttempts: 2
    },
    {
      id: 3,
      title: "آزمون نهایی شیمی",
      description: "آزمون پایان ترم شیمی معدنی",
      subject: "شیمی",
      teacher: "علی محمدی",
      date: "2024-08-05",
      time: "10:00",
      duration: 120,
      totalQuestions: 30,
      passingScore: 65,
      status: "completed",
      participants: 28,
      maxParticipants: 30,
      myScore: 85,
      attempts: 1,
      maxAttempts: 1
    }
  ];

  const subjects = ["ریاضی", "فیزیک", "شیمی", "زیست‌شناسی", "ادبیات", "تاریخ"];

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { label: "برنامه‌ریزی شده", variant: "secondary" as const, color: "text-blue-600" },
      in_progress: { label: "در حال برگزاری", variant: "default" as const, color: "text-orange-600" },
      completed: { label: "تمام شده", variant: "outline" as const, color: "text-gray-600" }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    
    return (
      <Badge variant={config.variant} className="gap-1">
        {status === 'in_progress' && <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>}
        {config.label}
      </Badge>
    );
  };

  const getScoreBadge = (score: number, passingScore: number) => {
    if (score >= passingScore + 20) {
      return <Badge className="bg-green-500">عالی ({score})</Badge>;
    } else if (score >= passingScore + 10) {
      return <Badge className="bg-blue-500">خوب ({score})</Badge>;
    } else if (score >= passingScore) {
      return <Badge className="bg-yellow-500">قبولی ({score})</Badge>;
    } else {
      return <Badge variant="destructive">مردود ({score})</Badge>;
    }
  };

  const handleCreateExam = () => {
    toast({
      title: "آزمون ایجاد شد",
      description: "آزمون جدید با موفقیت ایجاد شد",
    });
    setIsCreateDialogOpen(false);
    setNewExam({
      title: "",
      description: "",
      subject: "",
      duration: "60",
      totalQuestions: "20",
      date: "",
      time: "",
      passingScore: "60"
    });
  };

  const handleStartExam = (exam: any) => {
    if (exam.status === 'in_progress') {
      toast({
        title: "شروع آزمون",
        description: `آزمون ${exam.title} شروع شد`,
      });
    } else {
      toast({
        title: "آزمون در دسترس نیست",
        description: "این آزمون هنوز شروع نشده یا به پایان رسیده است",
        variant: "destructive",
      });
    }
  };

  const scheduledExams = mockExams.filter(e => e.status === 'scheduled');
  const inProgressExams = mockExams.filter(e => e.status === 'in_progress');
  const completedExams = mockExams.filter(e => e.status === 'completed');

  return (
    <div className="min-h-screen gradient-secondary">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-gradient font-shabnam animate-float">
                  آزمون‌ها
                </h1>
                <p className="text-muted-foreground font-vazir text-lg">
                  مدیریت و شرکت در آزمون‌های درسی
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span className="text-sm text-primary font-dana">
                    سامانه آزمون‌گیری هوشمند
                  </span>
                </div>
              </div>
              {(user?.role === 'teacher' || user?.role === 'principal') && (
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2 btn-gradient shadow-primary hover:shadow-xl">
                      <Plus className="w-5 h-5" />
                      <span className="font-dana">ایجاد آزمون جدید</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>ایجاد آزمون جدید</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">عنوان آزمون</Label>
                        <Input
                          id="title"
                          value={newExam.title}
                          onChange={(e) => setNewExam(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="عنوان آزمون را وارد کنید"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="description">توضیحات</Label>
                        <Textarea
                          id="description"
                          value={newExam.description}
                          onChange={(e) => setNewExam(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="توضیحات آزمون"
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="subject">درس</Label>
                          <Select value={newExam.subject} onValueChange={(value) => setNewExam(prev => ({ ...prev, subject: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="انتخاب درس" />
                            </SelectTrigger>
                            <SelectContent>
                              {subjects.map(subject => (
                                <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="duration">مدت زمان (دقیقه)</Label>
                          <Input
                            id="duration"
                            type="number"
                            value={newExam.duration}
                            onChange={(e) => setNewExam(prev => ({ ...prev, duration: e.target.value }))}
                            placeholder="60"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="totalQuestions">تعداد سؤال</Label>
                          <Input
                            id="totalQuestions"
                            type="number"
                            value={newExam.totalQuestions}
                            onChange={(e) => setNewExam(prev => ({ ...prev, totalQuestions: e.target.value }))}
                            placeholder="20"
                          />
                        </div>

                        <div>
                          <Label htmlFor="passingScore">نمره قبولی</Label>
                          <Input
                            id="passingScore"
                            type="number"
                            value={newExam.passingScore}
                            onChange={(e) => setNewExam(prev => ({ ...prev, passingScore: e.target.value }))}
                            placeholder="60"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="date">تاریخ</Label>
                          <Input
                            id="date"
                            type="date"
                            value={newExam.date}
                            onChange={(e) => setNewExam(prev => ({ ...prev, date: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="time">ساعت</Label>
                          <Input
                            id="time"
                            type="time"
                            value={newExam.time}
                            onChange={(e) => setNewExam(prev => ({ ...prev, time: e.target.value }))}
                          />
                        </div>
                      </div>

                      <Button onClick={handleCreateExam} className="w-full">
                        ایجاد آزمون
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card className="card-gradient card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground font-vazir">کل آزمون‌ها</p>
                      <p className="text-3xl font-bold text-gradient font-dana persian-nums">{mockExams.length}</p>
                    </div>
                    <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center animate-bounce-soft">
                      <GraduationCap className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-gradient card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground font-vazir">در حال برگزاری</p>
                      <p className="text-3xl font-bold text-gradient font-dana persian-nums">{inProgressExams.length}</p>
                    </div>
                    <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center animate-pulse">
                      <Play className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-gradient card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground font-vazir">برنامه‌ریزی شده</p>
                      <p className="text-3xl font-bold text-gradient font-dana persian-nums">{scheduledExams.length}</p>
                    </div>
                    <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center animate-float">
                      <Calendar className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-gradient card-hover">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground font-vazir">میانگین نمرات</p>
                      <p className="text-3xl font-bold text-gradient font-dana persian-nums">
                        {completedExams.filter(e => e.myScore).length > 0 
                          ? Math.round(completedExams.filter(e => e.myScore).reduce((sum, e) => sum + (e.myScore || 0), 0) / completedExams.filter(e => e.myScore).length)
                          : "-"
                        }
                      </p>
                    </div>
                    <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center animate-bounce-soft">
                      <Award className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="in_progress" className="space-y-6">
              <TabsList className="glass backdrop-blur-md grid w-full grid-cols-4">
                <TabsTrigger value="in_progress" className="font-vazir">در حال برگزاری</TabsTrigger>
                <TabsTrigger value="scheduled" className="font-vazir">برنامه‌ریزی شده</TabsTrigger>
                <TabsTrigger value="completed" className="font-vazir">تمام شده</TabsTrigger>
                <TabsTrigger value="results" className="font-vazir">نتایج</TabsTrigger>
              </TabsList>

              {/* In Progress Exams */}
              <TabsContent value="in_progress" className="space-y-4">
                {inProgressExams.length > 0 ? (
                  inProgressExams.map((exam) => (
                    <Card key={exam.id} className="card-gradient card-hover border-primary/20">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-gradient font-shabnam">{exam.title}</h3>
                              {getStatusBadge(exam.status)}
                            </div>
                            <p className="text-muted-foreground mb-3 font-vazir">{exam.description}</p>
                            <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4 font-dana">
                              <div className="flex items-center gap-2 bg-accent/50 px-3 py-1 rounded-full">
                                <FileText className="w-4 h-4 text-primary" />
                                {exam.subject}
                              </div>
                              <div className="flex items-center gap-2 bg-accent/50 px-3 py-1 rounded-full">
                                <Clock className="w-4 h-4 text-primary" />
                                {exam.duration} دقیقه
                              </div>
                              <div className="flex items-center gap-2 bg-accent/50 px-3 py-1 rounded-full">
                                <Target className="w-4 h-4 text-primary" />
                                {exam.totalQuestions} سؤال
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {exam.participants}/{exam.maxParticipants} شرکت‌کننده
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <span>پیشرفت آزمون:</span>
                              <Progress value={65} className="w-32" />
                              <span>65%</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              onClick={() => handleStartExam(exam)}
                              className="btn-gradient shadow-primary gap-3 font-dana"
                            >
                              <Play className="w-5 h-5" />
                              شرکت در آزمون
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="card-gradient">
                    <CardContent className="p-12 text-center">
                      <div className="w-20 h-20 mx-auto mb-6 gradient-primary rounded-full flex items-center justify-center">
                        <Play className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gradient mb-3 font-shabnam">
                        هیچ آزمونی در حال برگزاری نیست
                      </h3>
                      <p className="text-muted-foreground font-vazir">
                        آزمون‌های برنامه‌ریزی شده را در تب بعدی مشاهده کنید
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Scheduled Exams */}
              <TabsContent value="scheduled" className="space-y-4">
                {scheduledExams.map((exam) => (
                  <Card key={exam.id} className="card-gradient card-hover border-primary/20">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gradient font-shabnam">{exam.title}</h3>
                            {getStatusBadge(exam.status)}
                          </div>
                          <p className="text-muted-foreground mb-3 font-vazir">{exam.description}</p>
                          <div className="flex items-center gap-6 text-sm text-muted-foreground font-dana">
                            <div className="flex items-center gap-2 bg-accent/50 px-3 py-1 rounded-full">
                              <FileText className="w-4 h-4 text-primary" />
                              {exam.subject}
                            </div>
                            <div className="flex items-center gap-2 bg-accent/50 px-3 py-1 rounded-full">
                              <Calendar className="w-4 h-4 text-primary" />
                              {new Date(exam.date).toLocaleDateString('fa-IR')}
                            </div>
                            <div className="flex items-center gap-2 bg-accent/50 px-3 py-1 rounded-full">
                              <Clock className="w-4 h-4 text-primary" />
                              {exam.time} - {exam.duration} دقیقه
                            </div>
                            <div className="flex items-center gap-2 bg-accent/50 px-3 py-1 rounded-full">
                              <Target className="w-4 h-4 text-primary" />
                              {exam.totalQuestions} سؤال
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="gap-2">
                            <Eye className="w-4 h-4" />
                            جزئیات
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Completed Exams */}
              <TabsContent value="completed" className="space-y-4">
                {completedExams.map((exam) => (
                  <Card key={exam.id} className="opacity-90">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{exam.title}</h3>
                            {getStatusBadge(exam.status)}
                            {exam.myScore && getScoreBadge(exam.myScore, exam.passingScore)}
                          </div>
                          <p className="text-gray-600 mb-3">{exam.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              {exam.subject}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(exam.date).toLocaleDateString('fa-IR')}
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {exam.participants} شرکت‌کننده
                            </div>
                            <div className="flex items-center gap-1">
                              <Award className="w-4 h-4" />
                              نمره قبولی: {exam.passingScore}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="gap-2">
                            <BarChart3 className="w-4 h-4" />
                            نتایج
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              {/* Results Tab */}
              <TabsContent value="results" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        آمار عملکرد
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {completedExams.filter(e => e.myScore).map((exam) => (
                          <div key={exam.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium">{exam.subject}</p>
                              <p className="text-sm text-gray-500">{exam.title}</p>
                            </div>
                            <div className="text-left">
                              <p className="font-bold text-lg">{exam.myScore}/100</p>
                              <p className="text-xs text-gray-500">
                                {exam.myScore && exam.myScore >= exam.passingScore ? "قبول" : "مردود"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        وضعیت کلی
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center p-6 bg-blue-50 rounded-lg">
                          <div className="text-3xl font-bold text-blue-600 mb-2">
                            {completedExams.filter(e => e.myScore).length}
                          </div>
                          <p className="text-sm text-gray-600">آزمون‌های شرکت کرده</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-xl font-bold text-green-600">
                              {completedExams.filter(e => e.myScore && e.myScore >= e.passingScore).length}
                            </div>
                            <p className="text-xs text-gray-600">قبولی</p>
                          </div>
                          
                          <div className="text-center p-4 bg-red-50 rounded-lg">
                            <div className="text-xl font-bold text-red-600">
                              {completedExams.filter(e => e.myScore && e.myScore < e.passingScore).length}
                            </div>
                            <p className="text-xs text-gray-600">مردودی</p>
                          </div>
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