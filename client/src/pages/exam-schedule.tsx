import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import LoadingSpinner from "@/components/common/loading-spinner";
import { Link } from "wouter";
import { 
  Calendar, 
  Plus, 
  Search, 
  Clock, 
  BookOpen,
  User,
  MapPin,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Bell,
  Home,
  GraduationCap,
  RefreshCw
} from "lucide-react";

interface ExamSchedule {
  id: string;
  subject: string;
  teacher: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // minutes
  room: string;
  examType: 'midterm' | 'final' | 'quiz' | 'practical';
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  conflictWarning?: boolean;
  conflictDetails?: string;
  instructions?: string;
  materials?: string[];
  createdBy: string;
  createdAt: string;
  students: number;
}

const mockExamSchedule: ExamSchedule[] = [
  {
    id: "1",
    subject: "ریاضی", 
    teacher: "خانم احمدی",
    date: "2024-01-20",
    startTime: "08:00",
    endTime: "10:00",
    duration: 120,
    room: "کلاس 201",
    examType: "midterm",
    status: "scheduled",
    instructions: "لطفاً ماشین‌حساب علمی و خودکار آبی همراه داشته باشید.",
    materials: ["ماشین‌حساب علمی", "خودکار آبی", "مداد", "پاک‌کن"],
    createdBy: "خانم احمدی",
    createdAt: "2024-01-15T10:00:00",
    students: 25
  },
  {
    id: "2",
    subject: "فیزیک",
    teacher: "آقای رضایی", 
    date: "2024-01-22",
    startTime: "10:00",
    endTime: "11:30",
    duration: 90,
    room: "آزمایشگاه فیزیک",
    examType: "practical",
    status: "scheduled",
    conflictWarning: true,
    conflictDetails: "هم‌زمان با آزمون شیمی کلاس موازی",
    instructions: "آزمون عملی قوانین نیوتن - لطفاً لباس مناسب بپوشید.",
    materials: ["لباس آزمایشگاه", "کفش بسته", "دفترچه یادداشت"],
    createdBy: "آقای رضایی",
    createdAt: "2024-01-16T14:30:00",
    students: 23
  },
  {
    id: "3",
    subject: "شیمی",
    teacher: "دکتر حسینی",
    date: "2024-01-22",
    startTime: "10:30",
    endTime: "12:00", 
    duration: 90,
    room: "آزمایشگاه شیمی",
    examType: "practical",
    status: "scheduled",
    conflictWarning: true,
    conflictDetails: "هم‌زمان با آزمون فیزیک کلاس موازی",
    instructions: "آزمون عملی ترکیبات شیمیایی - رعایت نکات ایمنی الزامی است.",
    materials: ["لباس آزمایشگاه", "عینک ایمنی", "دستکش"],
    createdBy: "دکتر حسینی",
    createdAt: "2024-01-17T09:15:00", 
    students: 24
  },
  {
    id: "4",
    subject: "ادبیات فارسی",
    teacher: "خانم صادقی",
    date: "2024-01-25",
    startTime: "08:00",
    endTime: "09:30",
    duration: 90,
    room: "کلاس 203",
    examType: "final",
    status: "scheduled",
    instructions: "آزمون نهایی ترم اول - شامل تحلیل متن و انشا",
    materials: ["خودکار آبی", "مداد", "پاک‌کن"],
    createdBy: "خانم صادقی",
    createdAt: "2024-01-18T11:20:00",
    students: 28
  },
  {
    id: "5",
    subject: "انگلیسی",
    teacher: "خانم رحیمی",
    date: "2024-01-18",
    startTime: "09:00",
    endTime: "10:00",
    duration: 60,
    room: "کلاس 204",
    examType: "quiz",
    status: "completed",
    instructions: "آزمونک واژگان درس 5 و 6",
    materials: ["خودکار آبی"],
    createdBy: "خانم رحیمی",
    createdAt: "2024-01-14T16:45:00",
    students: 26
  }
];

export default function ExamSchedule() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <LoadingSpinner />
      </div>
    );
  }

  const filteredExams = mockExamSchedule.filter(exam => {
    const matchesSearch = exam.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || exam.status === filterStatus;
    const matchesType = filterType === "all" || exam.examType === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      scheduled: "bg-blue-100 text-blue-800",
      ongoing: "bg-green-100 text-green-800", 
      completed: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800"
    };
    return variants[status as keyof typeof variants] || variants.scheduled;
  };

  const getTypeBadge = (type: string) => {
    const variants = {
      midterm: "bg-orange-100 text-orange-800",
      final: "bg-red-100 text-red-800",
      quiz: "bg-blue-100 text-blue-800",
      practical: "bg-purple-100 text-purple-800"
    };
    return variants[type as keyof typeof variants] || variants.quiz;
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'scheduled': return <Calendar className="w-4 h-4 text-blue-500" />;
      case 'ongoing': return <Clock className="w-4 h-4 text-green-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-gray-500" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Calendar className="w-4 h-4 text-gray-400" />;
    }
  };

  const conflictingExams = mockExamSchedule.filter(exam => exam.conflictWarning).length;
  const upcomingExams = mockExamSchedule.filter(exam => 
    exam.status === 'scheduled' && new Date(exam.date) >= new Date()
  ).length;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-white">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Link href="/">
                  <Button variant="outline" size="sm" className="font-vazir bg-white">
                    <Home className="w-4 h-4 ml-1" />
                    بازگشت به داشبورد
                  </Button>
                </Link>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold font-shabnam text-gradient mb-2">
                برنامه امتحانات
              </h1>
              <p className="text-sm md:text-base text-muted-foreground font-vazir">
                برنامه‌ریزی و مدیریت امتحانات - دبیرستان شهید چمران
              </p>
            </div>
            <div className="flex gap-2">
              {user?.role === 'teacher' && (
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gradient-primary text-white hover:opacity-90 font-shabnam">
                      <Plus className="w-4 h-4 ml-2" />
                      امتحان جدید
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto bg-white">
                    <DialogHeader>
                      <DialogTitle className="font-shabnam text-right">برنامه‌ریزی امتحان جدید</DialogTitle>
                    </DialogHeader>
                    <AddExamForm onClose={() => setIsAddDialogOpen(false)} />
                  </DialogContent>
                </Dialog>
              )}
              <Button variant="outline" className="font-vazir bg-white">
                <RefreshCw className="w-4 h-4 ml-1" />
                به‌روزرسانی
              </Button>
            </div>
          </div>

          {/* Conflict Warnings */}
          {conflictingExams > 0 && (
            <Alert className="mb-6 border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <AlertDescription className="font-vazir text-orange-700">
                <strong>{conflictingExams} امتحان</strong> با تداخل زمانی وجود دارد. لطفاً برنامه را بازنگری کنید.
              </AlertDescription>
            </Alert>
          )}

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="glass border-primary/20 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-vazir text-muted-foreground">کل امتحانات</p>
                    <p className="text-xl md:text-2xl font-bold font-shabnam text-primary">{mockExamSchedule.length}</p>
                  </div>
                  <GraduationCap className="w-8 h-8 text-primary opacity-75" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass border-blue-200 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-vazir text-muted-foreground">برنامه‌ریزی شده</p>
                    <p className="text-xl md:text-2xl font-bold font-shabnam text-blue-600">{upcomingExams}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-600 opacity-75" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-orange-200 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-vazir text-muted-foreground">تداخل زمانی</p>
                    <p className="text-xl md:text-2xl font-bold font-shabnam text-orange-600">{conflictingExams}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-orange-600 opacity-75" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-green-200 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-vazir text-muted-foreground">تکمیل شده</p>
                    <p className="text-xl md:text-2xl font-bold font-shabnam text-green-600">
                      {mockExamSchedule.filter(e => e.status === 'completed').length}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600 opacity-75" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6 bg-white">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute right-3 top-3 text-muted-foreground" />
                    <Input
                      placeholder="جستجو در امتحانات..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-10 font-vazir bg-white"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-40 font-vazir bg-white">
                      <SelectValue placeholder="وضعیت" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                      <SelectItem value="scheduled">برنامه‌ریزی شده</SelectItem>
                      <SelectItem value="ongoing">در حال برگزاری</SelectItem>
                      <SelectItem value="completed">تکمیل شده</SelectItem>
                      <SelectItem value="cancelled">لغو شده</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-full sm:w-40 font-vazir bg-white">
                      <SelectValue placeholder="نوع امتحان" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">همه انواع</SelectItem>
                      <SelectItem value="midterm">میان‌ترم</SelectItem>
                      <SelectItem value="final">پایان‌ترم</SelectItem>
                      <SelectItem value="quiz">آزمونک</SelectItem>
                      <SelectItem value="practical">عملی</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exam Schedule List */}
          <div className="grid gap-4">
            {filteredExams.length === 0 ? (
              <Card className="bg-white">
                <CardContent className="p-8 text-center">
                  <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground font-vazir">هیچ امتحانی یافت نشد</p>
                </CardContent>
              </Card>
            ) : (
              filteredExams.map((exam) => (
                <Card key={exam.id} className={`hover:shadow-md transition-shadow bg-white ${exam.conflictWarning ? 'border-l-4 border-l-orange-500' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          {getStatusIcon(exam.status)}
                          <h3 className="font-semibold font-shabnam text-sm md:text-base">
                            امتحان {exam.subject}
                          </h3>
                          <Badge className={`text-xs ${getStatusBadge(exam.status)}`}>
                            {exam.status === 'scheduled' && 'برنامه‌ریزی شده'}
                            {exam.status === 'ongoing' && 'در حال برگزاری'}
                            {exam.status === 'completed' && 'تکمیل شده'}
                            {exam.status === 'cancelled' && 'لغو شده'}
                          </Badge>
                          <Badge className={`text-xs ${getTypeBadge(exam.examType)}`}>
                            {exam.examType === 'midterm' && 'میان‌ترم'}
                            {exam.examType === 'final' && 'پایان‌ترم'}
                            {exam.examType === 'quiz' && 'آزمونک'}
                            {exam.examType === 'practical' && 'عملی'}
                          </Badge>
                          {exam.conflictWarning && (
                            <Badge className="bg-orange-100 text-orange-800 text-xs">
                              <AlertTriangle className="w-3 h-3 ml-1" />
                              تداخل زمانی
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground font-vazir">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(exam.date).toLocaleDateString('fa-IR')}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground font-vazir">
                            <Clock className="w-3 h-3" />
                            <span>{exam.startTime} - {exam.endTime}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground font-vazir">
                            <User className="w-3 h-3" />
                            <span>{exam.teacher}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground font-vazir">
                            <MapPin className="w-3 h-3" />
                            <span>{exam.room}</span>
                          </div>
                        </div>

                        {exam.instructions && (
                          <p className="text-sm font-vazir text-muted-foreground mb-2">
                            📝 {exam.instructions}
                          </p>
                        )}

                        {exam.conflictWarning && exam.conflictDetails && (
                          <div className="p-2 bg-orange-50 border border-orange-200 rounded-lg mb-2">
                            <p className="text-sm font-vazir text-orange-700">
                              ⚠️ {exam.conflictDetails}
                            </p>
                          </div>
                        )}

                        {exam.materials && exam.materials.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            <span className="text-xs font-vazir text-muted-foreground ml-2">وسایل مورد نیاز:</span>
                            {exam.materials.map((material, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {material}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-row lg:flex-col gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="font-vazir bg-white">
                              <BookOpen className="w-3 h-3 ml-1" />
                              جزئیات
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl bg-white">
                            <DialogHeader>
                              <DialogTitle className="font-shabnam text-right">جزئیات امتحان</DialogTitle>
                            </DialogHeader>
                            <ExamDetailsView exam={exam} />
                          </DialogContent>
                        </Dialog>
                        
                        {user?.role === 'teacher' && exam.status === 'scheduled' && (
                          <Button variant="outline" size="sm" className="font-vazir bg-white">
                            ویرایش
                          </Button>
                        )}
                        
                        {exam.conflictWarning && (
                          <Button variant="outline" size="sm" className="font-vazir text-orange-600 hover:text-orange-700 bg-white">
                            <Bell className="w-3 h-3 ml-1" />
                            حل تداخل
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function AddExamForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    subject: "",
    teacher: "",
    date: "",
    startTime: "",
    endTime: "",
    room: "",
    examType: "midterm",
    instructions: "",
    materials: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Exam form submitted:", formData);
    onClose();
  };

  return (
    <div className="bg-white">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="font-shabnam">نام درس</Label>
            <Input
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              className="font-vazir bg-white"
              placeholder="مثل: ریاضی، فیزیک"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="font-shabnam">نام معلم</Label>
            <Input
              value={formData.teacher}
              onChange={(e) => setFormData({...formData, teacher: e.target.value})}
              className="font-vazir bg-white"
              placeholder="نام کامل معلم"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="font-shabnam">تاریخ امتحان</Label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="bg-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="font-shabnam">ساعت شروع</Label>
            <Input
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({...formData, startTime: e.target.value})}
              className="bg-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="font-shabnam">ساعت پایان</Label>
            <Input
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData({...formData, endTime: e.target.value})}
              className="bg-white"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="font-shabnam">محل امتحان</Label>
            <Input
              value={formData.room}
              onChange={(e) => setFormData({...formData, room: e.target.value})}
              className="font-vazir bg-white"
              placeholder="کلاس یا آزمایشگاه"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="font-shabnam">نوع امتحان</Label>
            <Select value={formData.examType} onValueChange={(value) => setFormData({...formData, examType: value})}>
              <SelectTrigger className="bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="midterm">میان‌ترم</SelectItem>
                <SelectItem value="final">پایان‌ترم</SelectItem>
                <SelectItem value="quiz">آزمونک</SelectItem>
                <SelectItem value="practical">عملی</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-shabnam">دستورالعمل امتحان</Label>
          <Textarea
            value={formData.instructions}
            onChange={(e) => setFormData({...formData, instructions: e.target.value})}
            className="font-vazir min-h-20 bg-white"
            placeholder="دستورالعمل‌ها و نکات مهم برای دانش‌آموزان..."
          />
        </div>

        <div className="space-y-2">
          <Label className="font-shabnam">وسایل مورد نیاز</Label>
          <Input
            value={formData.materials}
            onChange={(e) => setFormData({...formData, materials: e.target.value})}
            className="font-vazir bg-white"
            placeholder="مثل: ماشین‌حساب، خودکار آبی، مداد (با کامل جدا کنید)"
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="font-vazir bg-white">
            انصراف
          </Button>
          <Button type="submit" className="gradient-primary text-white font-vazir">
            ایجاد امتحان
          </Button>
        </div>
      </form>
    </div>
  );
}

function ExamDetailsView({ exam }: { exam: ExamSchedule }) {
  return (
    <div className="bg-white max-h-96 overflow-y-auto">
      <div className="space-y-4 p-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="font-shabnam text-sm text-muted-foreground">نام درس</Label>
            <p className="font-vazir font-medium">{exam.subject}</p>
          </div>
          <div>
            <Label className="font-shabnam text-sm text-muted-foreground">معلم</Label>
            <p className="font-vazir font-medium">{exam.teacher}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="font-shabnam text-sm text-muted-foreground">تاریخ</Label>
            <p className="font-vazir font-medium">{new Date(exam.date).toLocaleDateString('fa-IR')}</p>
          </div>
          <div>
            <Label className="font-shabnam text-sm text-muted-foreground">ساعت</Label>
            <p className="font-vazir font-medium">{exam.startTime} - {exam.endTime}</p>
          </div>
          <div>
            <Label className="font-shabnam text-sm text-muted-foreground">مدت زمان</Label>
            <p className="font-vazir font-medium">{exam.duration} دقیقه</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="font-shabnam text-sm text-muted-foreground">محل برگزاری</Label>
            <p className="font-vazir font-medium">{exam.room}</p>
          </div>
          <div>
            <Label className="font-shabnam text-sm text-muted-foreground">تعداد دانش‌آموزان</Label>
            <p className="font-vazir font-medium">{exam.students} نفر</p>
          </div>
        </div>

        {exam.instructions && (
          <div>
            <Label className="font-shabnam text-sm text-muted-foreground">دستورالعمل امتحان</Label>
            <p className="font-vazir text-sm mt-2 p-3 bg-blue-50 rounded-lg">{exam.instructions}</p>
          </div>
        )}

        {exam.materials && exam.materials.length > 0 && (
          <div>
            <Label className="font-shabnam text-sm text-muted-foreground">وسایل مورد نیاز</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {exam.materials.map((material, index) => (
                <Badge key={index} variant="outline">
                  {material}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {exam.conflictWarning && exam.conflictDetails && (
          <div>
            <Label className="font-shabnam text-sm text-muted-foreground">هشدار تداخل</Label>
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg mt-2">
              <p className="font-vazir text-sm text-orange-700">{exam.conflictDetails}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="font-shabnam text-sm text-muted-foreground">ایجاد شده توسط</Label>
            <p className="font-vazir font-medium">{exam.createdBy}</p>
          </div>
          <div>
            <Label className="font-shabnam text-sm text-muted-foreground">تاریخ ایجاد</Label>
            <p className="font-vazir font-medium">{new Date(exam.createdAt).toLocaleDateString('fa-IR')}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge className={`${getStatusBadge(exam.status)}`}>
            {exam.status === 'scheduled' && 'برنامه‌ریزی شده'}
            {exam.status === 'ongoing' && 'در حال برگزاری'}
            {exam.status === 'completed' && 'تکمیل شده'}
            {exam.status === 'cancelled' && 'لغو شده'}
          </Badge>
          <Badge className={`${getTypeBadge(exam.examType)}`}>
            {exam.examType === 'midterm' && 'میان‌ترم'}
            {exam.examType === 'final' && 'پایان‌ترم'}
            {exam.examType === 'quiz' && 'آزمونک'}
            {exam.examType === 'practical' && 'عملی'}
          </Badge>
        </div>
      </div>
    </div>
  );
}

function getStatusBadge(status: string) {
  const variants = {
    scheduled: "bg-blue-100 text-blue-800",
    ongoing: "bg-green-100 text-green-800", 
    completed: "bg-gray-100 text-gray-800",
    cancelled: "bg-red-100 text-red-800"
  };
  return variants[status as keyof typeof variants] || variants.scheduled;
}

function getTypeBadge(type: string) {
  const variants = {
    midterm: "bg-orange-100 text-orange-800",
    final: "bg-red-100 text-red-800",
    quiz: "bg-blue-100 text-blue-800",
    practical: "bg-purple-100 text-purple-800"
  };
  return variants[type as keyof typeof variants] || variants.quiz;
}