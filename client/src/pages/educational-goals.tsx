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
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import LoadingSpinner from "@/components/common/loading-spinner";
import { Link } from "wouter";
import { 
  Target, 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  CheckCircle,
  Clock,
  TrendingUp,
  BookOpen,
  Trophy,
  Star,
  AlertTriangle,
  Eye,
  Edit3,
  Trash2,
  Home
} from "lucide-react";

interface EducationalGoal {
  id: string;
  title: string;
  description: string;
  subject: string;
  targetGrade: number;
  currentGrade: number;
  targetDate: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'completed' | 'paused' | 'failed';
  category: 'academic' | 'skill' | 'behavior' | 'participation';
  progress: number;
  milestones: Milestone[];
  createdDate: string;
  completedDate?: string;
  teacher: string;
  notes?: string;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  isCompleted: boolean;
  completedDate?: string;
  weight: number; // percentage of the goal
}

const mockGoals: EducationalGoal[] = [
  {
    id: "1",
    title: "بهبود نمره ریاضی",
    description: "رسیدن نمره ریاضی از 16 به 18 تا پایان ترم",
    subject: "ریاضی",
    targetGrade: 18,
    currentGrade: 16,
    targetDate: "2024-06-15",
    priority: "high",
    status: "active",
    category: "academic",
    progress: 65,
    teacher: "خانم احمدی",
    createdDate: "2024-01-10",
    milestones: [
      {
        id: "m1",
        title: "تمرین‌های اضافی",
        description: "حل 20 سوال اضافی هر هفته",
        targetDate: "2024-03-01",
        isCompleted: true,
        completedDate: "2024-02-28",
        weight: 30
      },
      {
        id: "m2", 
        title: "آزمون میان‌ترم",
        description: "کسب نمره بالای 17 در آزمون میان‌ترم",
        targetDate: "2024-04-15",
        isCompleted: true,
        completedDate: "2024-04-14",
        weight: 40
      },
      {
        id: "m3",
        title: "پروژه نهایی",
        description: "تحویل پروژه ریاضی با کیفیت عالی",
        targetDate: "2024-06-01",
        isCompleted: false,
        weight: 30
      }
    ]
  },
  {
    id: "2",
    title: "تقویت مهارت نوشتن انگلیسی",
    description: "بهبود مهارت نگارش انگلیسی و رسیدن به سطح intermediate",
    subject: "انگلیسی", 
    targetGrade: 17,
    currentGrade: 14,
    targetDate: "2024-07-20",
    priority: "medium",
    status: "active",
    category: "skill",
    progress: 40,
    teacher: "خانم رحیمی",
    createdDate: "2024-02-01",
    milestones: [
      {
        id: "m4",
        title: "واژگان پایه",
        description: "یادگیری 500 لغت جدید",
        targetDate: "2024-04-01",
        isCompleted: true,
        completedDate: "2024-03-25",
        weight: 25
      },
      {
        id: "m5",
        title: "نوشتن مقاله‌های کوتاه",
        description: "نوشتن 10 مقاله کوتاه",
        targetDate: "2024-06-01",
        isCompleted: false,
        weight: 50
      },
      {
        id: "m6",
        title: "آزمون نهایی",
        description: "کسب نمره بالای 16 در آزمون نهایی",
        targetDate: "2024-07-15",
        isCompleted: false,
        weight: 25
      }
    ]
  },
  {
    id: "3",
    title: "بهبود رفتار کلاسی",
    description: "کاهش تعداد اخطار انضباطی و مشارکت بیشتر در کلاس",
    subject: "رفتار عمومی",
    targetGrade: 20,
    currentGrade: 17,
    targetDate: "2024-06-30",
    priority: "critical",
    status: "active", 
    category: "behavior",
    progress: 80,
    teacher: "خانم موسوی (معاون)",
    createdDate: "2024-01-15",
    notes: "نیاز به پیگیری مستمر دارد",
    milestones: [
      {
        id: "m7",
        title: "کاهش اخطارها",
        description: "حداکثر 2 اخطار در ماه",
        targetDate: "2024-04-01",
        isCompleted: true,
        completedDate: "2024-03-30",
        weight: 40
      },
      {
        id: "m8",
        title: "مشارکت فعال",
        description: "حداقل 3 بار مشارکت در هر کلاس",
        targetDate: "2024-05-15",
        isCompleted: true,
        completedDate: "2024-05-10",
        weight: 35
      },
      {
        id: "m9",
        title: "رهبری پروژه گروهی",
        description: "رهبری یک پروژه گروهی موفق",
        targetDate: "2024-06-20",
        isCompleted: false,
        weight: 25
      }
    ]
  },
  {
    id: "4",
    title: "تسلط بر مفاهیم فیزیک",
    description: "درک عمیق قوانین نیوتن و کاربردهای آن",
    subject: "فیزیک",
    targetGrade: 19,
    currentGrade: 18,
    targetDate: "2024-05-30",
    priority: "medium",
    status: "completed",
    category: "academic",
    progress: 100,
    teacher: "آقای رضایی",
    createdDate: "2024-01-20",
    completedDate: "2024-05-25",
    milestones: [
      {
        id: "m10",
        title: "مطالعه تئوری",
        description: "مطالعه کامل فصل قوانین نیوتن",
        targetDate: "2024-03-15",
        isCompleted: true,
        completedDate: "2024-03-12",
        weight: 30
      },
      {
        id: "m11",
        title: "حل مسائل",
        description: "حل 50 مسئله کاربردی",
        targetDate: "2024-04-30",
        isCompleted: true,
        completedDate: "2024-04-28",
        weight: 40
      },
      {
        id: "m12",
        title: "آزمون عملی",
        description: "انجام آزمایش و تحلیل نتایج",
        targetDate: "2024-05-20",
        isCompleted: true,
        completedDate: "2024-05-18",
        weight: 30
      }
    ]
  }
];

export default function EducationalGoals() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <LoadingSpinner />
      </div>
    );
  }

  const filteredGoals = mockGoals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || goal.status === filterStatus;
    const matchesCategory = filterCategory === "all" || goal.category === filterCategory;
    const matchesPriority = filterPriority === "all" || goal.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      paused: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800"
    };
    return variants[status as keyof typeof variants] || variants.active;
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      low: "bg-gray-100 text-gray-800",
      medium: "bg-blue-100 text-blue-800",
      high: "bg-yellow-100 text-yellow-800",
      critical: "bg-red-100 text-red-800"
    };
    return variants[priority as keyof typeof variants] || variants.medium;
  };

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'academic': return <BookOpen className="w-4 h-4 text-blue-500" />;
      case 'skill': return <Star className="w-4 h-4 text-purple-500" />;
      case 'behavior': return <Target className="w-4 h-4 text-orange-500" />;
      case 'participation': return <Trophy className="w-4 h-4 text-green-500" />;
      default: return <Target className="w-4 h-4 text-gray-500" />;
    }
  };

  const activeGoals = mockGoals.filter(g => g.status === 'active').length;
  const completedGoals = mockGoals.filter(g => g.status === 'completed').length;
  const averageProgress = mockGoals.filter(g => g.status === 'active').reduce((acc, goal) => acc + goal.progress, 0) / activeGoals || 0;

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
                اهداف تحصیلی
              </h1>
              <p className="text-sm md:text-base text-muted-foreground font-vazir">
                تعیین، پیگیری و ارزیابی اهداف آموزشی - دبیرستان شهید چمران
              </p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-primary text-white hover:opacity-90 font-shabnam">
                  <Plus className="w-4 h-4 ml-2" />
                  هدف جدید
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto bg-white">
                <DialogHeader>
                  <DialogTitle className="font-shabnam text-right">تعریف هدف جدید</DialogTitle>
                </DialogHeader>
                <AddGoalForm onClose={() => setIsAddDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="glass border-primary/20 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-vazir text-muted-foreground">اهداف فعال</p>
                    <p className="text-xl md:text-2xl font-bold font-shabnam text-primary">{activeGoals}</p>
                  </div>
                  <Target className="w-8 h-8 text-primary opacity-75" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass border-green-200 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-vazir text-muted-foreground">تکمیل شده</p>
                    <p className="text-xl md:text-2xl font-bold font-shabnam text-green-600">{completedGoals}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600 opacity-75" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-blue-200 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-vazir text-muted-foreground">میانگین پیشرفت</p>
                    <p className="text-xl md:text-2xl font-bold font-shabnam text-blue-600">{Math.round(averageProgress)}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-600 opacity-75" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-orange-200 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-vazir text-muted-foreground">نزدیک ددلاین</p>
                    <p className="text-xl md:text-2xl font-bold font-shabnam text-orange-600">2</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-orange-600 opacity-75" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6 bg-white">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute right-3 top-3 text-muted-foreground" />
                    <Input
                      placeholder="جستجو در اهداف..."
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
                      <SelectItem value="active">فعال</SelectItem>
                      <SelectItem value="completed">تکمیل شده</SelectItem>
                      <SelectItem value="paused">متوقف</SelectItem>
                      <SelectItem value="failed">ناموفق</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-full sm:w-40 font-vazir bg-white">
                      <SelectValue placeholder="دسته‌بندی" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">همه دسته‌ها</SelectItem>
                      <SelectItem value="academic">آموزشی</SelectItem>
                      <SelectItem value="skill">مهارتی</SelectItem>
                      <SelectItem value="behavior">رفتاری</SelectItem>
                      <SelectItem value="participation">مشارکت</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterPriority} onValueChange={setFilterPriority}>
                    <SelectTrigger className="w-full sm:w-40 font-vazir bg-white">
                      <SelectValue placeholder="اولویت" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">همه اولویت‌ها</SelectItem>
                      <SelectItem value="low">کم</SelectItem>
                      <SelectItem value="medium">متوسط</SelectItem>
                      <SelectItem value="high">بالا</SelectItem>
                      <SelectItem value="critical">بحرانی</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Goals List */}
          <div className="grid gap-4">
            {filteredGoals.length === 0 ? (
              <Card className="bg-white">
                <CardContent className="p-8 text-center">
                  <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground font-vazir">هیچ هدفی یافت نشد</p>
                </CardContent>
              </Card>
            ) : (
              filteredGoals.map((goal) => (
                <Card key={goal.id} className="hover:shadow-md transition-shadow bg-white">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          {getCategoryIcon(goal.category)}
                          <h3 className="font-semibold font-shabnam text-base md:text-lg">
                            {goal.title}
                          </h3>
                          <Badge className={`text-xs ${getStatusBadge(goal.status)}`}>
                            {goal.status === 'active' && 'فعال'}
                            {goal.status === 'completed' && 'تکمیل شده'}
                            {goal.status === 'paused' && 'متوقف'}
                            {goal.status === 'failed' && 'ناموفق'}
                          </Badge>
                          <Badge className={`text-xs ${getPriorityBadge(goal.priority)}`}>
                            {goal.priority === 'low' && 'کم'}
                            {goal.priority === 'medium' && 'متوسط'}
                            {goal.priority === 'high' && 'بالا'}
                            {goal.priority === 'critical' && 'بحرانی'}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-4 font-vazir">
                          {goal.description}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs font-vazir text-muted-foreground mb-1">درس</p>
                            <p className="text-sm font-bold font-shabnam">{goal.subject}</p>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs font-vazir text-muted-foreground mb-1">نمره فعلی</p>
                            <p className="text-sm font-bold font-shabnam">{goal.currentGrade}</p>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs font-vazir text-muted-foreground mb-1">نمره هدف</p>
                            <p className="text-sm font-bold font-shabnam">{goal.targetGrade}</p>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between items-center">
                            <span className="font-vazir text-sm">پیشرفت کلی</span>
                            <span className="font-dana font-bold text-sm">{goal.progress}%</span>
                          </div>
                          <Progress value={goal.progress} className="h-2" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground font-vazir">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>ددلاین: {new Date(goal.targetDate).toLocaleDateString('fa-IR')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            <span>معلم: {goal.teacher}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row lg:flex-col gap-2 lg:w-32">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="font-vazir flex-1 lg:flex-none bg-white">
                              <Eye className="w-3 h-3 ml-1" />
                              جزئیات
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl bg-white">
                            <DialogHeader>
                              <DialogTitle className="font-shabnam text-right">جزئیات هدف تحصیلی</DialogTitle>
                            </DialogHeader>
                            <GoalDetailsView goal={goal} />
                          </DialogContent>
                        </Dialog>
                        
                        {goal.status === 'active' && (
                          <>
                            <Button variant="outline" size="sm" className="font-vazir flex-1 lg:flex-none bg-white">
                              <Edit3 className="w-3 h-3 ml-1" />
                              ویرایش
                            </Button>
                            <Button variant="outline" size="sm" className="font-vazir flex-1 lg:flex-none text-red-600 hover:text-red-700 bg-white">
                              <Trash2 className="w-3 h-3 ml-1" />
                              حذف
                            </Button>
                          </>
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

function AddGoalForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    targetGrade: "",
    currentGrade: "",
    targetDate: "",
    priority: "medium",
    category: "academic",
    teacher: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Goal form submitted:", formData);
    onClose();
  };

  return (
    <div className="bg-white">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label className="font-shabnam">عنوان هدف</Label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="font-vazir bg-white"
            placeholder="مثل: بهبود نمره ریاضی"
            required
          />
        </div>

        <div className="space-y-2">
          <Label className="font-shabnam">شرح هدف</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="font-vazir min-h-20 bg-white"
            placeholder="توضیح کاملی از هدف تحصیلی خود بنویسید..."
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="font-shabnam">درس</Label>
            <Input
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              className="font-vazir bg-white"
              placeholder="نام درس"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="font-shabnam">نمره فعلی</Label>
            <Input
              type="number"
              min="0"
              max="20"
              value={formData.currentGrade}
              onChange={(e) => setFormData({...formData, currentGrade: e.target.value})}
              className="font-vazir bg-white"
              placeholder="16"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="font-shabnam">نمره هدف</Label>
            <Input
              type="number"
              min="0"
              max="20"
              value={formData.targetGrade}
              onChange={(e) => setFormData({...formData, targetGrade: e.target.value})}
              className="font-vazir bg-white"
              placeholder="18"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="font-shabnam">ددلاین</Label>
            <Input
              type="date"
              value={formData.targetDate}
              onChange={(e) => setFormData({...formData, targetDate: e.target.value})}
              className="bg-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="font-shabnam">اولویت</Label>
            <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
              <SelectTrigger className="bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="low">کم</SelectItem>
                <SelectItem value="medium">متوسط</SelectItem>
                <SelectItem value="high">بالا</SelectItem>
                <SelectItem value="critical">بحرانی</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="font-shabnam">دسته‌بندی</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
              <SelectTrigger className="bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="academic">آموزشی</SelectItem>
                <SelectItem value="skill">مهارتی</SelectItem>
                <SelectItem value="behavior">رفتاری</SelectItem>
                <SelectItem value="participation">مشارکت</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-shabnam">معلم مربوطه</Label>
          <Input
            value={formData.teacher}
            onChange={(e) => setFormData({...formData, teacher: e.target.value})}
            className="font-vazir bg-white"
            placeholder="نام معلم"
            required
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="font-vazir bg-white">
            انصراف
          </Button>
          <Button type="submit" className="gradient-primary text-white font-vazir">
            ایجاد هدف
          </Button>
        </div>
      </form>
    </div>
  );
}

function GoalDetailsView({ goal }: { goal: EducationalGoal }) {
  const completedMilestones = goal.milestones.filter(m => m.isCompleted).length;
  
  return (
    <div className="bg-white max-h-96 overflow-y-auto">
      <div className="space-y-6 p-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="font-shabnam text-sm text-muted-foreground">عنوان هدف</Label>
            <p className="font-vazir font-medium">{goal.title}</p>
          </div>
          <div>
            <Label className="font-shabnam text-sm text-muted-foreground">معلم مربوطه</Label>
            <p className="font-vazir font-medium">{goal.teacher}</p>
          </div>
        </div>

        <div>
          <Label className="font-shabnam text-sm text-muted-foreground">شرح هدف</Label>
          <p className="font-vazir text-sm mt-2 p-3 bg-gray-50 rounded-lg">{goal.description}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className="text-xs font-vazir text-muted-foreground mb-1">درس</p>
            <p className="font-bold font-shabnam">{goal.subject}</p>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <p className="text-xs font-vazir text-muted-foreground mb-1">نمره فعلی</p>
            <p className="font-bold font-shabnam">{goal.currentGrade}</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-xs font-vazir text-muted-foreground mb-1">نمره هدف</p>
            <p className="font-bold font-shabnam">{goal.targetGrade}</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <p className="text-xs font-vazir text-muted-foreground mb-1">پیشرفت</p>
            <p className="font-bold font-shabnam">{goal.progress}%</p>
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="font-shabnam font-semibold mb-3">نقاط عطف ({completedMilestones}/{goal.milestones.length})</h4>
          <div className="space-y-3">
            {goal.milestones.map((milestone) => (
              <div key={milestone.id} className={`p-3 rounded-lg border ${milestone.isCompleted ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {milestone.isCompleted ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Clock className="w-4 h-4 text-gray-400" />
                    )}
                    <span className="font-shabnam font-medium text-sm">{milestone.title}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {milestone.weight}%
                  </Badge>
                </div>
                <p className="text-xs font-vazir text-muted-foreground mb-2">
                  {milestone.description}
                </p>
                <div className="flex justify-between text-xs font-vazir text-muted-foreground">
                  <span>ددلاین: {new Date(milestone.targetDate).toLocaleDateString('fa-IR')}</span>
                  {milestone.completedDate && (
                    <span className="text-green-600">
                      تکمیل: {new Date(milestone.completedDate).toLocaleDateString('fa-IR')}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {goal.notes && (
          <div>
            <Label className="font-shabnam text-sm text-muted-foreground">یادداشت‌ها</Label>
            <p className="font-vazir text-sm mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              {goal.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}