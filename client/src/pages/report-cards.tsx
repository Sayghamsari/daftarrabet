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
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  User,
  Eye,
  Edit3,
  Download,
  Send,
  GraduationCap,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  TrendingUp,
  School,
  Award
} from "lucide-react";

interface ReportCard {
  id: string;
  studentId: string;
  studentName: string;
  schoolName: string;
  semester: 'first' | 'second';
  academicYear: string;
  disciplinaryGrade: number;
  behaviorGrade: number;
  overallGrade: number;
  teacherComments?: string;
  principalComments?: string;
  parentNotified: boolean;
  issuedAt: string;
  status: 'draft' | 'issued' | 'sent';
}

const mockReportCards: ReportCard[] = [
  {
    id: "1",
    studentId: "student-001",
    studentName: "علی محمدی",
    schoolName: "دبیرستان شهید چمران",
    semester: "first",
    academicYear: "1402-1403",
    disciplinaryGrade: 18.5,
    behaviorGrade: 19.0,
    overallGrade: 18.75,
    teacherComments: "دانش‌آموز با انگیزه و مسئولیت‌پذیر",
    principalComments: "عملکرد قابل تقدیر در زمینه انضباط",
    parentNotified: true,
    issuedAt: "2024-01-15",
    status: "sent"
  },
  {
    id: "2",
    studentId: "student-002",
    studentName: "زهرا کریمی",
    schoolName: "دبیرستان شهید چمران",
    semester: "first",
    academicYear: "1402-1403",
    disciplinaryGrade: 17.0,
    behaviorGrade: 18.5,
    overallGrade: 17.75,
    teacherComments: "نیاز به بهبود در پایبندی به قوانین کلاس",
    principalComments: "پیشرفت مثبت در ترم جاری",
    parentNotified: false,
    issuedAt: "2024-01-16",
    status: "issued"
  },
  {
    id: "3",
    studentId: "student-003",
    studentName: "محمد رضایی",
    schoolName: "دبیرستان شهید چمران",
    semester: "first",
    academicYear: "1402-1403",
    disciplinaryGrade: 16.5,
    behaviorGrade: 17.0,
    overallGrade: 16.75,
    teacherComments: "نیاز به توجه بیشتر به موارد انضباطی",
    parentNotified: false,
    issuedAt: "2024-01-17",
    status: "draft"
  }
];

export default function ReportCards() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSemester, setFilterSemester] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <LoadingSpinner />
      </div>
    );
  }

  const filteredReportCards = mockReportCards.filter(card => {
    const matchesSearch = card.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSemester = filterSemester === "all" || card.semester === filterSemester;
    const matchesStatus = filterStatus === "all" || card.status === filterStatus;
    
    return matchesSearch && matchesSemester && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: "bg-gray-100 text-gray-800",
      issued: "bg-blue-100 text-blue-800",
      sent: "bg-green-100 text-green-800"
    };
    return variants[status as keyof typeof variants] || variants.draft;
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 18) return "text-green-600";
    if (grade >= 15) return "text-yellow-600";
    return "text-red-600";
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
                کارنامه‌های انضباطی
              </h1>
              <p className="text-sm md:text-base text-muted-foreground font-vazir">
                صدور و مدیریت کارنامه‌های انضباطی - دبیرستان شهید چمران
              </p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-primary text-white hover:opacity-90 font-shabnam">
                  <Plus className="w-4 h-4 ml-2" />
                  صدور کارنامه جدید
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto bg-white">
                <DialogHeader>
                  <DialogTitle className="font-shabnam text-right">صدور کارنامه انضباطی</DialogTitle>
                </DialogHeader>
                <AddReportCardForm onClose={() => setIsAddDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="glass border-primary/20 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-vazir text-muted-foreground">کل کارنامه‌ها</p>
                    <p className="text-xl md:text-2xl font-bold font-shabnam text-primary">45</p>
                  </div>
                  <FileText className="w-8 h-8 text-primary opacity-75" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass border-green-200 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-vazir text-muted-foreground">ارسال شده</p>
                    <p className="text-xl md:text-2xl font-bold font-shabnam text-green-600">32</p>
                  </div>
                  <Send className="w-8 h-8 text-green-600 opacity-75" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-blue-200 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-vazir text-muted-foreground">صادر شده</p>
                    <p className="text-xl md:text-2xl font-bold font-shabnam text-blue-600">8</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-blue-600 opacity-75" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-gray-200 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-vazir text-muted-foreground">پیش‌نویس</p>
                    <p className="text-xl md:text-2xl font-bold font-shabnam text-gray-600">5</p>
                  </div>
                  <Edit3 className="w-8 h-8 text-gray-600 opacity-75" />
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
                      placeholder="جستجو در کارنامه‌ها..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-10 font-vazir bg-white"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Select value={filterSemester} onValueChange={setFilterSemester}>
                    <SelectTrigger className="w-full sm:w-40 font-vazir bg-white">
                      <SelectValue placeholder="ترم" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">همه ترم‌ها</SelectItem>
                      <SelectItem value="first">ترم اول</SelectItem>
                      <SelectItem value="second">ترم دوم</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-40 font-vazir bg-white">
                      <SelectValue placeholder="وضعیت" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                      <SelectItem value="draft">پیش‌نویس</SelectItem>
                      <SelectItem value="issued">صادر شده</SelectItem>
                      <SelectItem value="sent">ارسال شده</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Report Cards List */}
          <div className="grid gap-4">
            {filteredReportCards.length === 0 ? (
              <Card className="bg-white">
                <CardContent className="p-8 text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground font-vazir">هیچ کارنامه‌ای یافت نشد</p>
                </CardContent>
              </Card>
            ) : (
              filteredReportCards.map((card) => (
                <Card key={card.id} className="hover:shadow-md transition-shadow bg-white">
                  <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <GraduationCap className="w-4 h-4 text-blue-500" />
                          <h3 className="font-semibold font-shabnam text-sm md:text-base">
                            {card.studentName}
                          </h3>
                          <Badge className={`text-xs ${getStatusBadge(card.status)}`}>
                            {card.status === 'draft' && 'پیش‌نویس'}
                            {card.status === 'issued' && 'صادر شده'}
                            {card.status === 'sent' && 'ارسال شده'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {card.semester === 'first' ? 'ترم اول' : 'ترم دوم'} {card.academicYear}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs font-vazir text-muted-foreground mb-1">نمره انضباط</p>
                            <p className={`text-lg font-bold font-shabnam ${getGradeColor(card.disciplinaryGrade)}`}>
                              {card.disciplinaryGrade}
                            </p>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs font-vazir text-muted-foreground mb-1">نمره رفتار</p>
                            <p className={`text-lg font-bold font-shabnam ${getGradeColor(card.behaviorGrade)}`}>
                              {card.behaviorGrade}
                            </p>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs font-vazir text-muted-foreground mb-1">نمره کلی</p>
                            <p className={`text-lg font-bold font-shabnam ${getGradeColor(card.overallGrade)}`}>
                              {card.overallGrade}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground font-vazir">
                          <div className="flex items-center gap-1">
                            <School className="w-3 h-3" />
                            <span>{card.schoolName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>صدور: {new Date(card.issuedAt).toLocaleDateString('fa-IR')}</span>
                          </div>
                        </div>

                        {card.teacherComments && (
                          <p className="text-sm text-muted-foreground mt-2 font-vazir line-clamp-1">
                            نظر معلم: {card.teacherComments}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-row lg:flex-col gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="font-vazir bg-white">
                              <Eye className="w-3 h-3 ml-1" />
                              مشاهده
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl bg-white">
                            <DialogHeader>
                              <DialogTitle className="font-shabnam text-right">کارنامه انضباطی</DialogTitle>
                            </DialogHeader>
                            <ReportCardDetailsView card={card} />
                          </DialogContent>
                        </Dialog>
                        
                        <Button variant="outline" size="sm" className="font-vazir bg-white">
                          <Download className="w-3 h-3 ml-1" />
                          دانلود
                        </Button>
                        
                        {!card.parentNotified && (
                          <Button variant="outline" size="sm" className="font-vazir bg-white">
                            <Send className="w-3 h-3 ml-1" />
                            ارسال
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

function AddReportCardForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    studentId: "",
    semester: "first",
    academicYear: "1402-1403",
    disciplinaryGrade: "",
    behaviorGrade: "",
    teacherComments: "",
    principalComments: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Report card form submitted:", formData);
    onClose();
  };

  return (
    <div className="bg-white">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <Label className="font-shabnam">ترم تحصیلی</Label>
            <Select value={formData.semester} onValueChange={(value) => setFormData({...formData, semester: value})}>
              <SelectTrigger className="bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="first">ترم اول</SelectItem>
                <SelectItem value="second">ترم دوم</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="font-shabnam">سال تحصیلی</Label>
            <Input
              value={formData.academicYear}
              onChange={(e) => setFormData({...formData, academicYear: e.target.value})}
              className="font-vazir bg-white"
              placeholder="1402-1403"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="font-shabnam">نمره انضباط (از 20)</Label>
            <Input
              type="number"
              step="0.1"
              min="0"
              max="20"
              value={formData.disciplinaryGrade}
              onChange={(e) => setFormData({...formData, disciplinaryGrade: e.target.value})}
              className="font-vazir bg-white"
              placeholder="18.5"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-shabnam">نمره رفتار (از 20)</Label>
            <Input
              type="number"
              step="0.1"
              min="0"
              max="20"
              value={formData.behaviorGrade}
              onChange={(e) => setFormData({...formData, behaviorGrade: e.target.value})}
              className="font-vazir bg-white"
              placeholder="19.0"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-shabnam">نظرات معلم</Label>
          <Textarea
            value={formData.teacherComments}
            onChange={(e) => setFormData({...formData, teacherComments: e.target.value})}
            className="font-vazir min-h-20 bg-white"
            placeholder="نظرات و توصیه‌های معلم..."
          />
        </div>

        <div className="space-y-2">
          <Label className="font-shabnam">نظرات مدیر</Label>
          <Textarea
            value={formData.principalComments}
            onChange={(e) => setFormData({...formData, principalComments: e.target.value})}
            className="font-vazir min-h-20 bg-white"
            placeholder="نظرات و توصیه‌های مدیر..."
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="font-vazir bg-white">
            انصراف
          </Button>
          <Button type="submit" className="gradient-primary text-white font-vazir">
            صدور کارنامه
          </Button>
        </div>
      </form>
    </div>
  );
}

function ReportCardDetailsView({ card }: { card: ReportCard }) {
  const getGradeColor = (grade: number) => {
    if (grade >= 18) return "text-green-600";
    if (grade >= 15) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="bg-white">
      <ScrollArea className="max-h-96">
        <div className="space-y-6 p-1">
          {/* Header */}
          <div className="text-center border-b pb-4">
            <h2 className="text-xl font-bold font-shabnam text-primary">کارنامه انضباطی</h2>
            <p className="text-sm font-vazir text-muted-foreground mt-1">{card.schoolName}</p>
            <p className="text-sm font-vazir text-muted-foreground">
              {card.semester === 'first' ? 'ترم اول' : 'ترم دوم'} سال تحصیلی {card.academicYear}
            </p>
          </div>

          {/* Student Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="font-shabnam text-sm text-muted-foreground">نام و نام خانوادگی</Label>
              <p className="font-vazir font-medium">{card.studentName}</p>
            </div>
            <div>
              <Label className="font-shabnam text-sm text-muted-foreground">تاریخ صدور</Label>
              <p className="font-vazir font-medium">{new Date(card.issuedAt).toLocaleDateString('fa-IR')}</p>
            </div>
          </div>

          {/* Grades */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Label className="font-shabnam text-sm text-muted-foreground">نمره انضباط</Label>
              <p className={`text-2xl font-bold font-shabnam mt-2 ${getGradeColor(card.disciplinaryGrade)}`}>
                {card.disciplinaryGrade}
              </p>
              <p className="text-xs font-vazir text-muted-foreground mt-1">از 20</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Label className="font-shabnam text-sm text-muted-foreground">نمره رفتار</Label>
              <p className={`text-2xl font-bold font-shabnam mt-2 ${getGradeColor(card.behaviorGrade)}`}>
                {card.behaviorGrade}
              </p>
              <p className="text-xs font-vazir text-muted-foreground mt-1">از 20</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Label className="font-shabnam text-sm text-muted-foreground">نمره کلی</Label>
              <p className={`text-2xl font-bold font-shabnam mt-2 ${getGradeColor(card.overallGrade)}`}>
                {card.overallGrade}
              </p>
              <p className="text-xs font-vazir text-muted-foreground mt-1">میانگین</p>
            </div>
          </div>

          <Separator />

          {/* Comments */}
          {card.teacherComments && (
            <div>
              <Label className="font-shabnam text-sm text-muted-foreground">نظرات معلم</Label>
              <p className="font-vazir text-sm mt-2 p-3 bg-gray-50 rounded-lg">{card.teacherComments}</p>
            </div>
          )}

          {card.principalComments && (
            <div>
              <Label className="font-shabnam text-sm text-muted-foreground">نظرات مدیر</Label>
              <p className="font-vazir text-sm mt-2 p-3 bg-gray-50 rounded-lg">{card.principalComments}</p>
            </div>
          )}

          {/* Status */}
          <div className="flex flex-wrap gap-2">
            <Badge className={`${getStatusBadge(card.status)}`}>
              {card.status === 'draft' && 'پیش‌نویس'}
              {card.status === 'issued' && 'صادر شده'}
              {card.status === 'sent' && 'ارسال شده'}
            </Badge>
            {card.parentNotified && (
              <Badge className="bg-green-100 text-green-800">
                والدین مطلع شده‌اند
              </Badge>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

function getStatusBadge(status: string) {
  const variants = {
    draft: "bg-gray-100 text-gray-800",
    issued: "bg-blue-100 text-blue-800",
    sent: "bg-green-100 text-green-800"
  };
  return variants[status as keyof typeof variants] || variants.draft;
}