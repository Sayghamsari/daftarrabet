import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import LoadingSpinner from "@/components/common/loading-spinner";
import { 
  Award, 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  User,
  Eye,
  Edit3,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Trophy,
  Medal,
  BookOpen,
  Users,
  TrendingUp,
  Heart,
  Zap
} from "lucide-react";

interface Achievement {
  id: string;
  studentId: string;
  studentName: string;
  teacherId?: string;
  teacherName?: string;
  schoolName: string;
  achievementType: string;
  title: string;
  description: string;
  points: number;
  category: 'academic' | 'social' | 'sport' | 'art' | 'behavior' | 'participation';
  awardDate: string;
  status: 'active' | 'expired';
}

const mockAchievements: Achievement[] = [
  {
    id: "1",
    studentId: "student-001",
    studentName: "علی محمدی",
    teacherId: "teacher-001",
    teacherName: "خانم احمدی",
    schoolName: "دبیرستان شهید چمران",
    achievementType: "academic_excellence",
    title: "برترین دانش‌آموز ریاضی",
    description: "کسب نمره کامل در آزمون ریاضی ماهانه",
    points: 5.0,
    category: "academic",
    awardDate: "2024-01-15",
    status: "active"
  },
  {
    id: "2",
    studentId: "student-002",
    studentName: "زهرا کریمی",
    teacherId: "teacher-002",
    teacherName: "آقای رضایی",
    schoolName: "دبیرستان شهید چمران",
    achievementType: "good_behavior",
    title: "کارت امتیاز رفتار نمونه",
    description: "رفتار مثبت و کمک به همکلاسی‌ها",
    points: 3.0,
    category: "behavior",
    awardDate: "2024-01-14",
    status: "active"
  },
  {
    id: "3",
    studentId: "student-003",
    studentName: "محمد رضایی",
    teacherId: "teacher-003",
    teacherName: "خانم صادقی",
    schoolName: "دبیرستان شهید چمران",
    achievementType: "participation",
    title: "فعالیت برتر در کلاس",
    description: "شرکت فعال در بحث‌های کلاسی و ارائه پروژه",
    points: 2.5,
    category: "participation",
    awardDate: "2024-01-16",
    status: "active"
  },
  {
    id: "4",
    studentId: "student-004",
    studentName: "فاطمه احمدی",
    teacherId: "teacher-001",
    teacherName: "خانم احمدی",
    schoolName: "دبیرستان شهید چمران",
    achievementType: "art_excellence",
    title: "برگزیده مسابقه نقاشی",
    description: "کسب رتبه اول در مسابقه نقاشی مدرسه",
    points: 4.0,
    category: "art",
    awardDate: "2024-01-13",
    status: "active"
  }
];

export default function AchievementsDashboard() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <LoadingSpinner />
      </div>
    );
  }

  const filteredAchievements = mockAchievements.filter(achievement => {
    const matchesSearch = achievement.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         achievement.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || achievement.category === filterCategory;
    const matchesStatus = filterStatus === "all" || achievement.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getCategoryBadge = (category: string) => {
    const variants = {
      academic: "bg-blue-100 text-blue-800",
      social: "bg-green-100 text-green-800", 
      sport: "bg-orange-100 text-orange-800",
      art: "bg-purple-100 text-purple-800",
      behavior: "bg-pink-100 text-pink-800",
      participation: "bg-yellow-100 text-yellow-800"
    };
    return variants[category as keyof typeof variants] || variants.academic;
  };

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'academic': return <BookOpen className="w-4 h-4 text-blue-500" />;
      case 'social': return <Users className="w-4 h-4 text-green-500" />;
      case 'sport': return <Trophy className="w-4 h-4 text-orange-500" />;
      case 'art': return <Star className="w-4 h-4 text-purple-500" />;
      case 'behavior': return <Heart className="w-4 h-4 text-pink-500" />;
      case 'participation': return <Zap className="w-4 h-4 text-yellow-500" />;
      default: return <Award className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-white">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold font-shabnam text-gradient mb-2">
                سیستم کارت امتیاز
              </h1>
              <p className="text-sm md:text-base text-muted-foreground font-vazir">
                مدیریت امتیازات و دستاوردهای دانش‌آموزان - دبیرستان شهید چمران
              </p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-primary text-white hover:opacity-90 font-shabnam">
                  <Plus className="w-4 h-4 ml-2" />
                  اعطای کارت امتیاز
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto bg-white">
                <DialogHeader>
                  <DialogTitle className="font-shabnam text-right">اعطای کارت امتیاز جدید</DialogTitle>
                </DialogHeader>
                <AddAchievementForm onClose={() => setIsAddDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="glass border-primary/20 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-vazir text-muted-foreground">کل امتیازات</p>
                    <p className="text-xl md:text-2xl font-bold font-shabnam text-primary">45</p>
                  </div>
                  <Award className="w-8 h-8 text-primary opacity-75" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass border-blue-200 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-vazir text-muted-foreground">امتیاز تحصیلی</p>
                    <p className="text-xl md:text-2xl font-bold font-shabnam text-blue-600">18</p>
                  </div>
                  <BookOpen className="w-8 h-8 text-blue-600 opacity-75" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-green-200 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-vazir text-muted-foreground">امتیاز رفتاری</p>
                    <p className="text-xl md:text-2xl font-bold font-shabnam text-green-600">15</p>
                  </div>
                  <Heart className="w-8 h-8 text-green-600 opacity-75" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-orange-200 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-vazir text-muted-foreground">امتیاز فعالیت</p>
                    <p className="text-xl md:text-2xl font-bold font-shabnam text-orange-600">12</p>
                  </div>
                  <Trophy className="w-8 h-8 text-orange-600 opacity-75" />
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
                      placeholder="جستجو در کارت‌های امتیاز..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-10 font-vazir bg-white"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-full sm:w-40 font-vazir bg-white">
                      <SelectValue placeholder="دسته‌بندی" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">همه دسته‌ها</SelectItem>
                      <SelectItem value="academic">تحصیلی</SelectItem>
                      <SelectItem value="behavior">رفتاری</SelectItem>
                      <SelectItem value="social">اجتماعی</SelectItem>
                      <SelectItem value="sport">ورزشی</SelectItem>
                      <SelectItem value="art">هنری</SelectItem>
                      <SelectItem value="participation">مشارکت</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-40 font-vazir bg-white">
                      <SelectValue placeholder="وضعیت" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                      <SelectItem value="active">فعال</SelectItem>
                      <SelectItem value="expired">منقضی</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements List */}
          <div className="grid gap-4">
            {filteredAchievements.length === 0 ? (
              <Card className="bg-white">
                <CardContent className="p-8 text-center">
                  <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground font-vazir">هیچ کارت امتیازی یافت نشد</p>
                </CardContent>
              </Card>
            ) : (
              filteredAchievements.map((achievement) => (
                <Card key={achievement.id} className="hover:shadow-md transition-shadow bg-white">
                  <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          {getCategoryIcon(achievement.category)}
                          <h3 className="font-semibold font-shabnam text-sm md:text-base">{achievement.title}</h3>
                          <Badge className={`text-xs ${getCategoryBadge(achievement.category)}`}>
                            {achievement.category === 'academic' && 'تحصیلی'}
                            {achievement.category === 'social' && 'اجتماعی'} 
                            {achievement.category === 'sport' && 'ورزشی'}
                            {achievement.category === 'art' && 'هنری'}
                            {achievement.category === 'behavior' && 'رفتاری'}
                            {achievement.category === 'participation' && 'مشارکت'}
                          </Badge>
                          <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                            {achievement.points} امتیاز
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-muted-foreground font-vazir mb-2">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{achievement.studentName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(achievement.awardDate).toLocaleDateString('fa-IR')}</span>
                          </div>
                          {achievement.teacherName && (
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span>{achievement.teacherName}</span>
                            </div>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mt-2 font-vazir line-clamp-2">
                          {achievement.description}
                        </p>
                      </div>

                      <div className="flex flex-row lg:flex-col gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="font-vazir bg-white">
                              <Eye className="w-3 h-3 ml-1" />
                              مشاهده
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl bg-white">
                            <DialogHeader>
                              <DialogTitle className="font-shabnam text-right">جزئیات کارت امتیاز</DialogTitle>
                            </DialogHeader>
                            <AchievementDetailsView achievement={achievement} />
                          </DialogContent>
                        </Dialog>
                        
                        <Button variant="outline" size="sm" className="font-vazir bg-white">
                          <Edit3 className="w-3 h-3 ml-1" />
                          ویرایش
                        </Button>
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

function AddAchievementForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    studentId: "",
    achievementType: "",
    category: "academic",
    title: "",
    description: "",
    points: "",
    awardDate: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Achievement form submitted:", formData);
    onClose();
  };

  return (
    <div className="bg-white">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="font-shabnam">دانش‌آموز</Label>
            <Select value={formData.studentId} onValueChange={(value) => setFormData({...formData, studentId: value})}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="انتخاب دانش‌آموز" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="student-001">علی محمدی</SelectItem>
                <SelectItem value="student-002">زهرا کریمی</SelectItem>
                <SelectItem value="student-003">محمد رضایی</SelectItem>
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
                <SelectItem value="academic">تحصیلی</SelectItem>
                <SelectItem value="behavior">رفتاری</SelectItem>
                <SelectItem value="social">اجتماعی</SelectItem>
                <SelectItem value="sport">ورزشی</SelectItem>
                <SelectItem value="art">هنری</SelectItem>
                <SelectItem value="participation">مشارکت</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-shabnam">عنوان</Label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="font-vazir bg-white"
            placeholder="عنوان کارت امتیاز"
          />
        </div>

        <div className="space-y-2">
          <Label className="font-shabnam">توضیحات</Label>
          <Textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="font-vazir min-h-20 bg-white"
            placeholder="توضیحات کامل دستاورد..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="font-shabnam">امتیاز</Label>
            <Input
              type="number"
              step="0.1"
              value={formData.points}
              onChange={(e) => setFormData({...formData, points: e.target.value})}
              className="font-vazir bg-white"
              placeholder="0.0"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-shabnam">تاریخ اعطا</Label>
            <Input
              type="date"
              value={formData.awardDate}
              onChange={(e) => setFormData({...formData, awardDate: e.target.value})}
              className="font-vazir bg-white"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="font-vazir bg-white">
            انصراف
          </Button>
          <Button type="submit" className="gradient-primary text-white font-vazir">
            اعطای کارت امتیاز
          </Button>
        </div>
      </form>
    </div>
  );
}

function AchievementDetailsView({ achievement }: { achievement: Achievement }) {
  return (
    <div className="bg-white">
      <ScrollArea className="max-h-96">
        <div className="space-y-4 p-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="font-shabnam text-sm text-muted-foreground">دانش‌آموز</Label>
              <p className="font-vazir font-medium">{achievement.studentName}</p>
            </div>
            <div>
              <Label className="font-shabnam text-sm text-muted-foreground">معلم اعطاکننده</Label>
              <p className="font-vazir font-medium">{achievement.teacherName || 'نامشخص'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="font-shabnam text-sm text-muted-foreground">مدرسه</Label>
              <p className="font-vazir font-medium">{achievement.schoolName}</p>
            </div>
            <div>
              <Label className="font-shabnam text-sm text-muted-foreground">تاریخ اعطا</Label>
              <p className="font-vazir font-medium">{new Date(achievement.awardDate).toLocaleDateString('fa-IR')}</p>
            </div>
          </div>

          <Separator />

          <div>
            <Label className="font-shabnam text-sm text-muted-foreground">عنوان</Label>
            <p className="font-vazir font-medium">{achievement.title}</p>
          </div>

          <div>
            <Label className="font-shabnam text-sm text-muted-foreground">توضیحات</Label>
            <p className="font-vazir text-sm">{achievement.description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge className="bg-yellow-100 text-yellow-800">
              {achievement.points} امتیاز
            </Badge>
            <Badge className="bg-blue-100 text-blue-800">
              {achievement.category === 'academic' && 'تحصیلی'}
              {achievement.category === 'social' && 'اجتماعی'} 
              {achievement.category === 'sport' && 'ورزشی'}
              {achievement.category === 'art' && 'هنری'}
              {achievement.category === 'behavior' && 'رفتاری'}
              {achievement.category === 'participation' && 'مشارکت'}
            </Badge>
            <Badge className="bg-green-100 text-green-800">
              {achievement.status === 'active' ? 'فعال' : 'منقضی'}
            </Badge>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}